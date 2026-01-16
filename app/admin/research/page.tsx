"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layout,
  Loader2,
  BookOpen,
  Filter,
  MoreVertical,
  Calendar,
  Tag,
  Users,
  ChevronRight,
  List,
  Grid
} from "lucide-react";
import ResearchGalleryForm from "@/components/research/ResearchGalleryForm";

export default function AdminResearchPage() {
  const [researchList, setResearchList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
    <div className="p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-slate-900">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-8 bg-blue-600 rounded-full"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Administration</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Research <span className="text-blue-600">Portfolio</span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium max-w-2xl">
            Manage and showcase your laboratory's research initiatives, focus areas, and ongoing academic contributions.
          </p>
        </div>
        <button
          onClick={() => { setEditingResearch(null); setIsFormOpen(true); }}
          className="group relative flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide transition-all hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Add Research Topic
        </button>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by title, category or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-medium placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List size={18} />
            <span className="text-sm">List</span>
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid size={18} />
            <span className="text-sm">Grid</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Synchronizing Database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Search className="text-slate-300" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No matching research found</h3>
          <p className="text-slate-500 font-medium">Try adjusting your search terms or add a new research topic.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
          {filtered.map((res) => (
            viewMode === 'grid' ? (
              <div 
                key={res.id}
                className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] bg-slate-50 rounded-[2rem] mb-6 overflow-hidden border border-slate-100 relative group-hover:shadow-inner">
                  {res.titleImage ? (
                    <img src={res.titleImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={res.title} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200">
                      <BookOpen size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 border border-white/50 shadow-sm">
                      {res.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{res.title}</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-xs font-bold uppercase tracking-tighter">{res.year}</span>
                  </div>
                  {res.tags && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Tag size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter truncate max-w-[100px]">{res.tags.split(',')[0]}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex -space-x-3">
                     {res.authors?.slice(0, 3).map((a: any, i: number) => (
                       <div key={i} className="w-9 h-9 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm hover:scale-110 transition-transform cursor-pointer relative z-10" title={a.name}>
                         {a.image ? <img src={a.image} className="w-full h-full object-cover" alt={a.name} /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400"><Users size={12} /></div>}
                       </div>
                     ))}
                     {res.authors?.length > 3 && (
                       <div className="w-9 h-9 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold relative z-0">
                         +{res.authors.length - 3}
                       </div>
                     )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingResearch(res); setIsFormOpen(true); }}
                      className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit Research"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Research"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                key={res.id}
                className="group bg-white p-4 pr-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-6"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                  {res.titleImage ? (
                    <img src={res.titleImage} className="w-full h-full object-cover" alt={res.title} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200">
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 px-2.5 py-0.5 bg-blue-50 rounded-lg">{res.category}</span>
                    <span className="text-xs font-medium text-slate-400">• {res.year}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{res.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Users size={12} className="text-slate-400" />
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {res.authors?.map((a: any) => a.name).join(", ") || "No authors specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                  <button
                    onClick={() => { setEditingResearch(res); setIsFormOpen(true); }}
                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="p-3 text-slate-400 hover:text-slate-900 rounded-xl transition-all ml-2">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )
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
