"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import FormModal from "@/components/admin/FormModal";
import ProjectForm from "@/components/admin/ProjectForm";
import { Briefcase, Trash2, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjectsList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { 
      header: "Project Title", 
      accessor: "title",
      render: (val: string) => <p className="text-sm font-bold text-slate-800">{val}</p>
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
          val === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
        }`}>{val}</span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      render: (val: any, row: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditingItem(row); setIsModalOpen(true); }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Project Management"
        description="Oversee ongoing and completed research initiatives"
        icon={Briefcase}
        data={projectsList}
        columns={columns}
        categories={["RESEARCH", "COMMUNITY", "TECHNOLOGY"]}
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); fetchProjects(); }} 
        title={editingItem ? "Edit Project" : "Add New Project"}
      >
        <ProjectForm 
          onClose={() => { setIsModalOpen(false); fetchProjects(); }} 
          initialData={editingItem}
        />
      </FormModal>
    </AdminLayout>
  );
}
