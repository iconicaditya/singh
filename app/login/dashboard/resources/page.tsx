"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Layers } from "lucide-react";

const resources = [
  { id: 1, name: "Lab Safety Guide", type: "PDF", size: "2.4 MB", date: "2024-01-10" },
  { id: 2, name: "Waste Mgmt Dataset", type: "CSV", size: "15.8 MB", date: "2023-12-05" },
];

export default function ResourcesPage() {
  const columns = [
    { header: "Resource Name", accessor: "name" },
    { 
      header: "Format", 
      accessor: "type",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-orange-50 text-[10px] font-black text-orange-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { header: "File Size", accessor: "size" },
    { header: "Uploaded", accessor: "date" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Lab Resources"
        description="Manage shared documents and datasets"
        icon={Layers}
        data={resources}
        columns={columns}
        categories={["PDF", "CSV", "Excel", "Other"]}
        onAdd={() => console.log("Add resource")}
      />
    </AdminLayout>
  );
}