"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Calendar, MessageSquare, Trash2, Search, Filter, CheckCircle2, Circle } from "lucide-react";

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

  const toggleReadStatus = async (id: number, currentStatus: boolean) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Messages</h1>
            <p className="text-slate-500 text-sm">View and manage contact form submissions</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full text-sm text-slate-900"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full text-xs text-slate-900"
                />
              </div>
              <span className="text-slate-400 text-xs font-bold">TO</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(["all", "unread", "read"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all capitalize ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMessages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-medium">No messages found matching your filters</p>
              </motion.div>
            ) : (
              filteredMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white p-6 rounded-3xl border transition-all group relative ${
                    msg.isRead ? "border-slate-100 opacity-75" : "border-blue-100 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <User size={16} className={msg.isRead ? "text-slate-400" : "text-blue-500"} />
                        {msg.name}
                        {!msg.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail size={14} />
                        {msg.email}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-lg">
                        {formatDate(msg.createdAt)}
                      </div>
                      <button 
                        onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          msg.isRead ? "text-slate-300 hover:text-blue-500" : "text-blue-500 hover:bg-blue-50"
                        }`}
                        title={msg.isRead ? "Mark as unread" : "Mark as read"}
                      >
                        {msg.isRead ? <Circle size={18} /> : <CheckCircle2 size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className={`text-sm font-bold border-l-2 pl-3 ${
                      msg.isRead ? "text-slate-600 border-slate-200" : "text-slate-900 border-blue-500"
                    }`}>
                      {msg.subject}
                    </div>
                    <p className={`text-sm leading-relaxed p-4 rounded-2xl italic ${
                      msg.isRead ? "text-slate-500 bg-slate-50/50" : "text-slate-600 bg-slate-50"
                    }`}>
                      "{msg.message}"
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
