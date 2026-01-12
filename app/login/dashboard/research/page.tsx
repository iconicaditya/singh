"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import FormModal from "@/components/admin/FormModal";
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
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="Research title" defaultValue={editingItem?.title} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" defaultValue={editingItem?.category}>
                <option value="WASTE MANAGEMENT">WASTE MANAGEMENT</option>
                <option value="CLIMATE CHANGE">CLIMATE CHANGE</option>
                <option value="PLASTICS">PLASTICS</option>
                <option value="URBAN SYSTEMS">URBAN SYSTEMS</option>
                <option value="RENEWABLE ENERGY">RENEWABLE ENERGY</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Author</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="Lead Author" defaultValue={editingItem?.author} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Publication Date</label>
              <input type="date" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" defaultValue={editingItem?.date} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Read Time</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="e.g. 12 min read" defaultValue={editingItem?.readTime} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tags (Comma Separated)</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="e.g. LCA, Sustainability" defaultValue={editingItem?.tags} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Methodology</label>
            <textarea rows={3} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold resize-none" placeholder="Research methods" defaultValue={editingItem?.methodology}></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description/Summary</label>
            <textarea rows={3} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold resize-none" placeholder="Brief summary" defaultValue={editingItem?.description}></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Research Content</label>
            <textarea rows={6} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold resize-none" placeholder="Detailed content" defaultValue={editingItem?.fullContent}></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" className="px-10 py-3 rounded-xl text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Save Research</button>
          </div>
        </form>
      </FormModal>
    </AdminLayout>
  );
}