"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Mail, 
  UserPlus, 
  FlaskConical, 
  BookOpen, 
  Layers, 
  Image as ImageIcon, 
  Lock, 
  Users2, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  MoreHorizontal 
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");

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

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Projects", icon: Briefcase },
    { name: "Messages", icon: Mail },
    { name: "Collaborators", icon: UserPlus },
    { name: "Research", icon: FlaskConical },
    { name: "Publications", icon: BookOpen },
    { name: "Resources", icon: Layers },
    { name: "Gallery", icon: ImageIcon },
    { name: "Private Gallery", icon: Lock },
    { name: "Team Members", icon: Users2 },
    { name: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Total Users", value: "12", color: "text-blue-600" },
    { label: "Messages", value: "48", color: "text-green-600" },
    { label: "Publications", value: "24", color: "text-orange-600" },
  ];

  const messages = [
    { sender: "Alice Smith", email: "alice@example.com", subject: "Collaboration Inquiry", date: "2024-03-20" },
    { sender: "Bob Jones", email: "bob@university.edu", subject: "Research Question", date: "2024-03-18" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e2235] text-white flex flex-col fixed inset-y-0 shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">Singh Lab Admin</h2>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.name 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white h-20 flex items-center justify-between px-10 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Admin User</p>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
          </div>
        </header>

        <div className="p-10 flex-1">
          {/* Dashboard Overview Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm font-semibold text-gray-500 mb-2">{stat.label}</p>
                  <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Table Section */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Messages</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                  <Plus size={16} /> Add New
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-y border-gray-100 bg-gray-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sender</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {messages.map((msg, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-5 text-sm font-medium text-gray-700">{msg.sender}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">{msg.email}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">{msg.subject}</td>
                      <td className="px-8 py-5 text-sm text-gray-500">{msg.date}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
