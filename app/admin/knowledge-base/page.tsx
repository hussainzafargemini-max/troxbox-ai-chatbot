'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Loader2, 
  Check, 
  X,
  AlertCircle,
  BrainCircuit
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function KnowledgeBaseManagerPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isActive, setIsActive] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Confirmation States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch Knowledge Base articles from API
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/knowledge-base');
      if (!res.ok) throw new Error('Failed to fetch Knowledge Base articles.');
      const data = await res.json();
      setArticles(data as Article[]);
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setErrorMsg('Failed to load Knowledge Base. Please verify environment configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 2. Open Modal to Add Article
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedArticleId(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setIsActive(true);
    setIsModalOpen(true);
  };

  // 3. Open Modal to Edit Article
  const handleOpenEdit = (article: Article) => {
    setModalMode('edit');
    setSelectedArticleId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setCategory(article.category);
    setIsActive(article.is_active);
    setIsModalOpen(true);
  };

  // 4. Submit Form (Save or Update Article)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || formLoading) return;

    setFormLoading(true);
    setErrorMsg('');

    const payload = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
      is_active: isActive
    };

    try {
      let url = '/api/admin/knowledge-base';
      let method = 'POST';

      if (modalMode === 'edit' && selectedArticleId) {
        url = `/api/admin/knowledge-base/${selectedArticleId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save Knowledge Base article.');
      }

      setIsModalOpen(false);
      await fetchArticles();
    } catch (err: any) {
      console.error('Error saving article:', err);
      setErrorMsg(err?.message || 'Failed to save article. Make sure GEMINI_API_KEY is configured.');
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
      const res = await fetch(`/api/admin/knowledge-base/${deleteId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete Knowledge Base article.');

      setIsDeleteOpen(false);
      setDeleteId(null);
      await fetchArticles();
    } catch (err: any) {
      console.error('Error deleting article:', err);
      setErrorMsg('Failed to delete article. Please try again.');
    }
  };

  // 7. Filtered Search Results
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#f5f0eb] tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-[#c9a87c]" />
            <span>Knowledge Base Manager</span>
          </h1>
          <p className="text-xs text-[#5a5550] font-semibold mt-1">
            Publish brand guides and policies. Adding or modifying articles automatically generates vector embeddings for semantic RAG search in real-time.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#c9a87c] hover:bg-[#b09878] text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Article</span>
        </button>
      </div>

      {/* Error notification banner */}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/10 rounded-2xl flex items-start space-x-2.5 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative flex items-center w-full max-w-md bg-[#141414] rounded-xl shadow-sm border border-white/[0.04]">
        <Search className="absolute left-3.5 w-4 h-4 text-[#5a5550]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by title, content, category..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent border-none rounded-xl focus:outline-none text-[#f5f0eb] placeholder-gray-400"
        />
      </div>

      {/* Table Container */}
      <div className="bg-[#141414] rounded-2xl border border-white/[0.04] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#c9a87c]" />
            <span className="text-xs font-bold text-[#5a5550]">Loading Knowledge Base articles...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 text-[#5a5550] space-y-2">
            <BookOpen className="w-10 h-10 mx-auto opacity-20" />
            <p className="text-xs font-semibold">No articles found in Knowledge Base.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.04] text-[#5a5550] font-bold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-6 py-4 w-28">Category</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Body snippet</th>
                  <th className="px-6 py-4 w-24 text-center">RAG Embedding</th>
                  <th className="px-6 py-4 w-20 text-center">Status</th>
                  <th className="px-6 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#8a8580]">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#c9a87c]">
                      <span className="bg-[#c9a87c]/10 px-2 py-1 rounded-md text-[10px] tracking-wide uppercase">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#f5f0eb] max-w-[160px] truncate" title={article.title}>
                      {article.title}
                    </td>
                    <td className="px-6 py-4 text-[#5a5550] max-w-[280px] truncate" title={article.content}>
                      {article.content}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center space-x-1 bg-violet-500/10 text-violet-400 border border-violet-500/10 px-2 py-0.5 rounded-md text-[9px] font-black uppercase">
                        <BrainCircuit className="w-3 h-3" />
                        <span>Vectorized</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        article.is_active 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' 
                          : 'bg-zinc-100 text-[#5a5550]'
                      }`}>
                        {article.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(article)}
                        className="p-2 text-[#5a5550] hover:text-[#c9a87c] hover:bg-[#c9a87c]/5 rounded-xl transition-all focus:outline-none"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(article.id)}
                        className="p-2 text-[#5a5550] hover:text-red-400 hover:bg-red-500/10/50 rounded-xl transition-all focus:outline-none"
                        title="Delete Article"
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

      {/* 3. Add/Edit Article Dialog Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.5)] rounded-2xl w-full max-w-xl p-6 relative mx-4">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.04] active:bg-white/[0.05] text-[#5a5550] hover:text-[#8a8580] transition-all focus:outline-none"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black tracking-tight text-[#f5f0eb] mb-6 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#c9a87c]" />
              <span>{modalMode === 'edit' ? 'Edit Knowledge Base Article' : 'Add Knowledge Base Article'}</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Sizing, Care Instructions"
                    className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
                  />
                </div>
                
                <div className="space-y-1 flex flex-col justify-end pb-1.5 pl-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#c9a87c] bg-white/[0.03] border-gray-300 rounded-lg focus:ring-[#c9a87c] focus:ring-offset-0 focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#8a8580]">Active (Publish live)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sizing Guide and Fit Instructions"
                  className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                  Database Content (Vectorized for RAG)
                </label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write clear, comprehensive details. The AI chatbot will extract snippets of this block to answer matching customer queries..."
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
                  disabled={formLoading || !title.trim() || !content.trim()}
                  className="bg-[#c9a87c] hover:bg-[#b09878] active:bg-[#9a7d5a] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2 focus:outline-none"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Vectorizing & Saving...</span>
                    </>
                  ) : (
                    <span>Save & Vectorize</span>
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
            
            <h3 className="text-base font-black text-[#f5f0eb] mb-3">Delete Article?</h3>
            <p className="text-xs text-[#5a5550] leading-relaxed mb-6 font-semibold">
              Are you sure you want to permanently delete this Knowledge Base article? This will remove its text content and 768-dimensional AI search vectors from our system.
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
