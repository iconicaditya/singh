"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, MapPin, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";

const ITEMS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
              Our <span className="text-blue-500">Projects</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Discover our ongoing and completed initiatives in environmental conservation and sustainable development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl py-6">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search projects by title, category, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-900"
            />
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {paginatedProjects.map((project, idx) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {!loading && paginatedProjects.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">No Projects Found</h3>
                  <p className="text-slate-500 font-medium">Try adjusting your search criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
