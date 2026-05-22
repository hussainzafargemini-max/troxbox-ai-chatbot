import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/settings
 * Public endpoint to fetch active chatbot branding configurations.
 */
export async function GET() {
  try {
    // Query singleton chatbot settings
    const { data: settings, error } = await supabaseAdmin
      .from('chatbot_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      // If it doesn't exist yet, return safe defaults
      return NextResponse.json({
        business_name: 'Trox Box',
        bot_name: 'TroxBot',
        welcome_message: 'Hi! 👋 Welcome to Trox Box. How can I help you with your clothing order today?',
        fallback_message: 'I don’t have enough information about that in my knowledge base. Please reach out to our support team at support@troxbox.com, and we will be happy to help!',
        allowed_topics: ['Orders', 'Parcel Tracking', 'Returns/Refunds', 'Product Information', 'Shipping', 'Payment', 'Business Timings', 'Contact Support'],
        primary_color: '#6366F1'
      });
    }

    return NextResponse.json(settings);
  } catch (err: any) {
    console.error('Error fetching chatbot settings:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
