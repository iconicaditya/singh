"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  Bell,
  ChevronDown,
  Menu,
  X as CloseIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/login/dashboard" },
    { name: "Users", icon: Users, path: "/login/dashboard/users" },
    { name: "Projects", icon: Briefcase, path: "/login/dashboard/projects" },
    { name: "Messages", icon: Mail, path: "/login/dashboard/messages" },
    { name: "Collaborators", icon: UserPlus, path: "/login/dashboard/collaborators" },
    { name: "Research", icon: FlaskConical, path: "/login/dashboard/research" },
    { name: "Publications", icon: BookOpen, path: "/login/dashboard/publications" },
    { name: "Resources", icon: Layers, path: "/login/dashboard/resources" },
    { name: "Gallery", icon: ImageIcon, path: "/login/dashboard/gallery" },
    { name: "Team Members", icon: Users2, path: "/login/dashboard/team" },
    { name: "Settings", icon: Settings, path: "/login/dashboard/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  const activeItem = navItems.find(item => item.path === pathname) || navItems[0];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans relative">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1e293b] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <FlaskConical className="text-white" size={18} />
          </div>
          <h2 className="text-lg font-bold">Singh Lab</h2>
        </div>
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isSidebarOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-[#1e293b] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-20 overflow-hidden transition-all duration-300
        fixed md:sticky md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 mb-4 hidden md:block">
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
              onClick={() => {
                router.push(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                pathname === item.path 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} className={pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-slate-300"} />
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
      <main className="flex-1 min-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md h-20 md:h-24 flex items-center justify-between px-6 md:px-10 border-b border-slate-100 sticky top-0 z-10">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">{activeItem.name}</h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium hidden sm:block">Welcome back, Administrator</p>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 md:p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={20} className="md:w-5.5 md:h-5.5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Admin User</p>
                <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 font-bold text-base md:text-lg shadow-inner">
                  A
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-5 md:h-5 bg-emerald-500 rounded-full border-[3px] md:border-4 border-white"></div>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-all hidden sm:block" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
