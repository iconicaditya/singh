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
  Calendar,
  X as CloseIcon
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/login/dashboard" },
    { name: "Projects", icon: Briefcase, path: "/login/dashboard/projects" },
    { name: "Messages", icon: Mail, path: "/login/dashboard/messages" },
    { name: "Collaborators", icon: UserPlus, path: "/login/dashboard/collaborators" },
    { name: "Activities", icon: Calendar, path: "/login/dashboard/activities" },
    { name: "Research Themes", icon: Layers, path: "/login/dashboard/research-themes" },
    { name: "Research", icon: FlaskConical, path: "/login/dashboard/research" },
    { name: "Publications", icon: BookOpen, path: "/login/dashboard/publications" },
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
      <div className="md:hidden bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white p-4 flex items-center justify-between sticky top-0 z-[10] shadow-xl h-16 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <FlaskConical className="text-white" size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight text-white">Singh Lab</h2>
            <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">Admin</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="p-2.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 ml-4">
          {isSidebarOpen ? <CloseIcon size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[15] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-[#1e293b] text-white flex flex-col h-screen shadow-2xl z-[5] overflow-hidden transition-all duration-300
        fixed md:sticky md:top-0 md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 md:p-8 mb-2 md:mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 flex-shrink-0">
              <FlaskConical className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white">Singh Lab</h2>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 md:px-4 py-3 space-y-1 md:space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2 md:mt-0">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg md:rounded-xl text-sm md:text-sm font-semibold transition-all duration-200 group ${
                pathname === item.path 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50" 
                  : "text-slate-300 hover:bg-white/10 hover:text-white hover:border hover:border-white/10"
              }`}
            >
              <item.icon size={20} className={`flex-shrink-0 ${pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-slate-200"}`} />
              <span className="truncate text-left">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 md:p-6 border-t border-white/10 bg-slate-900/80 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg md:rounded-xl text-sm md:text-sm font-bold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 transition-all duration-200 active:scale-95 border border-transparent hover:border-rose-500/50"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="truncate text-left">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-white/95 to-slate-50/95 backdrop-blur-xl sticky top-16 md:top-0 z-10 flex items-center justify-between px-4 sm:px-6 md:px-10 border-b border-slate-200 h-16 md:h-20 lg:h-24 shadow-sm">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 truncate">{activeItem.name}</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:block">Welcome back, Administrator</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6 flex-shrink-0 ml-4">
            <button className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg md:rounded-xl transition-all">
              <Bell size={20} className="md:w-5 md:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 sm:h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Admin</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Super</p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center text-blue-700 font-bold text-sm md:text-base lg:text-lg shadow-sm">
                  A
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5 bg-emerald-500 rounded-full border-[2px] md:border-[3px] lg:border-4 border-white shadow-lg"></div>
              </div>
              <ChevronDown size={12} className="text-slate-500 group-hover:text-slate-700 transition-all hidden sm:block md:w-4 md:h-4" />
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-4 md:p-8 lg:p-10 flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
