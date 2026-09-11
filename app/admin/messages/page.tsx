'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  RefreshCw,
  MessageSquare,
  User,
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'RESOLVED' | 'ARCHIVED';
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Selected message for detailed inspection modal / panel
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();

      setMessages(data.messages || []);
      setUnreadCount(data.unreadCount || 0);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateStatus = async (id: string, newStatus: 'UNREAD' | 'READ' | 'RESOLVED' | 'ARCHIVED') => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      fetchMessages();
    } catch (err: any) {
      alert(err.message || 'Could not update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this contact inquiry?')) {
      return;
    }

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete message');

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (err: any) {
      alert(err.message || 'Could not delete message');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    switch (status) {
      case 'UNREAD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
            Unread
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
            Read
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
            Resolved
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Contact Inquiries
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage and respond to incoming inquiries and support requests.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMessages()}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'UNREAD', 'READ', 'RESOLVED', 'ARCHIVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'ALL' ? 'All Inquiries' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading inquiries from database...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Inquiries Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try changing your search keywords or filter criteria.'
              : 'There are currently no contact form submissions in the system.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages list */}
          <div className="lg:col-span-2 space-y-3">
            {messages.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedMessage(item);
                  if (item.status === 'UNREAD') {
                    handleUpdateStatus(item.id, 'READ');
                  }
                }}
                className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedMessage?.id === item.id
                    ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-500/10'
                    : item.status === 'UNREAD'
                    ? 'border-amber-300 dark:border-amber-500/30 bg-amber-50/30 dark:bg-slate-900/80 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {item.subject}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {item.message}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{item.email}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{item.phone}</span>
                    </span>
                  </div>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Details / Action Pane */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-6 sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Inquiry Details</h3>
                  {getStatusBadge(selectedMessage.status)}
                </div>

                {/* Contact Identity */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedMessage.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 text-xs">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 hover:underline font-medium"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="break-all">{selectedMessage.email}</span>
                    </a>

                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedMessage.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Subject & Message Content */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Subject</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedMessage.subject}</p>
                  
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">Full Message</p>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Technical Forensics */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Received:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedMessage.ipAddress && (
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{selectedMessage.ipAddress}</span>
                    </div>
                  )}
                </div>

                {/* Status Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Actions</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMessage.status !== 'RESOLVED' ? (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'RESOLVED')}
                        disabled={actionLoading === selectedMessage.id}
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'UNREAD')}
                        disabled={actionLoading === selectedMessage.id}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mark Unread</span>
                      </button>
                    )}

                    {selectedMessage.status !== 'ARCHIVED' ? (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'ARCHIVED')}
                        disabled={actionLoading === selectedMessage.id}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(selectedMessage.id, 'READ')}
                        disabled={actionLoading === selectedMessage.id}
                        className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Unarchive</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    disabled={actionLoading === selectedMessage.id}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs">
                Select an inquiry from the list to view its complete details, metadata, and resolution options.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
