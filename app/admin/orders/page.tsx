'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Check, 
  AlertCircle,
  Truck,
  FileText
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  tracking_id: string | null;
  courier: string | null;
  estimated_delivery: string | null;
  notes: string | null;
  created_at: string;
}

export default function OrderManagerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState<'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled'>('Processing');
  const [courier, setCourier] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Delete Confirmation States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch all orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch orders.');
      const data = await res.json();
      setOrders(data as Order[]);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setErrorMsg('Failed to load orders database. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Open Add Order Modal
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedOrderId(null);
    setCustomerName('');
    setStatus('Processing');
    setCourier('');
    setTrackingId('');
    setEstimatedDelivery('');
    setNotes('');
    setIsModalOpen(true);
  };

  // 3. Open Edit Order Modal
  const handleOpenEdit = (order: Order) => {
    setModalMode('edit');
    setSelectedOrderId(order.id);
    setCustomerName(order.customer_name);
    setStatus(order.status);
    setCourier(order.courier || '');
    setTrackingId(order.tracking_id || '');
    setEstimatedDelivery(order.estimated_delivery || '');
    setNotes(order.notes || '');
    setIsModalOpen(true);
  };

  // 4. Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || formLoading) return;

    setFormLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      id: selectedOrderId,
      customer_name: customerName.trim(),
      status,
      courier: courier.trim() || null,
      tracking_id: trackingId.trim() || null,
      estimated_delivery: estimatedDelivery.trim() || null,
      notes: notes.trim() || null
    };

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save e-commerce order.');
      }

      setIsModalOpen(false);
      setSuccessMsg(modalMode === 'edit' ? 'Order updated successfully!' : 'New order generated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      await fetchOrders();
    } catch (err: any) {
      console.error('Error saving order:', err);
      setErrorMsg(err?.message || 'Failed to save order details.');
    } finally {
      setFormLoading(false);
    }
  };

  // 5. Open Delete Dialog
  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // 6. Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete order.');

      setIsDeleteOpen(false);
      setDeleteId(null);
      setSuccessMsg('Order record deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
      await fetchOrders();
    } catch (err: any) {
      console.error('Error deleting order:', err);
      setErrorMsg('Failed to delete order. Please try again.');
    }
  };

  // 7. Filtered Orders search list
  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.courier && order.courier.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.tracking_id && order.tracking_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#f5f0eb] tracking-tight flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-[#c9a87c]" />
            <span>Sample E-Commerce Orders</span>
          </h1>
          <p className="text-xs text-[#5a5550] font-semibold mt-1">
            Manage mock storefront orders. Creating or modifying order statuses allows direct sandbox testing of the chatbot`s parsing tracking intent capabilities.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#c9a87c] hover:bg-[#b09878] text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Order</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/10 rounded-2xl flex items-start space-x-2.5 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-400">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{successMsg}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative flex items-center w-full max-w-md bg-[#141414] rounded-xl shadow-sm border border-white/[0.04]">
        <Search className="absolute left-3.5 w-4 h-4 text-[#5a5550]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders by number, customer, courier tracking..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent border-none rounded-xl focus:outline-none text-[#f5f0eb] placeholder-gray-400"
        />
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#141414] rounded-2xl border border-white/[0.04] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#c9a87c]" />
            <span className="text-xs font-bold text-[#5a5550]">Loading orders catalog...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-[#5a5550] space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto opacity-20" />
            <p className="text-xs font-semibold">No orders logged in database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.04] text-[#5a5550] font-bold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-6 py-4 w-32">Order Number</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Shipment Courier</th>
                  <th className="px-6 py-4">Estimated Delivery</th>
                  <th className="px-6 py-4 w-28 text-center">Status</th>
                  <th className="px-6 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#8a8580]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#f5f0eb] select-all">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#f5f0eb]">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-[#5a5550] whitespace-nowrap">
                      {order.courier ? (
                        <span className="flex items-center space-x-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#5a5550]" />
                          <span>{order.courier} ({order.tracking_id || 'N/A'})</span>
                        </span>
                      ) : (
                        <span className="text-gray-300">Not Shipped Yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#5a5550] font-semibold">
                      {order.estimated_delivery || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' :
                        order.status === 'Out for Delivery' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' :
                        order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                        'bg-red-500/10 text-red-400 border border-red-500/10'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(order)}
                        className="p-2 text-[#5a5550] hover:text-[#c9a87c] hover:bg-[#c9a87c]/5 rounded-xl transition-all focus:outline-none"
                        title="Edit Order Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(order.id)}
                        className="p-2 text-[#5a5550] hover:text-red-400 hover:bg-red-500/10/50 rounded-xl transition-all focus:outline-none"
                        title="Delete Order Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Add/Edit Form Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-lg p-6 relative mx-4">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.04] active:bg-white/[0.05] text-[#5a5550] hover:text-[#8a8580] transition-all focus:outline-none"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black tracking-tight text-[#f5f0eb] mb-6 flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#c9a87c]" />
              <span>{modalMode === 'edit' ? 'Edit Order Details' : 'Generate New Sample Order'}</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                    Shipping Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                    Courier Partner (e.g. UPS, FedEx)
                  </label>
                  <input
                    type="text"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    placeholder="e.g. UPS"
                    className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                    Tracking ID Number
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g. 1Z999AA1012345..."
                    className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                  Estimated Delivery Schedule Description
                </label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g. May 24, 2026, or Today by 7:00 PM"
                  className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                  Courier Shipping Notes / Comments
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Package left on front porch."
                  className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb] resize-none font-sans"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.06] text-[#8a8580] text-xs font-bold hover:bg-white/[0.02] active:bg-white/[0.03] transition-all focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !customerName.trim()}
                  className="bg-[#c9a87c] hover:bg-[#b09878] active:bg-[#9a7d5a] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 focus:outline-none"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Order...</span>
                    </>
                  ) : (
                    <span>Save Order Details</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-sm p-6 relative mx-4">
            
            <h3 className="text-base font-black text-[#f5f0eb] mb-3">Delete Order Record?</h3>
            <p className="text-xs text-[#5a5550] leading-relaxed mb-6 font-semibold">
              Are you sure you want to permanently delete this e-commerce order record? The customer support chatbot will no longer be able to track this order number.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-white/[0.06] text-[#8a8580] rounded-xl text-xs font-bold hover:bg-white/[0.02] active:bg-white/[0.03] transition-all focus:outline-none"
              >
                No, Keep
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all focus:outline-none"
              >
                Yes, Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
