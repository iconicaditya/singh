"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layout,
  Loader2,
  BookOpen
} from "lucide-react";
import ResearchGalleryForm from "@/components/research/ResearchGalleryForm";

export default function AdminResearchPage() {
  const [researchList, setResearchList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState<any>(null);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/research", { cache: 'no-store' });
      const data = await res.json();
      setResearchList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this research focus?")) return;
    try {
      const res = await fetch(`/api/research?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchResearch();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = researchList.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-white min-h-screen text-black">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2 uppercase">Research <span className="text-blue-600">Gallery</span></h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Manage research topics and detailed focus areas.</p>
        </div>
        <button
          onClick={() => { setEditingResearch(null); setIsFormOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} /> New Topic
        </button>
      </div>

      <div className="relative mb-6 md:mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search research focus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-5 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm md:text-base"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          {filtered.map((res, index) => (
            <div
              key={res.id}
              className={`group flex items-center gap-4 md:gap-6 px-4 md:px-6 py-4 bg-white hover:bg-slate-50 transition-colors ${
                index !== filtered.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="w-20 h-14 md:w-28 md:h-16 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center text-slate-300">
                {res.titleImage ? (
                  <img src={res.titleImage} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={20} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm md:text-base font-black text-slate-900 truncate uppercase">{res.title}</h3>
                <p className="text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                  {res.category} • {res.year}
                </p>
              </div>

              <div className="hidden md:flex -space-x-2">
                {res.authors?.slice(0, 3).map((a: any, i: number) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    {a.image && <img src={a.image} className="w-full h-full object-cover" />}
                  </div>
                ))}
                {res.authors?.length > 3 && (
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
                    +{res.authors.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditingResearch(res); setIsFormOpen(true); }}
                  className="p-2 text-slate-400 hover:text-blue-600 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ResearchGalleryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchResearch}
        initialData={editingResearch}
      />
    </div>
  );
}
