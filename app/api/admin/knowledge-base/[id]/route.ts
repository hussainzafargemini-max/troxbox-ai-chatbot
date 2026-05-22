import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/gemini';

/**
 * PUT /api/admin/knowledge-base/[id]
 * Gated endpoint to update an existing Knowledge Base article.
 * REGENERATES vector embedding automatically if title or content changes.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, category, is_active } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Article Title and Content are required fields.' },
        { status: 400 }
      );
    }

    // 1. Generate the updated vector embedding using Gemini text-embedding-004
    let embeddingVector: number[] | null = null;
    try {
      const textToEmbed = `Title: ${title}\nContent: ${content}`;
      embeddingVector = await generateEmbedding(textToEmbed);
    } catch (embErr) {
      console.error('Failed to generate embedding during KB update:', embErr);
      return NextResponse.json(
        { error: 'Failed to generate updated AI vector embedding. Verify your GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    // 2. Update database record
    const { data: article, error } = await supabaseAdmin
      .from('knowledge_base')
      .update({
        title,
        content,
        category: category || 'General',
        is_active: is_active !== undefined ? is_active : true,
        embedding: embeddingVector,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, title, content, category, is_active, updated_at')
      .single();

    if (error) throw error;

    return NextResponse.json(article);
  } catch (err: any) {
    console.error(`Error updating KB article ${params.id}:`, err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update Knowledge Base article.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/knowledge-base/[id]
 * Gated endpoint to delete a Knowledge Base article.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('knowledge_base')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Knowledge Base article deleted successfully.' });
  } catch (err: any) {
    console.error(`Error deleting KB article ${params.id}:`, err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete Knowledge Base article.' },
      { status: 500 }
    );
  }
}
