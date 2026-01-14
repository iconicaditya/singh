"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import FormModal from "@/components/admin/FormModal";
import ResearchForm from "@/components/admin/ResearchForm";
import { Beaker } from "lucide-react";
import { useState, useEffect } from "react";

export default function ResearchDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [researchData, setResearchData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResearch = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/research');
      if (response.ok) {
        const data = await response.json();
        setResearchData(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const columns = [
    { 
      header: "Publication Title", 
      accessor: "title",
      render: (val: string) => <p className="text-sm font-bold text-slate-800">{val}</p>
    },
    { 
      header: "Category", 
      accessor: "category",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-[10px] font-black text-indigo-600 tracking-widest uppercase">{val}</span>
      )
    },
    { 
      header: "Authors", 
      accessor: "authors",
      render: (authors: string[]) => (
        <span className="text-sm font-semibold text-slate-700">
          {Array.isArray(authors) ? authors.join(", ") : authors}
        </span>
      )
    },
    { 
      header: "Year", 
      accessor: "year",
      render: (val: string) => <span className="text-sm font-semibold text-slate-700">{val}</span>
    },
  ];

  const handleDelete = async (item: any) => {
    if (!confirm("Are you sure you want to delete this research?")) return;
    try {
      const response = await fetch(`/api/research?id=${item.id}`, { method: 'DELETE' });
      if (response.ok) fetchResearch();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <AdminLayout>
      <DashboardTable
        title="Research & Publications"
        description="Manage scientific papers and documented findings"
        icon={Beaker}
        data={researchData}
        columns={columns}
        categories={["RESEARCH", "PUBLICATION", "CASE STUDY", "WASTE MANAGEMENT", "CLIMATE CHANGE"]}
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
        onDelete={handleDelete}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Research" : "Add New Research"}
        hideTitle={true}
      >
        <ResearchForm 
          onClose={() => {
            setIsModalOpen(false);
            fetchResearch();
          }} 
          initialData={editingItem}
        />
      </FormModal>
    </AdminLayout>
  );
}