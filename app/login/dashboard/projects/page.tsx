"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import FormModal from "@/components/admin/FormModal";
import { Briefcase } from "lucide-react";
import { useState } from "react";

const initialProjects = [
  { id: 1, title: "Marine Plastic Analysis", category: "RESEARCH", status: "Ongoing", year: "2024", location: "Pacific Coastal Region", teamSize: "12 Scientists", impact: "Mapped 500+ zones", description: "Short summary", fullDescription: "Detailed content" },
];

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const columns = [
    { 
      header: "Project Title", 
      accessor: "title",
      render: (val: string) => <p className="text-sm font-bold text-slate-800">{val}</p>
    },
    { 
      header: "Category", 
      accessor: "category",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-full bg-blue-50 text-[10px] font-black text-blue-600 tracking-widest uppercase">{val}</span>
      )
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
    { header: "Year", accessor: "year" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Project Management"
        description="Oversee ongoing and completed research initiatives"
        icon={Briefcase}
        data={initialProjects}
        columns={columns}
        categories={["RESEARCH", "COMMUNITY", "TECHNOLOGY"]}
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Project" : "Add New Project"}
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Title</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="Enter title" defaultValue={editingItem?.title} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" defaultValue={editingItem?.category}>
                <option value="RESEARCH">RESEARCH</option>
                <option value="COMMUNITY">COMMUNITY</option>
                <option value="TECHNOLOGY">TECHNOLOGY</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
              <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" defaultValue={editingItem?.status}>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Year</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="e.g. 2024" defaultValue={editingItem?.year} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="e.g. Pacific Coast" defaultValue={editingItem?.location} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team Size/Description</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="e.g. 12 Scientists" defaultValue={editingItem?.teamSize} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Impact Statement</label>
            <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="Enter impact summary" defaultValue={editingItem?.impact} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Short Description</label>
            <textarea rows={3} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold resize-none" placeholder="Brief overview" defaultValue={editingItem?.description}></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Project Content</label>
            <textarea rows={6} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold resize-none" placeholder="Detailed project information" defaultValue={editingItem?.fullDescription}></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" className="px-10 py-3 rounded-xl text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Save Project</button>
          </div>
        </form>
      </FormModal>
    </AdminLayout>
  );
}