"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Image as ImageIcon } from "lucide-react";

const gallery = [
  { id: 1, title: "Lab Setup 2024", category: "Lab", date: "2024-01-05" },
  { id: 2, title: "Fieldwork Research", category: "Field", date: "2023-11-20" },
];

export default function GalleryPage() {
  const columns = [
    { header: "Image Title", accessor: "title" },
    { 
      header: "Category", 
      accessor: "category",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-blue-50 text-[10px] font-black text-blue-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { header: "Date", accessor: "date" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Public Gallery"
        description="Manage media assets for the public website gallery"
        icon={ImageIcon}
        data={gallery}
        columns={columns}
        categories={["Lab", "Field", "Event"]}
        onAdd={() => console.log("Add image")}
      />
    </AdminLayout>
  );
}