"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import GalleryForm from "@/components/gallery/GalleryForm";
import DashboardTable from "@/components/admin/DashboardTable";

export default function AdminGalleryPage() {
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery", { cache: 'no-store' });
      const data = await res.json();
      setGalleryList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = Array.from(new Set(galleryList.map(item => item.category)));

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Gallery <span className="text-blue-600">Management</span></h1>
          <p className="mt-2 text-slate-500 font-medium">Manage research gallery images and documentation.</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl active:scale-95"
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Synchronizing Database...</p>
        </div>
      ) : (
        <DashboardTable
          title="Gallery Items"
          description="Manage visual research documentation."
          icon={ImageIcon}
          data={galleryList}
          categories={categories}
          onAdd={() => { setEditingItem(null); setIsFormOpen(true); }}
          onEdit={(item) => { setEditingItem(item); setIsFormOpen(true); }}
          onDelete={(item) => handleDelete(item.id)}
          columns={[
            { 
              header: "Title", 
              accessor: "title",
              render: (value, item) => (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={value} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div className="max-w-md">
                    <div className="font-bold text-slate-900 line-clamp-1">{value}</div>
                    <div className="text-xs text-slate-400 font-medium line-clamp-1">{item.description}</div>
                  </div>
                </div>
              )
            },
            {
              header: "Category",
              accessor: "category",
              render: (value) => (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {value}
                </span>
              )
            },
            {
              header: "Created At",
              accessor: "createdAt",
              render: (value) => (
                <span className="text-sm font-medium text-slate-400">
                  {new Date(value).toLocaleDateString()}
                </span>
              )
            }
          ]}
        />
      )}

      <GalleryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchGallery}
        initialData={editingItem}
      />
    </div>
  );
}
