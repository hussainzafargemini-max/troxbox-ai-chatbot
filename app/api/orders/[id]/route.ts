import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateOrderNumber } from '@/lib/guards';

/**
 * GET /api/orders/[id]
 * Public endpoint to fetch order status using standard order number (e.g. TRX-1001).
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderNumber = params.id?.toUpperCase();

    // 1. Validate order number structure (TRX-XXXX) to prevent injection or invalid lookups
    if (!validateOrderNumber(orderNumber)) {
      return NextResponse.json(
        { error: "Invalid order ID format. Please verify and use format: TRX-XXXX" },
        { status: 400 }
      );
    }

    // 2. Query orders table
    const { data: order, error } = await supabaseAdmin
      .from('demo_orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    // 3. Handle non-existent order
    if (error || !order) {
      return NextResponse.json(
        { error: `I couldn't find an order with ID ${orderNumber}. Please double-check.` },
        { status: 404 }
      );
    }

    // 4. Return order details
    return NextResponse.json({
      order_number: order.order_number,
      customer_name: order.customer_name,
      status: order.status,
      tracking_id: order.tracking_id || 'N/A',
      courier: order.courier || 'N/A',
      estimated_delivery: order.estimated_delivery || 'N/A',
      notes: order.notes || 'No additional notes.'
    });
  } catch (err: any) {
    console.error('Error fetching order status:', err);
    return NextResponse.json(
      { error: 'Internal server error while looking up order.' },
      { status: 500 }
    );
  }
}
