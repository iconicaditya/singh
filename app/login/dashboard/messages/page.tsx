"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Calendar, MessageSquare, Trash2, Search, Filter, CheckCircle2, Circle, X, Eye, ChevronRight } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: true }),
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleReadStatus = async (id: number, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleMessageClick = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markAsRead(msg.id);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch = 
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const msgDate = msg.createdAt ? msg.createdAt.split('T')[0] : "";
      const matchesStartDate = !startDate || msgDate >= startDate;
      const matchesEndDate = !endDate || msgDate <= endDate;
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "read" && msg.isRead) || 
        (statusFilter === "unread" && !msg.isRead);
      
      return matchesSearch && matchesStartDate && matchesEndDate && matchesStatus;
    });
  }, [messages, searchQuery, startDate, endDate, statusFilter]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const formatFullDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Inbox</h1>
            <p className="text-slate-500 text-sm">Manage your correspondence</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full text-sm text-slate-900"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-900"
              />
            </div>

            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(["all", "unread", "read"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all capitalize ${
                    statusFilter === status 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white h-12 rounded-xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-500 font-medium">No messages found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((msg) => (
                      <motion.tr
                        key={msg.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleMessageClick(msg)}
                        className={`group cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${
                          !msg.isRead ? "bg-white" : "bg-slate-50/30"
                        }`}
                      >
                        <td className="pl-4 py-3 w-10">
                          <button 
                            onClick={(e) => toggleReadStatus(msg.id, msg.isRead, e)}
                            className={`p-1 rounded-full transition-colors ${
                              msg.isRead ? "text-slate-300 hover:text-blue-500" : "text-blue-500"
                            }`}
                          >
                            {msg.isRead ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                        </td>
                        <td className={`py-3 px-2 w-48 truncate text-sm ${!msg.isRead ? "font-black text-slate-900" : "font-medium text-slate-600"}`}>
                          {msg.name}
                        </td>
                        <td className="py-3 px-2 flex-1">
                          <div className="flex items-center gap-2 max-w-[500px]">
                            <span className={`text-sm truncate ${!msg.isRead ? "font-bold text-slate-900" : "text-slate-700"}`}>
                              {msg.subject}
                            </span>
                            <span className="text-slate-400 text-sm truncate flex-1">
                              - {msg.message}
                            </span>
                          </div>
                        </td>
                        <td className={`py-3 pr-4 text-right text-xs w-24 whitespace-nowrap ${!msg.isRead ? "font-bold text-blue-600" : "text-slate-400"}`}>
                          {formatDate(msg.createdAt)}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                    {selectedMessage.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 leading-tight">{selectedMessage.name}</h3>
                    <p className="text-xs text-slate-500">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                    {formatFullDate(selectedMessage.createdAt)}
                  </span>
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-2">{selectedMessage.subject}</h2>
                  <div className="w-12 h-1 bg-blue-500 rounded-full" />
                </div>
                
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                  "{selectedMessage.message}"
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  Close Message
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
