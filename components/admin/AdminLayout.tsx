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
      <div className="md:hidden bg-[#1e293b] text-white p-3 sm:p-4 flex items-center justify-between sticky top-0 z-[10] shadow-md h-14 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FlaskConical className="text-white" size={16} />
          </div>
          <h2 className="text-sm sm:text-base md:text-lg font-bold truncate">Singh Lab</h2>
        </div>
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
          {isSidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
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
        <div className="p-6 md:p-8 mb-2 md:mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <FlaskConical className="text-white" size={24} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate">Singh Lab</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 md:px-4 py-2 space-y-0.5 md:space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 md:mb-4 mt-2 md:mt-0">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 md:py-3.5 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all group ${
                pathname === item.path 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} className={`${pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-slate-300"} flex-shrink-0`} />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 md:p-6 border-t border-white/5 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 md:py-3.5 rounded-lg md:rounded-xl text-xs md:text-sm font-bold text-rose-400 hover:bg-rose-400/10 transition-all active:scale-95"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="truncate">Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-16 md:top-0 z-10 flex items-center justify-between px-4 sm:px-6 md:px-10 border-b border-slate-100 h-16 md:h-20 lg:h-24">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 truncate">{activeItem.name}</h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Welcome back, Administrator</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6 flex-shrink-0">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg md:rounded-xl transition-all">
              <Bell size={18} className="md:w-5 md:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 sm:h-8 w-px bg-slate-100 hidden sm:block"></div>
            
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Admin</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Super</p>
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center text-blue-600 font-bold text-sm md:text-base lg:text-lg shadow-inner">
                  A
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5 bg-emerald-500 rounded-full border-[2px] md:border-[3px] lg:border-4 border-white"></div>
              </div>
              <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 transition-all hidden sm:block md:w-4 md:h-4" />
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
