"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Image as ImageIcon, Calendar } from "lucide-react";
import DashboardTable from "@/components/admin/DashboardTable";
import ResearchGalleryForm from "@/components/research/ResearchGalleryForm";

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

  const handleDelete = async (item: any) => {
    if (!confirm("Are you sure you want to delete this research focus?")) return;
    try {
      const res = await fetch(`/api/research?id=${item.id}`, { method: "DELETE" });
      if (res.ok) fetchResearch();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
            {item.titleImage ? (
              <img src={item.titleImage} alt={value} className="w-full h-full object-cover" />
            ) : (
              <FlaskConical size={20} className="text-slate-300" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate uppercase italic">{value}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{item.category}</p>
          </div>
        </div>
      )
    },
    {
      header: "Year",
      accessor: "year",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-500 font-bold">
          <Calendar size={14} />
          <span>{value}</span>
        </div>
      )
    },
    {
      header: "Authors",
      accessor: "authors",
      render: (authors: any[]) => (
        <div className="flex -space-x-2">
          {authors?.slice(0, 3).map((a: any, i: number) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden" title={a.name}>
              {a.image && <img src={a.image} className="w-full h-full object-cover" />}
            </div>
          ))}
          {authors?.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">
              +{authors.length - 3}
            </div>
          )}
        </div>
      )
    }
  ];

  const categories = Array.from(new Set(researchList.map(r => r.category))).filter(Boolean);

  return (
    <div className="space-y-8">
      <DashboardTable
        title="Research Gallery"
        description="Manage research topics and detailed focus areas for the laboratory."
        icon={FlaskConical}
        data={researchList}
        columns={columns}
        categories={categories}
        onAdd={() => { setEditingResearch(null); setIsFormOpen(true); }}
        onEdit={(item) => { setEditingResearch(item); setIsFormOpen(true); }}
        onDelete={handleDelete}
      />

      <ResearchGalleryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchResearch}
        initialData={editingResearch}
      />
    </div>
  );
}
