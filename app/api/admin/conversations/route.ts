import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/conversations
 * Gated endpoint to retrieve all logged chatbot conversations for admin review.
 */
export async function GET() {
  try {
    const { data: logs, error } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(logs);
  } catch (err: any) {
    console.error('Error fetching conversation logs:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve conversation logs.' },
      { status: 500 }
    );
  }
}
