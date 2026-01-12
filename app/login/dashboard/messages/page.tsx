"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardTable from "@/components/admin/DashboardTable";
import { Mail } from "lucide-react";

const messages = [
  { id: 1, sender: "John Doe", subject: "Collaboration Inquiry", date: "2024-01-12", status: "New" },
  { id: 2, sender: "Sarah Smith", subject: "Lab Visit Request", date: "2024-01-11", status: "Replied" },
];

export default function MessagesPage() {
  const columns = [
    { header: "Sender", accessor: "sender" },
    { header: "Subject", accessor: "subject" },
    { header: "Received Date", accessor: "date" },
    { 
      header: "Status", 
      accessor: "status",
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${
          val === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <AdminLayout>
      <DashboardTable
        title="Messages"
        description="Review and manage inquiries from the contact center"
        icon={Mail}
        data={messages}
        columns={columns}
        onDelete={(item) => console.log("Delete msg", item)}
      />
    </AdminLayout>
  );
}