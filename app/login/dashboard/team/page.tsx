"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import FormModal from "@/components/admin/FormModal";
import { Users2 } from "lucide-react";
import { useState } from "react";

const initialTeam = [
  { id: 1, name: "Er. Aaditya Chaudhary", role: "RESEARCH MEMBER", category: "Research", bio: "Short bio" },
];

export default function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const columns = [
    { 
      header: "Member Name", 
      accessor: "name",
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <p className="text-sm font-bold text-slate-800">{val}</p>
        </div>
      )
    },
    { header: "Role", accessor: "role" },
    { 
      header: "Category", 
      accessor: "category",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 tracking-widest uppercase">{val}</span>
      )
    },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Team Directory"
        description="Maintain laboratory staff and member profiles"
        icon={Users2}
        data={initialTeam}
        columns={columns}
        categories={["Faculty", "Research", "Student", "Advisor"]}
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Team Member" : "Add New Member"}
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="e.g. Er. Aaditya Chaudhary" defaultValue={editingItem?.name} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Professional Role</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="e.g. RESEARCH MEMBER" defaultValue={editingItem?.role} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" defaultValue={editingItem?.category}>
                <option value="Faculty">Faculty</option>
                <option value="Research">Research</option>
                <option value="Student">Student</option>
                <option value="Advisor">Advisor</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">LinkedIn URL</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="https://linkedin.com/in/..." defaultValue={editingItem?.social?.linkedin} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Facebook URL</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="https://facebook.com/..." defaultValue={editingItem?.social?.facebook} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Twitter/X URL</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold" placeholder="https://x.com/..." defaultValue={editingItem?.social?.twitter} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Professional Bio</label>
            <textarea rows={4} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold resize-none" placeholder="Summary of member's background and research focus" defaultValue={editingItem?.bio}></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" className="px-10 py-3 rounded-xl text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Save Member</button>
          </div>
        </form>
      </FormModal>
    </AdminLayout>
  );
}