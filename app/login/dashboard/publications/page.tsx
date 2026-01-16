"use client";

import { useState, useEffect } from "react";
import { BookOpen, Calendar, FileText, User } from "lucide-react";
import DashboardTable from "@/components/admin/DashboardTable";
import PublicationForm from "@/components/publications/PublicationForm";

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (item: any) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    try {
      const res = await fetch(`/api/publications?id=${item.id}`, { method: "DELETE" });
      if (res.ok) fetchPublications();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      header: "Publication Details",
      accessor: "title",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <BookOpen className="text-slate-300" size={24} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate max-w-md">{value}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest">
                {item.type}
              </span>
              <span className="text-[11px] text-slate-400 font-bold italic">{item.journal}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Authors",
      accessor: "authors",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-slate-500">
          <User size={14} className="shrink-0" />
          <span className="text-sm font-semibold truncate max-w-[200px]">{value}</span>
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
      header: "Link",
      accessor: "pdfUrl",
      render: (value: string) => value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-xs"
        >
          <FileText size={14} />
          PDF
        </a>
      ) : <span className="text-slate-300">-</span>
    }
  ];

  const categories = Array.from(new Set(publications.map(p => p.type))).filter(Boolean);

  return (
    <div className="space-y-8">
      <DashboardTable
        title="Publications Management"
        description="Add, edit, or remove research papers from the lab database."
        icon={BookOpen}
        data={publications}
        columns={columns}
        categories={categories}
        onAdd={() => { setEditingPub(null); setIsFormOpen(true); }}
        onEdit={(item) => { setEditingPub(item); setIsFormOpen(true); }}
        onDelete={handleDelete}
      />

      <PublicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchPublications}
        initialData={editingPub}
      />
    </div>
  );
}
