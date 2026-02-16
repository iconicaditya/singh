"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import HeroForm from "@/components/admin/HeroForm";
import DashboardTable from "@/components/admin/DashboardTable";

export default function AdminHeroPage() {
  const [heroList, setHeroList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchHero = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hero", { cache: 'no-store' });
      const data = await res.json();
      setHeroList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;
    try {
      const res = await fetch(`/api/hero?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchHero();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Hero <span className="text-blue-600">Management</span></h1>
          <p className="mt-2 text-slate-500 font-medium text-sm md:text-base">Manage hero carousel slides and content.</p>
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
              title="Hero Slides"
              description="Manage hero carousel content and images."
              icon={ImageIcon}
              data={heroList}
              onAdd={() => { setEditingItem(null); setIsFormOpen(true); }}
              onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
              onDelete={(item) => handleDelete(item.id)}
              columns={[
                { 
                  header: "Main Heading", 
                  accessor: "mainHeading",
                  render: (value, item) => (
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        {item.backgroundImage ? (
                          <img src={item.backgroundImage} alt={value} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                      <div className="max-w-[150px] md:max-w-md">
                        <div className="font-bold text-slate-900 line-clamp-1 text-sm md:text-base">{value}</div>
                        <div className="text-[10px] md:text-xs text-slate-400 font-medium line-clamp-1">{item.subheading}</div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Subheading",
                  accessor: "subheading",
                  render: (value) => (
                    <span className="text-[11px] md:text-sm font-medium text-slate-600 line-clamp-2 max-w-xs">
                      {value}
                    </span>
                  )
                },
                {
                  header: "Created At",
                  accessor: "createdAt",
                  render: (value) => (
                    <span className="text-[11px] md:text-sm font-medium text-slate-400 whitespace-nowrap">
                      {new Date(value).toLocaleDateString()}
                    </span>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}

      <HeroForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchHero}
        initialData={editingItem}
      />
    </div>
  );
}
