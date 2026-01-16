"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  BookOpen,
  Users
} from "lucide-react";
import ResearchGalleryForm from "@/components/research/ResearchGalleryForm";
import DashboardTable from "@/components/admin/DashboardTable";

export default function AdminResearchPage() {
  const [researchList, setResearchList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const categories = Array.from(new Set(researchList.map(r => r.category)));

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Synchronizing Database...</p>
        </div>
      ) : (
        <DashboardTable
          title="Research Portfolio"
          description="Manage and showcase your laboratory's research initiatives."
          icon={BookOpen}
          data={researchList}
          categories={categories}
          onAdd={() => { setEditingResearch(null); setIsFormOpen(true); }}
          onEdit={(item) => { setEditingResearch(item); setIsFormOpen(true); }}
          onDelete={(item) => handleDelete(item.id)}
          columns={[
            { 
              header: "Research Topic", 
              accessor: "title",
              render: (value, item) => (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    {item.titleImage ? (
                      <img src={item.titleImage} alt={value} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 line-clamp-1">{value}</div>
                    <div className="text-xs text-slate-400 font-medium">{item.category}</div>
                  </div>
                </div>
              )
            },
            { 
              header: "Year", 
              accessor: "year",
              render: (value) => (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {value}
                </span>
              )
            },
            {
              header: "Authors",
              accessor: "authors",
              render: (value) => (
                <div className="flex -space-x-2">
                  {value?.slice(0, 3).map((a: any, i: number) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden" title={a.name}>
                      {a.image ? <img src={a.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-slate-400"><Users size={10} /></div>}
                    </div>
                  ))}
                  {value?.length > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] text-white font-bold">
                      +{value.length - 3}
                    </div>
                  )}
                </div>
              )
            },
            {
              header: "Keywords",
              accessor: "tags",
              render: (value) => (
                <div className="flex flex-wrap gap-1">
                  {value?.split(',').slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )
            }
          ]}
        />
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
