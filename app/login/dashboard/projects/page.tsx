"use client";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ProjectsPage() {
  return (
    <AdminLayout>
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Projects Management</h2>
        <p className="text-slate-400">Oversee ongoing and completed research projects.</p>
      </div>
    </AdminLayout>
  );
}
