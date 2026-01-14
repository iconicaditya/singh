"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import FormModal from "@/components/admin/FormModal";
import ResearchForm from "@/components/admin/ResearchForm";
import { Beaker } from "lucide-react";
import { useState } from "react";

const initialResearch = [
  { id: 1, title: "Plastic lifecycle impacts", category: "WASTE MANAGEMENT", date: "2024-03-15", author: "Dr. Sarah Chen", readTime: "12 min read" },
];

export default function ResearchDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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
    { header: "Author", accessor: "author" },
    { header: "Date", accessor: "date" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Research & Publications"
        description="Manage scientific papers and documented findings"
        icon={Beaker}
        data={initialResearch}
        columns={columns}
        categories={["WASTE MANAGEMENT", "CLIMATE CHANGE", "PLASTICS", "URBAN SYSTEMS", "RENEWABLE ENERGY"]}
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Research" : "Add New Research"}
        hideTitle={true}
      >
        <ResearchForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={editingItem}
        />
      </FormModal>
    </AdminLayout>
  );
}