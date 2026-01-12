"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { UserPlus } from "lucide-react";

const collaborators = [
  { id: 1, name: "Global Environ Research", type: "Institutional", location: "UK", status: "Active" },
  { id: 2, name: "EcoTech Solutions", type: "Corporate", location: "USA", status: "Active" },
];

export default function CollaboratorsPage() {
  const columns = [
    { header: "Partner Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Location", accessor: "location" },
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
        title="Research Partners"
        description="Manage institutional and individual collaborators"
        icon={UserPlus}
        data={collaborators}
        columns={columns}
        categories={["Institutional", "Corporate", "Individual"]}
        onAdd={() => console.log("Add partner")}
      />
    </AdminLayout>
  );
}