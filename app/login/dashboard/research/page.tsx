"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Beaker, Search, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminResearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const res = await fetch("/api/research");
      if (res.ok) {
        const data = await res.json();
        setResearchData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResearch = researchData.filter((item: any) => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl md:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="mt-1 text-blue-600 bg-blue-50 p-2 md:p-3 rounded-lg md:rounded-xl">
              <Beaker size={24} className="md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800">Research Topics</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-1">Manage research papers and projects</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-1 lg:justify-end items-stretch sm:items-center gap-3 md:gap-4">
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search research..."
                className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => router.push('/login/dashboard/research/add')}
              className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} />
              Add Research
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="font-medium">Loading research data...</p>
            </div>
          ) : (
            <table className="w-full border-collapse min-w-[800px] lg:min-w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                  <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Title</th>
                  <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-4 md:px-8 py-4 md:py-5 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredResearch.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <div className="max-w-xs md:max-w-md">
                        <p className="text-sm md:text-[15px] font-bold text-slate-800 leading-snug mb-1 md:mb-1.5 line-clamp-2">{item.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{item.summary || item.abstract}</p>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6">
                      <span className="inline-flex px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg bg-blue-50 text-[9px] md:text-[11px] font-extrabold text-[#2563eb] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                      <div className="flex items-center justify-end gap-1 md:gap-2">
                        <button className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-md md:rounded-lg transition-all">
                          <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                        <button className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-md md:rounded-lg transition-all">
                          <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredResearch.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-20 text-center text-slate-400 font-medium">
                      No research entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
