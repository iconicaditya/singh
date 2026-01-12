"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Users } from "lucide-react";

const users = [
  { id: 1, name: "Admin User", email: "admin@singhlab.com", role: "Super Admin", status: "Active" },
  { id: 2, name: "Researcher One", email: "researcher1@singhlab.com", role: "Editor", status: "Active" },
];

export default function UsersPage() {
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
        <span className="px-3 py-1 rounded-lg bg-blue-50 text-[10px] font-black text-blue-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-[10px] font-black text-emerald-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="User Management"
        description="Manage administrative access and user permissions"
        icon={Users}
        data={users}
        columns={columns}
        categories={["Super Admin", "Editor", "Viewer"]}
        onAdd={() => console.log("Add user")}
      />
    </AdminLayout>
  );
}