"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FlaskConical, 
  BookOpen, 
  Users, 
  Activity,
  ArrowUpRight,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface StatData {
  research: number;
  publications: number;
  team: number;
  messages: number;
  projects: number;
  gallery: number;
  unreadMessages: number;
  activities: number;
}

interface RecentItem {
  id: string | number;
  title: string;
  category: string;
  created_at: string;
  type: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatData>({
    research: 0,
    publications: 0,
    team: 0,
    messages: 0,
    projects: 0,
    gallery: 0,
    unreadMessages: 0,
    activities: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [researchRes, publicationsRes, teamRes, messagesRes, projectsRes, galleryRes, activitiesRes] = await Promise.all([
          fetch("/api/research"),
          fetch("/api/publications"),
          fetch("/api/team"),
          fetch("/api/contact"),
          fetch("/api/projects"),
          fetch("/api/gallery"),
          fetch("/api/activities"),
        ]);

        const research = researchRes.ok ? await researchRes.json() : [];
        const publications = publicationsRes.ok ? await publicationsRes.json() : [];
        const team = teamRes.ok ? await teamRes.json() : [];
        const messages = messagesRes.ok ? await messagesRes.json() : [];
        const projects = projectsRes.ok ? await projectsRes.json() : [];
        const gallery = galleryRes.ok ? await galleryRes.json() : [];
        const activities = activitiesRes.ok ? await activitiesRes.json() : [];

        const unreadCount = Array.isArray(messages) ? messages.filter((m: any) => !m.is_read).length : 0;

        setStats({
          research: Array.isArray(research) ? research.length : 0,
          publications: Array.isArray(publications) ? publications.length : 0,
          team: Array.isArray(team) ? team.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          unreadMessages: unreadCount,
          activities: Array.isArray(activities) ? activities.length : 0,
        });

        // Combine recent items from all sources for the activity feed
        const allItems: RecentItem[] = [
          ...(Array.isArray(research) ? research.slice(0, 2).map((r: any, idx: number) => ({ ...r, id: `research-${r.id}-${idx}`, type: "Research" })) : []),
          ...(Array.isArray(publications) ? publications.slice(0, 2).map((p: any, idx: number) => ({ ...p, id: `publication-${p.id}-${idx}`, type: "Publication" })) : []),
          ...(Array.isArray(projects) ? projects.slice(0, 2).map((p: any, idx: number) => ({ ...p, id: `project-${p.id}-${idx}`, type: "Project" })) : []),
          ...(Array.isArray(activities) ? activities.slice(0, 2).map((a: any, idx: number) => ({ ...a, id: `activity-${a.id}-${idx}`, type: "Activity" })) : []),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

        setRecentItems(allItems);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { name: "Total Research", value: stats.research, icon: FlaskConical, color: "bg-blue-500", path: "/login/dashboard/research", gradient: "from-blue-400 to-blue-600" },
    { name: "Publications", value: stats.publications, icon: BookOpen, color: "bg-purple-500", path: "/login/dashboard/publications", gradient: "from-purple-400 to-purple-600" },
    { name: "Team Members", value: stats.team, icon: Users, color: "bg-emerald-500", path: "/login/dashboard/team", gradient: "from-emerald-400 to-emerald-600" },
    { name: "Messages", value: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : `${stats.messages}`, icon: MessageSquare, color: "bg-rose-500", path: "/login/dashboard/messages", gradient: "from-rose-400 to-rose-600" },
    { name: "Projects", value: stats.projects, icon: Briefcase, color: "bg-cyan-500", path: "/login/dashboard/projects", gradient: "from-cyan-400 to-cyan-600" },
    { name: "Gallery", value: stats.gallery, icon: ImageIcon, color: "bg-amber-500", path: "/login/dashboard/gallery", gradient: "from-amber-400 to-amber-600" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group"
          >
            <Link href={stat.path}>
              <div className={`bg-gradient-to-br ${stat.gradient} p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg sm:rounded-2xl md:rounded-3xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}>
                <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl shadow-inner">
                    <stat.icon size={20} className="sm:w-5 sm:h-5 md:w-7 md:h-7" />
                  </div>
                  {stat.name !== "Messages" && (
                    <div className="text-right">
                      <TrendingUp size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/60" />
                    </div>
                  )}
                </div>
                <p className="text-white/80 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest mb-1 sm:mb-2">{stat.name}</p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{loading ? <Loader2 size={16} className="animate-spin" /> : stat.value}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-6 lg:mb-8">
            <div className="bg-blue-50 p-2.5 sm:p-3 rounded-lg md:rounded-xl flex-shrink-0">
              <Activity className="text-blue-600" size={20} />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 truncate">Quick Actions</h2>
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <Link href="/login/dashboard/research" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg md:rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all group">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg group-hover:bg-blue-50 transition-colors flex-shrink-0">
                <FlaskConical className="text-blue-600" size={16} />
              </div>
              <span className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 truncate">Add Research</span>
              <ArrowUpRight size={14} className="ml-auto text-slate-400 flex-shrink-0" />
            </Link>
            <Link href="/login/dashboard/publications" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg md:rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all group">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg group-hover:bg-purple-50 transition-colors flex-shrink-0">
                <BookOpen className="text-purple-600" size={16} />
              </div>
              <span className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 truncate">Add Publication</span>
              <ArrowUpRight size={14} className="ml-auto text-slate-400 flex-shrink-0" />
            </Link>
            <Link href="/login/dashboard/messages" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-rose-50 to-rose-100 rounded-lg md:rounded-2xl hover:from-rose-100 hover:to-rose-200 transition-all group">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg group-hover:bg-rose-50 transition-colors flex-shrink-0">
                <MessageSquare className="text-rose-600" size={16} />
              </div>
              <span className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 truncate">View Messages</span>
              {stats.unreadMessages > 0 && (
                <span className="ml-auto px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-rose-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex-shrink-0">{stats.unreadMessages}</span>
              )}
            </Link>
            <Link href="/login/dashboard/projects" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg md:rounded-2xl hover:from-cyan-100 hover:to-cyan-200 transition-all group">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg group-hover:bg-cyan-50 transition-colors flex-shrink-0">
                <Briefcase className="text-cyan-600" size={16} />
              </div>
              <span className="font-semibold text-xs sm:text-sm md:text-base text-slate-900 truncate">Add Project</span>
              <ArrowUpRight size={14} className="ml-auto text-slate-400 flex-shrink-0" />
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 md:mb-6 lg:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="bg-amber-50 p-2.5 sm:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                <Clock className="text-amber-600" size={20} />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 truncate">Recent Activity</h2>
            </div>
            <Link href="/login/dashboard/activities" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold flex-shrink-0">View All →</Link>
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-slate-400" size={32} />
              </div>
            ) : recentItems.length > 0 ? (
              recentItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-5 bg-slate-50 rounded-lg md:rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100 hover:border-slate-200"
                >
                  <div className={`p-1.5 sm:p-2 md:p-3 rounded-lg flex-shrink-0 ${
                    item.type === "Research" ? "bg-blue-100" :
                    item.type === "Publication" ? "bg-purple-100" :
                    item.type === "Project" ? "bg-cyan-100" :
                    "bg-amber-100"
                  }`}>
                    {item.type === "Research" && <FlaskConical className="text-blue-600" size={16} />}
                    {item.type === "Publication" && <BookOpen className="text-purple-600" size={16} />}
                    {item.type === "Project" && <Briefcase className="text-cyan-600" size={16} />}
                    {item.type === "Activity" && <Activity className="text-amber-600" size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                      <h3 className="font-semibold text-slate-900 truncate text-xs sm:text-sm md:text-base">{item.title}</h3>
                      <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] sm:text-[10px] font-bold rounded-full flex-shrink-0">{item.type}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 truncate">{item.category} • {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle className="text-emerald-500 flex-shrink-0" size={16} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="text-slate-400 mx-auto mb-3" size={32} />
                <p className="text-slate-500 font-medium text-sm">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] text-white shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-black mb-1 sm:mb-2">System Status</h2>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base">All systems operational and running smoothly</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm md:text-base font-semibold">Online</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
