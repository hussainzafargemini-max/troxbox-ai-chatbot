import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * POST /api/admin/settings
 * Gated endpoint for admins to upsert global chatbot settings (bot name, colors, allowed topics, welcome msg).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      business_name,
      bot_name,
      welcome_message,
      fallback_message,
      allowed_topics,
      primary_color
    } = body;

    // 1. Look for existing chatbot settings row
    const { data: existingRows } = await supabaseAdmin
      .from('chatbot_settings')
      .select('id')
      .limit(1);

    let result;
    if (existingRows && existingRows.length > 0) {
      // Update existing singleton row
      const existingId = existingRows[0].id;
      const { data, error } = await supabaseAdmin
        .from('chatbot_settings')
        .update({
          business_name,
          bot_name,
          welcome_message,
          fallback_message,
          allowed_topics,
          primary_color,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new settings row
      const { data, error } = await supabaseAdmin
        .from('chatbot_settings')
        .insert({
          business_name,
          bot_name,
          welcome_message,
          fallback_message,
          allowed_topics,
          primary_color
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error updating chatbot settings:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update chatbot settings.' },
      { status: 500 }
    );
  }
}
