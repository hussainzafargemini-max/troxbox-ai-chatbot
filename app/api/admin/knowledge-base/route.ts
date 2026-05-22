import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/gemini';

/**
 * GET /api/admin/knowledge-base
 * Gated endpoint to retrieve all knowledge base articles for administrative management.
 */
export async function GET() {
  try {
    const { data: articles, error } = await supabaseAdmin
      .from('knowledge_base')
      .select('id, title, content, category, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(articles);
  } catch (err: any) {
    console.error('Error fetching admin Knowledge Base:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve Knowledge Base articles.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/knowledge-base
 * Gated endpoint to create a new Knowledge Base article.
 * AUTOMATICALLY generates 768-dim Gemini vector embedding for the content on save.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, is_active } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Article Title and Content are required fields.' },
        { status: 400 }
      );
    }

    // 1. Generate the vector embedding using Gemini text-embedding-004
    let embeddingVector: number[] | null = null;
    try {
      // We embed the content (or combined title + content for better semantic richness)
      const textToEmbed = `Title: ${title}\nContent: ${content}`;
      embeddingVector = await generateEmbedding(textToEmbed);
    } catch (embErr) {
      console.error('Failed to generate embedding during KB creation:', embErr);
      return NextResponse.json(
        { error: 'Failed to generate AI vector embedding. Please verify your GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    // 2. Insert the article along with its embedding into Supabase
    const { data: article, error } = await supabaseAdmin
      .from('knowledge_base')
      .insert({
        title,
        content,
        category: category || 'General',
        is_active: is_active !== undefined ? is_active : true,
        embedding: embeddingVector,
        updated_at: new Date().toISOString()
      })
      .select('id, title, content, category, is_active, created_at')
      .single();

    if (error) throw error;

    return NextResponse.json(article);
  } catch (err: any) {
    console.error('Error creating KB article:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save Knowledge Base article.' },
      { status: 500 }
    );
  }
}
