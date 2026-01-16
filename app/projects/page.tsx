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

      {/* 2. Search & Filters - Full Width */}
      <div className="bg-slate-50 border-b border-slate-100 py-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input
                type="text"
                placeholder="Search projects by keywords or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xl font-medium text-slate-700 shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
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
                      className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
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
        </div>
      </div>

      {/* 3. Main Content - Single Column Full Width Style */}
      <div className="container mx-auto px-6 max-w-5xl py-24">
        <div className="space-y-40">
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
                  <div className="flex items-center gap-6 mb-8">
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                      {proj.category}
                    </span>
                    <div className={`flex items-center text-[10px] font-bold uppercase tracking-[0.2em] ${
                      proj.status?.toLowerCase() === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full mr-3 ${
                        proj.status?.toLowerCase() === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      {proj.status}
                    </div>
                  </div>

                  <Link href={`/projects/${proj.id}`} className="group inline-block mb-8">
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 flex items-center gap-6 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                      <span className="w-12 h-[4px] bg-blue-600 rounded-full shrink-0" />
                      {proj.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap items-center gap-10 text-slate-400 mb-12">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                      <Calendar size={18} className="text-blue-500" />
                      {proj.projectDate || "Ongoing"}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                      <MapPin size={18} className="text-blue-500" />
                      {proj.location || "Singhabad Lab"}
                    </div>
                  </div>

                  <p className="text-slate-600 text-2xl leading-relaxed mb-16 font-medium whitespace-pre-wrap max-w-4xl">
                    {proj.description}
                  </p>

                  {proj.imageUrl && (
                    <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl mb-16 group bg-slate-100">
                      <Image 
                        src={proj.imageUrl} 
                        alt={proj.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        priority={idx === 0}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                    <Link 
                      href={`/projects/${proj.id}`}
                      className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] hover:bg-blue-600 transition-all font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 group"
                    >
                      View Full Project Details
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.section>
            ))
          ) : (
            <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Search size={40} className="text-slate-300" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">No Projects Match Your Query</h3>
              <p className="text-slate-500 text-xl font-medium mb-10">Try clearing your filters or refine your search.</p>
              <button 
                onClick={() => {setSearchTerm(""); setCategoryFilter("All"); setStatusFilter("All");}}
                className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-slate-50 border-t border-slate-100 py-32 mt-20">
        <div className="container mx-auto px-6 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-4 px-12 py-6 bg-white border border-slate-200 rounded-[2.5rem] text-slate-900 hover:text-blue-600 hover:border-blue-600 transition-all font-bold shadow-sm text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={24} />
            Back to Laboratory Overview
          </Link>
        </div>
      </footer>
    </div>
  );
}