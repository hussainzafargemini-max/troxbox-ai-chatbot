import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * GET /api/admin/orders
 * Gated endpoint to fetch all demo orders for admin table.
 */
export async function GET() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('demo_orders')
      .select('*')
      .order('order_number', { ascending: false });

    if (error) throw error;

    return NextResponse.json(orders);
  } catch (err: any) {
    console.error('Error fetching admin orders:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve orders.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/orders
 * Gated endpoint to create or update a demo order.
 * If body contains 'id', updates existing order; otherwise inserts a new one.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      order_number,
      customer_name,
      status,
      tracking_id,
      courier,
      estimated_delivery,
      notes
    } = body;

    if (!customer_name || !status) {
      return NextResponse.json(
        { error: 'Customer Name and Status are required fields.' },
        { status: 400 }
      );
    }

    if (id) {
      // Perform Update
      const { data: order, error } = await supabaseAdmin
        .from('demo_orders')
        .update({
          customer_name,
          status,
          tracking_id: tracking_id || null,
          courier: courier || null,
          estimated_delivery: estimated_delivery || null,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(order);
    } else {
      // Perform Insert (Generate next TRX order number if not supplied)
      let finalOrderNumber = order_number;
      if (!finalOrderNumber) {
        // Query last order to compute next count
        const { data: lastOrder } = await supabaseAdmin
          .from('demo_orders')
          .select('order_number')
          .order('order_number', { ascending: false })
          .limit(1);

        let nextCount = 1006;
        if (lastOrder && lastOrder.length > 0) {
          const match = lastOrder[0].order_number.match(/TRX-(\d+)/);
          if (match) {
            nextCount = parseInt(match[1], 10) + 1;
          }
        }
        finalOrderNumber = `TRX-${nextCount}`;
      }

      const { data: order, error } = await supabaseAdmin
        .from('demo_orders')
        .insert({
          order_number: finalOrderNumber,
          customer_name,
          status,
          tracking_id: tracking_id || null,
          courier: courier || null,
          estimated_delivery: estimated_delivery || null,
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(order);
    }
  } catch (err: any) {
    console.error('Error saving demo order:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save order.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/orders
 * Gated endpoint to delete a demo order using query param ?id=UUID
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID parameter (?id=...) is required.' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('demo_orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Order deleted successfully.' });
  } catch (err: any) {
    console.error('Error deleting order:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete order.' },
      { status: 500 }
    );
  }
}
