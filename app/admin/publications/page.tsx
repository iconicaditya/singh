"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  FileText,
  Loader2,
  BookOpen
} from "lucide-react";
import PublicationForm from "@/components/publications/PublicationForm";

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<any>(null);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/publications", { cache: 'no-store' });
      const data = await res.json();
      setPublications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    try {
      const res = await fetch(`/api/publications?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPublications();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = publications.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Manage Publications</h1>
          <p className="text-slate-500 font-medium">Add, edit, or remove research papers from the lab database.</p>
        </div>
        <button
          onClick={() => { setEditingPub(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} /> Add Publication
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search publications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((pub) => (
            <div 
              key={pub.id}
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-16 h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                <BookOpen className="text-slate-300" size={32} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900 truncate mb-1">{pub.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="font-bold text-blue-600 uppercase tracking-widest text-[10px]">{pub.type}</span>
                  <span>{pub.year}</span>
                  <span className="truncate max-w-[200px]">{pub.authors}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingPub(pub); setIsFormOpen(true); }}
                  className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(pub.id)}
                  className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
                <div className="w-px h-8 bg-slate-100 mx-2" />
                {pub.pdfUrl && (
                  <a href={pub.pdfUrl} target="_blank" className="p-3 text-slate-400 hover:text-slate-900 transition-all">
                    <FileText size={18} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <PublicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchPublications}
        initialData={editingPub}
      />
    </div>
  );
}
