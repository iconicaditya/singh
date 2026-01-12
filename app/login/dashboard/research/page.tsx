"use client";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ResearchDashboard() {
  return (
    <AdminLayout>
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Research Management</h2>
        <p className="text-slate-400">Manage research publications and findings.</p>
        <div className="mt-8 p-6 bg-emerald-50 rounded-2xl text-emerald-600 font-medium">
          Frontend dashboard active. Static data display only.
        </div>
      </div>
    </AdminLayout>
  );
}