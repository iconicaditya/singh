"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Loader2,
  Rocket,
  Calendar,
  MapPin,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error(err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];
  const statuses = ["All", "Ongoing", "Completed"];

  const filteredProjects = projects.filter((proj: any) => {
    const matchesSearch = proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (proj.tags && proj.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || proj.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || proj.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. Hero Header - Design match from research page */}
      <section className="relative w-full h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000" 
            alt="Research Projects" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Subtle Transparent Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Key Information Over Image */}
        <div className="container mx-auto px-6 max-w-7xl relative pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                Archive
              </span>
              <div className="flex items-center text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Rocket size={12} className="mr-2" />
                Active Projects
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              Research Projects
            </h1>

            <p className="text-lg text-white/70 max-w-2xl font-medium mb-8 leading-relaxed">
              Advancing environmental science through rigorous research and community-driven initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Content - Using the Research Page's spacing and column logic style */}
      <div className="container mx-auto px-6 max-w-7xl py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Projects List */}
          <main className="lg:w-2/3 overflow-hidden">
            <div className="space-y-12">
              <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4">
                  <span className="w-10 h-[3px] bg-blue-600 rounded-full" />
                  Portfolio
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Showing {filteredProjects.length} results
                  </span>
                </div>
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-12">
                  {filteredProjects.map((proj: any, idx: number) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex flex-col md:flex-row gap-8 bg-slate-50 rounded-3xl p-6 border border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                    >
                      <Link href={`/projects/${proj.id}`} className="relative w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
                        {proj.imageUrl ? (
                          <Image
                            src={proj.imageUrl}
                            alt={proj.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                            <Rocket size={32} className="text-slate-400" />
                          </div>
                        )}
                      </Link>
                      
                      <div className="flex-1 flex flex-col py-2">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-2 py-1 bg-white border border-slate-200 text-blue-600 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                            {proj.category}
                          </span>
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
                            proj.status?.toLowerCase() === 'completed' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {proj.status}
                          </span>
                        </div>

                        <Link href={`/projects/${proj.id}`}>
                          <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                            {proj.title}
                          </h3>
                        </Link>
                        
                        <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100/50">
                          <div className="flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                              <Calendar size={12} className="text-blue-500" />
                              {proj.projectDate || "Ongoing"}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                              <MapPin size={12} className="text-blue-500" />
                              {proj.location || "Singhabad"}
                            </div>
                          </div>
                          <Link
                            href={`/projects/${proj.id}`}
                            className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors flex items-center gap-2 group/btn"
                          >
                            Explore <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Search size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Projects Found</h3>
                  <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </main>

          {/* Right Side: Sticky Search & Filters - Design match from research page navigation style */}
          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              {/* Search Card */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <Search size={16} className="text-blue-600" /> Search Portal
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Keywords or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Filters Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/20 space-y-8">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          categoryFilter === cat 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Status</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`flex items-center justify-between p-4 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all ${
                          statusFilter === status 
                          ? 'bg-blue-50 border-blue-200 text-blue-600' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {status}
                        <div className={`w-2 h-2 rounded-full ${
                          status === 'Ongoing' ? 'bg-amber-500' : status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {(searchTerm || categoryFilter !== "All" || statusFilter !== "All") && (
                  <button 
                    onClick={() => {setSearchTerm(""); setCategoryFilter("All"); setStatusFilter("All");}}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">
                  <ArrowLeft size={14} /> Back to Home
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}