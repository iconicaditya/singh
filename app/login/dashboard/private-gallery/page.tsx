"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Lock } from "lucide-react";

const privateGallery = [
  { id: 1, title: "Internal Meeting", category: "Meeting", date: "2024-01-08" },
  { id: 2, title: "Confidential Results", category: "Research", date: "2023-12-15" },
];

export default function PrivateGalleryPage() {
  const columns = [
    { header: "Asset Title", accessor: "title" },
    { 
      header: "Category", 
      accessor: "category",
      render: (val: string) => (
        <span className="px-3 py-1 rounded-lg bg-rose-50 text-[10px] font-black text-rose-600 tracking-widest uppercase">
          {val}
        </span>
      )
    },
    { header: "Date", accessor: "date" },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Private Gallery"
        description="Secure storage for internal laboratory visual assets"
        icon={Lock}
        data={privateGallery}
        columns={columns}
        categories={["Meeting", "Research", "Confidential"]}
        onAdd={() => console.log("Add private asset")}
      />
    </AdminLayout>
  );
}