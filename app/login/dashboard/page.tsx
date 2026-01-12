"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Users, Mail, BookOpen } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/login");
    }
  }, [router]);

  const stats = [
    { label: "Total Users", value: "12", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Messages", value: "48", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Publications", value: "24", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <AdminLayout>
      <section className="space-y-10">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">Platform Analytics</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View Detailed Reports</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   {stat.label === "Total Users" && <Users size={24} className={stat.color} />}
                   {stat.label === "Messages" && <Mail size={24} className={stat.color} />}
                   {stat.label === "Publications" && <BookOpen size={24} className={stat.color} />}
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-4xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
