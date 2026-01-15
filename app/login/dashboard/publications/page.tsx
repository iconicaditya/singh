"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import PublicationForm from "@/components/publications/PublicationForm";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchPublications = async () => {
    try {
      const res = await fetch("/api/publications");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPublications(data);
      } else {
        setPublications([]);
        console.error("Publications data is not an array:", data);
      }
    } catch (err) {
      console.error(err);
      setPublications([]);
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
      await fetch(`/api/publications?id=${item.id}`, { method: "DELETE" });
      fetchPublications();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Journal/Publisher", accessor: "journal" },
    { 
      header: "Type", 
      accessor: "type",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-[10px] font-black text-indigo-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { header: "Year", accessor: "year" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Publications"
        description="Manage research papers and academic contributions"
        icon={BookOpen}
        data={publications}
        columns={columns}
        categories={["Journal", "Conference", "Book Chapter"]}
        onAdd={() => {
          setEditingItem(null);
          setIsFormOpen(true);
        }}
        onEdit={(item) => {
          setEditingItem(item);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      <PublicationForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchPublications}
        initialData={editingItem}
      />
    </AdminLayout>
  );
}