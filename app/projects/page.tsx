"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Loader2,
  Rocket,
  Tag,
  Calendar,
  Filter,
  MapPin
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-[#0f172a]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">Research Projects</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
              Advancing environmental science through rigorous research and community-driven initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-[140px] z-30 py-8 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search projects or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-900 font-medium"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <Filter size={16} className="text-slate-500" />
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <div className={`w-2 h-2 rounded-full ${statusFilter === 'Ongoing' ? 'bg-amber-500' : statusFilter === 'Completed' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-700 outline-none"
                >
                  {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProjects.map((proj: any, idx: number) => (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all overflow-hidden flex flex-col"
                >
                  <Link href={`/projects/${proj.id}`} className="relative h-60 overflow-hidden block">
                    {proj.imageUrl ? (
                      <Image
                        src={proj.imageUrl}
                        alt={proj.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <Rocket size={40} className="text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-700 text-[10px] font-black tracking-widest uppercase rounded-lg shadow-sm border border-blue-100">
                        {proj.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg ${
                        proj.status.toLowerCase() === 'completed' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-amber-500 text-white'
                      }`}>
                        {proj.status}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <Calendar size={12} />
                      {proj.projectDate || new Date(proj.createdAt).toLocaleDateString()}
                    </div>

                    <Link href={`/projects/${proj.id}`}>
                      <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                        {proj.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{proj.location || "Global"}</span>
                      </div>
                      <Link
                        href={`/projects/${proj.id}`}
                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors flex items-center gap-1"
                      >
                        View Project →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No Projects Found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setSearchTerm(""); setCategoryFilter("All"); setStatusFilter("All");}}
                className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}