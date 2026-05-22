import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * PUT /api/admin/faqs/[id]
 * Gated endpoint to update an existing FAQ.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { question, answer, category, is_active } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and Answer fields are required.' },
        { status: 400 }
      );
    }

    const { data: faq, error } = await supabaseAdmin
      .from('faqs')
      .update({
        question,
        answer,
        category: category || 'General',
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(faq);
  } catch (err: any) {
    console.error(`Error updating FAQ ${params.id}:`, err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update FAQ.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/faqs/[id]
 * Gated endpoint to delete an FAQ entry.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (err: any) {
    console.error(`Error deleting FAQ ${params.id}:`, err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete FAQ.' },
      { status: 500 }
    );
  }
}
