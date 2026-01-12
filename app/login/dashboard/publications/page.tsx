"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { BookOpen } from "lucide-react";

const publications = [
  { id: 1, title: "Plastic impacts in 2024", journal: "Nature Environ", type: "Journal", year: "2024" },
  { id: 2, title: "Urban Waste Study", journal: "Science Direct", type: "Conference", year: "2023" },
];

export default function PublicationsPage() {
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Journal/Publisher", accessor: "journal" },
    { 
      header: "Type", 
      accessor: "type",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-[10px] font-black text-indigo-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { header: "Year", accessor: "year" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Publications"
        description="Manage research papers and academic contributions"
        icon={BookOpen}
        data={publications}
        columns={columns}
        categories={["Journal", "Conference", "Book Chapter"]}
        onAdd={() => console.log("Add pub")}
      />
    </AdminLayout>
  );
}