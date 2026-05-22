import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/faqs
 * Gated endpoint to retrieve all FAQs (active & inactive) for admin CMS tables.
 */
export async function GET() {
  try {
    const { data: faqs, error } = await supabaseAdmin
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(faqs);
  } catch (err: any) {
    console.error('Error fetching admin FAQs:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve FAQs.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/faqs
 * Gated endpoint to create a new FAQ entry.
 */
export async function POST(request: Request) {
  try {
    const { question, answer, category, is_active } = await request.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and Answer fields are required.' },
        { status: 400 }
      );
    }

    const { data: faq, error } = await supabaseAdmin
      .from('faqs')
      .insert({
        question,
        answer,
        category: category || 'General',
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(faq);
  } catch (err: any) {
    console.error('Error creating FAQ:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create new FAQ.' },
      { status: 500 }
    );
  }
}
