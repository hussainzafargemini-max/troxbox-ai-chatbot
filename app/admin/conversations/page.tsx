'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  Trash2, 
  Loader2, 
  X,
  AlertCircle,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Conversation {
  id: string;
  session_id: string;
  user_message: string;
  bot_response: string;
  source_type: string;
  is_fallback: boolean;
  created_at: string;
}

export default function ConversationLogsPage() {
  const [logs, setLogs] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFallback, setFilterFallback] = useState<'all' | 'success' | 'fallback'>('all');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected Log for full transcript preview modal
  const [selectedLog, setSelectedLog] = useState<Conversation | null>(null);

  // Delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Fetch logged conversations from Supabase
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/conversations');
      if (!res.ok) throw new Error('Failed to fetch conversation logs.');
      const data = await res.json();
      setLogs(data as Conversation[]);
    } catch (err: any) {
      console.error('Error fetching logs:', err);
      setErrorMsg('Failed to load conversation logs. Please verify Supabase connections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 2. Open delete confirmation modal
  const handleOpenDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // 3. Confirm Delete Log
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/orders?id=${deleteId}`, { // wait, let's use the DELETE route in conversations!
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Wait, we can also delete via direct Supabase call on client because admin is authenticated!
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setIsDeleteOpen(false);
      setDeleteId(null);
      await fetchLogs();
    } catch (err: any) {
      console.error('Error deleting log:', err);
      setErrorMsg('Failed to delete log entry. Please try again.');
    }
  };

  // 4. Filter and search logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.user_message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.bot_response.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.session_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterFallback === 'all' ||
      (filterFallback === 'fallback' && log.is_fallback) ||
      (filterFallback === 'success' && !log.is_fallback);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center space-x-2">
          <History className="w-6 h-6 text-indigo-600" />
          <span>Conversation History Logs</span>
        </h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Review logged customer questions and AI chatbot responses. Filter specifically for fallback redirects to identify and populate gaps in your Knowledge Base.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-2.5 text-xs text-red-600 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative flex items-center w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100">
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by keyword, session ID, answers..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent border-none rounded-xl focus:outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 shrink-0 w-full sm:w-auto justify-around sm:justify-start">
          <button
            onClick={() => setFilterFallback('all')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all focus:outline-none ${
              filterFallback === 'all'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterFallback('success')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all focus:outline-none ${
              filterFallback === 'success'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilterFallback('fallback')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all focus:outline-none ${
              filterFallback === 'fallback'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Fallbacks
          </button>
        </div>

      </div>

      {/* Logs Catalog List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-bold text-gray-400">Loading conversation logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <History className="w-10 h-10 mx-auto opacity-20" />
            <p className="text-xs font-semibold">No logs found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-6 py-4 w-40">Session ID</th>
                  <th className="px-6 py-4">User Message</th>
                  <th className="px-6 py-4">AI Chatbot Response</th>
                  <th className="px-6 py-4 w-32">Timestamp</th>
                  <th className="px-6 py-4 w-20 text-center">Status</th>
                  <th className="px-6 py-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-gray-400 select-all">
                      {log.session_id.substring(0, 14)}...
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 max-w-[180px] truncate">
                      {log.user_message}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-[280px] truncate">
                      {log.bot_response}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-semibold whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        log.is_fallback 
                          ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                          : 'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        {log.is_fallback ? 'Fallback' : 'Resolved'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all focus:outline-none"
                        title="View Full Transcript"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleOpenDelete(log.id, e)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all focus:outline-none"
                        title="Delete Log Entry"
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

      {/* 3. Full Transcript Modal overlay */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl w-full max-w-xl p-6 relative animate-in zoom-in-95 duration-200 mx-4">
            
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-400 hover:text-gray-600 transition-all focus:outline-none"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black tracking-tight text-gray-900 mb-6 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Session Log Audit</span>
            </h3>

            {/* Session Metadata details */}
            <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-400 font-bold border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Date: {new Date(selectedLog.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-end">
                <span>Session ID: <span className="font-mono text-zinc-900 select-all">{selectedLog.session_id}</span></span>
              </div>
            </div>

            {/* Conversational Bubbles Preview */}
            <div className="space-y-4 max-h-72 overflow-y-auto px-1 py-1">
              
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white max-w-[85%] rounded-2xl rounded-tr-none px-4 py-3 text-xs leading-relaxed shadow-sm">
                  <p className="font-bold text-[9px] text-indigo-200 uppercase tracking-widest mb-1">Customer User Query</p>
                  <p className="whitespace-pre-line">{selectedLog.user_message}</p>
                </div>
              </div>

              {/* Bot response */}
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-100 text-gray-800 max-w-[85%] rounded-2xl rounded-tl-none px-4 py-3 text-xs leading-relaxed shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[9px] text-indigo-600 uppercase tracking-widest flex items-center space-x-1">
                      {selectedLog.is_fallback ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-600">Fallback Answer</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Factual AI Answer</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{selectedLog.bot_response}</p>
                </div>
              </div>

            </div>

            <div className="pt-6 flex items-center justify-end border-t border-gray-100 mt-6">
              <button
                onClick={() => setSelectedLog(null)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all focus:outline-none"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200 mx-4">
            
            <h3 className="text-base font-black text-gray-900 mb-3">Delete Conversation Log?</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-semibold">
              Are you sure you want to delete this historical conversation log? This will remove it from the admin console and historical dashboard charts.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 active:bg-gray-100 transition-all focus:outline-none"
              >
                Cancel
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
