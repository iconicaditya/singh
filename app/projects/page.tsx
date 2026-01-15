"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  Loader2,
  Rocket,
  Tag,
  Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProjects = projects.filter((proj: any) =>
    proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">Our Projects</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Exploring cutting-edge solutions for environmental sustainability and waste management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by project name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-black"
            />
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((proj: any, idx: number) => (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    {proj.imageUrl ? (
                      <Image
                        src={proj.imageUrl}
                        alt={proj.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <Rocket size={48} className="text-slate-200" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg">
                        {proj.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                      {proj.title}
                    </h3>
                    
                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {proj.tags && proj.tags.split(',').map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100">
                          <Tag size={10} /> {tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <Link
                        href={`/projects/${proj.id}`}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest uppercase hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-black/5"
                      >
                        <ExternalLink size={16} />
                        Explore Project
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}