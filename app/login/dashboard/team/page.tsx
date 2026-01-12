"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Users2 } from "lucide-react";

const team = [
  { id: 1, name: "Dr. Aaditya Chaudhary", role: "Director", category: "Faculty" },
  { id: 2, name: "Mr. Bibas Ghatani", role: "Researcher", category: "Research" },
];

export default function TeamPage() {
  const columns = [
    { 
      header: "Member Name", 
      accessor: "name",
      render: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
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
        <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Team Directory"
        description="Maintain laboratory staff and member profiles"
        icon={Users2}
        data={team}
        columns={columns}
        categories={["Faculty", "Research", "Student"]}
        onAdd={() => console.log("Add clicked")}
      />
    </AdminLayout>
  );
}