"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Loader2,
  Rocket,
  Calendar,
  MapPin,
  ArrowLeft
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
      {/* 1. Hero Header */}
      <section className="relative w-full h-[65vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000" 
            alt="Research Projects" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="container mx-auto px-6 max-w-7xl relative pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                Portfolio
              </span>
              <div className="flex items-center text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Rocket size={12} className="mr-2" />
                Active Research
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              Research Projects
            </h1>
            <p className="text-xl text-white/70 max-w-2xl font-medium mb-8 leading-relaxed">
              Advancing environmental science through rigorous research and community-driven initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Content - Single Column Full Width Style */}
      <div className="container mx-auto px-6 max-w-5xl py-20">
        {/* Search & Filters */}
        <div className="mb-20 space-y-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search projects by keywords or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium text-slate-700 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    categoryFilter === cat 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                    : 'bg-white text-slate-500 hover:border-slate-300 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</span>
              <div className="flex gap-2">
                {statuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                      statusFilter === status 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' 
                      : 'bg-white text-slate-500 hover:border-slate-300 border-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Items List */}
        <div className="space-y-32">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((proj: any, idx: number) => (
              <motion.section 
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="scroll-mt-32"
              >
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                      {proj.category}
                    </span>
                    <div className={`flex items-center text-[10px] font-bold uppercase tracking-[0.2em] ${
                      proj.status?.toLowerCase() === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        proj.status?.toLowerCase() === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      {proj.status}
                    </div>
                  </div>

                  <Link href={`/projects/${proj.id}`} className="group inline-block">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-4 group-hover:text-blue-600 transition-colors">
                      <span className="w-10 h-[3px] bg-blue-600 rounded-full shrink-0" />
                      {proj.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <Calendar size={14} className="text-blue-500" />
                      {proj.projectDate || "Ongoing"}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={14} className="text-blue-500" />
                      {proj.location || "Singhabad Lab"}
                    </div>
                  </div>

                  <p className="text-slate-600 text-xl leading-relaxed mb-10 font-medium whitespace-pre-wrap">
                    {proj.description}
                  </p>

                  {proj.imageUrl && (
                    <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl mb-10 group">
                      <Image 
                        src={proj.imageUrl} 
                        alt={proj.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    </div>
                  )}

                  <Link 
                    href={`/projects/${proj.id}`}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-900/10"
                  >
                    View Case Study
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.section>
            ))
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Match Your Search</h3>
              <p className="text-slate-500 font-medium mb-8">Try adjusting your filters or checking back later.</p>
              <button 
                onClick={() => {setSearchTerm(""); setCategoryFilter("All"); setStatusFilter("All");}}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-slate-50 border-t border-slate-100 py-20 mt-20">
        <div className="container mx-auto px-6 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-[2rem] text-slate-900 hover:text-blue-600 hover:border-blue-600 transition-all font-bold shadow-sm text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={20} />
            Back to Overview
          </Link>
        </div>
      </footer>
    </div>
  );
}