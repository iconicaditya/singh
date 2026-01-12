"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Beaker } from "lucide-react";

const research = [
  { id: 1, title: "Plastic lifecycle impacts", category: "WASTE MGMT", date: "2024-03-15" },
  { id: 2, title: "Microplastics monitoring", category: "PLASTICS", date: "2023-11-05" },
];

export default function ResearchDashboard() {
  const columns = [
    { 
      header: "Publication Title", 
      accessor: "title",
      render: (val: string) => (
        <p className="text-sm font-bold text-slate-800">{val}</p>
      )
    },
    { 
      header: "Category", 
      accessor: "category",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-[10px] font-black text-indigo-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { header: "Date", accessor: "date" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Research & Publications"
        description="Manage scientific papers and documented findings"
        icon={Beaker}
        data={research}
        columns={columns}
        categories={["WASTE MGMT", "PLASTICS", "CLIMATE CHANGE"]}
        onAdd={() => console.log("Add clicked")}
      />
    </AdminLayout>
  );
}