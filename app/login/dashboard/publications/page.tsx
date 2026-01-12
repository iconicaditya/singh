"use client";
import AdminLayout from "@/components/admin/AdminLayout";

export default function PublicationsPage() {
  return (
    <AdminLayout>
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Publications</h2>
        <p className="text-slate-400">Add and edit journal articles, conference papers, and books.</p>
      </div>
    </AdminLayout>
  );
}
