"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  MoreHorizontal,
  Bell,
  ChevronDown
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Projects", icon: Briefcase },
    { name: "Messages", icon: Mail },
    { name: "Collaborators", icon: UserPlus },
    { name: "Research", icon: FlaskConical, path: "/login/dashboard/research" },
    { name: "Publications", icon: BookOpen },
    { name: "Resources", icon: Layers },
    { name: "Gallery", icon: ImageIcon },
    { name: "Private Gallery", icon: Lock },
    { name: "Team Members", icon: Users2 },
    { name: "Settings", icon: Settings },
  ];

  const handleNavClick = (item: any) => {
    setActiveTab(item.name);
    if (item.path) {
      router.push(item.path);
    }
  };

  const stats = [
    { label: "Total Users", value: "12", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Messages", value: "48", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Publications", value: "24", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const messages = [
    { sender: "Alice Smith", email: "alice@example.com", subject: "Collaboration Inquiry", date: "2024-03-20" },
    { sender: "Bob Jones", email: "bob@university.edu", subject: "Research Question", date: "2024-03-18" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1e293b] text-white flex flex-col fixed inset-y-0 shadow-2xl z-20">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FlaskConical className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Singh Lab</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                activeTab === item.name 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} className={activeTab === item.name ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-400/10 transition-all active:scale-95"
          >
            <LogOut size={20} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md h-24 flex items-center justify-between px-10 border-b border-slate-100 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{activeTab}</h1>
            <p className="text-sm text-slate-400 font-medium">Welcome back, Administrator</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-10 w-px bg-slate-100"></div>
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Admin User</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                  A
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white"></div>
              </div>
              <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-all" />
            </div>
          </div>
        </header>

        <div className="p-10 flex-1 space-y-10">
          {/* Dashboard Overview Section */}
          <section>
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
          </section>

          {/* Messages Table Section */}
          <section className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-50 overflow-hidden">
            <div className="p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Incoming Communications</h3>
                <p className="text-sm text-slate-400 mt-1">Review and manage recent user inquiries</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Filter communications..."
                    className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500/50 transition-all w-80 placeholder:text-slate-400 placeholder:font-medium"
                  />
                </div>
                <button className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
                  <Plus size={20} /> New Entry
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Inquiry Details</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {messages.map((msg, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {msg.sender.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{msg.sender}</p>
                            <p className="text-xs text-slate-400 font-medium">{msg.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <p className="text-sm font-semibold text-slate-600 truncate max-w-xs">{msg.subject}</p>
                      </td>
                      <td className="px-10 py-7">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider">{msg.date}</span>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-slate-50/50 flex justify-center">
               <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Load More Communications</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
