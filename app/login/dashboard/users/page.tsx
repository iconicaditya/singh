"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import FormModal from "@/components/admin/FormModal";
import { Users } from "lucide-react";
import { useState } from "react";

const initialUsers = [
  { id: 1, name: "Admin User", email: "admin@singhlab.com", role: "Super Admin", status: "Active" },
];

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const columns = [
    { 
      header: "User Details", 
      accessor: "name",
      render: (val: string, item: any) => (
        <div>
          <p className="text-sm font-bold text-slate-800">{val}</p>
          <p className="text-xs text-slate-400 font-medium">{item.email}</p>
        </div>
      )
    },
    { 
      header: "Role", 
      accessor: "role",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-blue-50 text-[10px] font-black text-blue-600 tracking-widest uppercase">{val}</span>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600 tracking-widest uppercase">{val}</span>
      )
    },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="User Management"
        description="Manage administrative access and user permissions"
        icon={Users}
        data={initialUsers}
        columns={columns}
        categories={["Super Admin", "Editor", "Viewer"]}
        onAdd={() => { setEditingItem(null); setIsModalOpen(true); }}
        onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
      />

      <FormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit User" : "Create New User"}
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold text-black" placeholder="e.g. John Doe" defaultValue={editingItem?.name} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
              <input type="email" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold text-black" placeholder="john@singhlab.org" defaultValue={editingItem?.email} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</label>
              <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-black" defaultValue={editingItem?.role}>
                <option value="Super Admin">Super Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
              <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-black" defaultValue={editingItem?.status}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {!editingItem && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold text-black" />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" className="px-10 py-3 rounded-xl text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">{editingItem ? "Update Permissions" : "Create Account"}</button>
          </div>
        </form>
      </FormModal>
    </AdminLayout>
  );
}