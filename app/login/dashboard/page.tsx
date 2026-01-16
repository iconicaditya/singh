"use client";

import { motion } from "framer-motion";
import { 
  FlaskConical, 
  BookOpen, 
  Users, 
  Activity,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { name: "Total Research", value: "12", icon: FlaskConical, color: "bg-blue-500", path: "/login/dashboard/research" },
    { name: "Publications", value: "24", icon: BookOpen, color: "bg-purple-500", path: "/login/dashboard/publications" },
    { name: "Team Members", value: "8", icon: Users, color: "bg-emerald-500", path: "/login/dashboard/team" },
    { name: "Recent Activity", value: "45", icon: Activity, color: "bg-amber-500", path: "#" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <Link href={stat.path} className="text-slate-400 hover:text-blue-600 transition-colors">
                <ArrowUpRight size={20} />
              </Link>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/login/dashboard/research" className="p-6 bg-slate-50 rounded-3xl hover:bg-blue-50 transition-colors group">
              <FlaskConical className="text-slate-400 group-hover:text-blue-600 mb-3" size={24} />
              <p className="font-bold text-slate-900">Add Research</p>
            </Link>
            <Link href="/login/dashboard/publications" className="p-6 bg-slate-50 rounded-3xl hover:bg-purple-50 transition-colors group">
              <BookOpen className="text-slate-400 group-hover:text-purple-600 mb-3" size={24} />
              <p className="font-bold text-slate-900">Post Publication</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
