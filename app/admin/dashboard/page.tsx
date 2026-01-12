"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, Briefcase, LogOut, Plus, Edit, Trash2 } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("research");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-8 flex flex-col">
        <h2 className="text-2xl font-black mb-12 uppercase tracking-tighter">
          Singh <span className="text-blue-500">Lab</span>
        </h2>

        <nav className="space-y-4 flex-grow">
          <button
            onClick={() => setActiveTab("research")}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === "research" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <FileText size={20} /> Research
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === "projects" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <Briefcase size={20} /> Projects
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tight">
            Manage <span className="text-blue-500">{activeTab}</span>
          </h1>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Mock Table for demonstration */}
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-500">Title</th>
                  <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-500">Category</th>
                  <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th className="p-8 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-8 font-bold">Example {activeTab === "research" ? "Research Paper" : "Lab Project"} {i}</td>
                    <td className="p-8"><span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold">ENVIRONMENT</span></td>
                    <td className="p-8"><span className="text-xs font-bold text-green-500 uppercase tracking-widest">Active</span></td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-3 bg-white/5 hover:bg-blue-500/20 rounded-xl transition-all">
                          <Edit size={16} className="text-blue-500" />
                        </button>
                        <button className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl transition-all">
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
