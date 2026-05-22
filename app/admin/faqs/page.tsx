'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  HelpCircle, 
  Loader2, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export default function FAQManagerPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null);

  // Form Fields
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [isActive, setIsActive] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Confirmation States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Load all FAQs from backend API
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/faqs');
      if (!res.ok) throw new Error('Failed to fetch FAQs.');
      const data = await res.json();
      setFaqs(data as FAQ[]);
    } catch (err: any) {
      console.error('Error fetching FAQs:', err);
      setErrorMsg('Failed to load FAQs. Please verify database connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // 2. Open Modal to Add FAQ
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedFaqId(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setIsActive(true);
    setIsModalOpen(true);
  };

  // 3. Open Modal to Edit FAQ
  const handleOpenEdit = (faq: FAQ) => {
    setModalMode('edit');
    setSelectedFaqId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setIsActive(faq.is_active);
    setIsModalOpen(true);
  };

  // 4. Submit Form (Save or Update FAQ)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || formLoading) return;

    setFormLoading(true);
    setErrorMsg('');

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || 'General',
      is_active: isActive
    };

    try {
      let url = '/api/admin/faqs';
      let method = 'POST';

      if (modalMode === 'edit' && selectedFaqId) {
        url = `/api/admin/faqs/${selectedFaqId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save FAQ.');
      }

      // Close modal and refresh FAQ catalog
      setIsModalOpen(false);
      await fetchFAQs();
    } catch (err: any) {
      console.error('Error saving FAQ:', err);
      setErrorMsg(err?.message || 'Failed to save FAQ. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // 5. Open Delete Confirmation Dialog
  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // 6. Execute Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/faqs/${deleteId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete FAQ.');

      setIsDeleteOpen(false);
      setDeleteId(null);
      await fetchFAQs();
    } catch (err: any) {
      console.error('Error deleting FAQ:', err);
      setErrorMsg('Failed to delete FAQ. Please try again.');
    }
  };

  // 7. Filtered FAQ search list
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <span>FAQ Manager</span>
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Create, update, and manage frequently asked questions. Active FAQs are automatically used as LLM search fallback.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-2.5 text-xs text-red-600 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative flex items-center w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100">
        <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search FAQs by question, answer, category..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent border-none rounded-xl focus:outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* 2. FAQs Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-bold text-gray-400">Loading active FAQs...</span>
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <HelpCircle className="w-10 h-10 mx-auto opacity-20" />
            <p className="text-xs font-semibold">No FAQs found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-6 py-4 w-28">Category</th>
                  <th className="px-6 py-4">Question</th>
                  <th className="px-6 py-4">Answer</th>
                  <th className="px-6 py-4 w-20 text-center">Status</th>
                  <th className="px-6 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredFAQs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      <span className="bg-indigo-50 px-2 py-1 rounded-md text-[10px] tracking-wide uppercase">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 max-w-[200px] truncate" title={faq.question}>
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-[300px] truncate" title={faq.answer}>
                      {faq.answer}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        faq.is_active 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        {faq.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(faq)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all focus:outline-none"
                        title="Edit FAQ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(faq.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all focus:outline-none"
                        title="Delete FAQ"
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

      {/* 3. Add/Edit Form Dialog Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl w-full max-w-xl p-6 relative animate-in zoom-in-95 duration-200 mx-4">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-400 hover:text-gray-600 transition-all focus:outline-none"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black tracking-tight text-gray-900 mb-6 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>{modalMode === 'edit' ? 'Edit FAQ Item' : 'Add New FAQ Item'}</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Shipping, Returns"
                    className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-gray-800"
                  />
                </div>
                
                <div className="space-y-1 flex flex-col justify-end pb-1.5 pl-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-indigo-500 focus:ring-offset-0 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-gray-600">Active (Publish live)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                  Customer Question
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What is your return policy?"
                  className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
                  Database Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide complete factual answer that the AI support chatbot can fetch..."
                  className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-gray-800 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 active:bg-gray-100 transition-all focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !question.trim() || !answer.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 focus:outline-none"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save FAQ Item</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200 mx-4">
            
            <h3 className="text-base font-black text-gray-900 mb-3">Delete FAQ Item?</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-semibold">
              Are you sure you want to permanently delete this FAQ item? This action is irreversible and the AI chatbot will no longer be able to use it as search fallback.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 active:bg-gray-100 transition-all focus:outline-none"
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
