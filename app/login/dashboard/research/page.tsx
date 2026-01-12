"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Beaker, Search, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mockResearch = [
  {
    id: 1,
    title: "Integrating Environmental, Social, and Economic Dimensions for Sustainable...",
    description: "This research investigates integrated urban sustainability...",
    category: "SUSTAINABLE DEVELOPMENT",
    journal: "Sustainable Cities and Society",
    doi: "10.1000/sustainability.2026.006",
    authors: ["Mr. Nabin Rokaya", "Er. Aaditya Cdy"],
    date: "2026"
  }
];

export default function AdminResearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-blue-600 bg-blue-50 p-3 rounded-xl">
              <Beaker size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Research Topics</h2>
              <p className="text-slate-500 mt-1">Manage research papers and projects</p>
            </div>
          </div>
          
          <div className="flex flex-1 lg:justify-end items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search research..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => router.push('/login/dashboard/research/add')}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Plus size={20} />
              Add Research
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Title</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Journal & DOI</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockResearch.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="max-w-md">
                      <p className="text-[15px] font-bold text-slate-800 leading-snug mb-1.5">{item.title}</p>
                      <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex px-3 py-1.5 rounded-lg bg-blue-50 text-[11px] font-extrabold text-[#2563eb] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm">
                      <p className="text-slate-600 font-medium mb-1">{item.journal}</p>
                      <p className="text-xs text-slate-400 font-mono tracking-tight">{item.doi}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
