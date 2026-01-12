"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Briefcase } from "lucide-react";

const projects = [
  { id: 1, title: "Marine Plastic Analysis", category: "RESEARCH", status: "Ongoing", year: "2024" },
  { id: 2, title: "Community Recycling", category: "COMMUNITY", status: "Completed", year: "2023" },
  { id: 3, title: "Climate Data AI", category: "TECHNOLOGY", status: "Ongoing", year: "2024" },
];

export default function ProjectsPage() {
  const columns = [
    { 
      header: "Project Title", 
      accessor: "title",
      render: (val: string) => (
        <div className="max-w-xs">
          <p className="text-sm font-bold text-slate-800 leading-tight">{val}</p>
        </div>
      )
    },
    { 
      header: "Category", 
      accessor: "category",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-full bg-blue-50 text-[10px] font-black text-blue-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
          val === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
        }`}>
          {val}
        </span>
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
        data={projects}
        columns={columns}
        categories={["RESEARCH", "COMMUNITY", "TECHNOLOGY"]}
        onAdd={() => console.log("Add clicked")}
        onEdit={(item) => console.log("Edit", item)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </AdminLayout>
  );
}