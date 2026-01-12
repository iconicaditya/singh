"use client";
import AdminLayout from "@/components/admin/AdminLayout";

export default function MessagesPage() {
  return (
    <AdminLayout>
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Communications Center</h2>
        <p className="text-slate-400">Review and respond to messages from the contact form.</p>
      </div>
    </AdminLayout>
  );
}
