"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2, Edit2, ExternalLink, FileText, Loader2, Search } from "lucide-react";
import PublicationForm from "@/components/publications/PublicationForm";
import DashboardTable from "@/components/admin/DashboardTable";

export default function AdminPublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/publications?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPublications();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = Array.from(new Set(publications.map(item => item.category)));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Publications <span className="text-blue-600">Management</span></h1>
          <p className="mt-2 text-slate-500 font-medium text-sm md:text-base">Manage scholarly works and research papers.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Synchronizing Database...</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <div className="min-w-[600px] md:min-w-full">
            <DashboardTable
              title="Scholarly Works"
              description="Manage academic contributions."
              icon={BookOpen}
              data={publications}
              categories={categories}
              onAdd={() => { setEditingItem(null); setIsFormOpen(true); }}
              onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
              onDelete={(item) => handleDelete(item.id)}
              columns={[
                { 
                  header: "Title", 
                  accessor: "title",
                  render: (value, item) => (
                    <div className="min-w-[200px] md:max-w-md">
                      <div className="font-bold text-slate-900 line-clamp-2 md:line-clamp-1 text-sm md:text-base">{value}</div>
                      <div className="text-[10px] md:text-xs text-slate-400 font-medium line-clamp-1">{item.authors}</div>
                    </div>
                  )
                },
                {
                  header: "Category",
                  accessor: "category",
                  render: (value) => (
                    <span className="px-2 md:px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                      {value}
                    </span>
                  )
                },
                {
                  header: "Resources",
                  accessor: "pdfUrl",
                  render: (value) => (
                    <a 
                      href={value ? value.replace("/upload/", "/upload/fl_attachment/") : "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 font-bold hover:underline text-[10px] md:text-xs whitespace-nowrap"
                    >
                      <FileText size={14} /> PDF Link
                    </a>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}

      <PublicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchPublications}
        initialData={editingItem}
      />
    </div>
  );
}