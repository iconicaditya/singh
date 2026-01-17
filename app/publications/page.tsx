"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BookOpen, FileText, Search, Filter, ArrowLeft, ArrowRight, User, Tag, Calendar } from "lucide-react";
import Link from "next/link";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch("/api/publications");
        const data = await res.json();
        setPublications(data);
      } catch (err) {
        console.error("Error fetching publications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const categories = ["ALL", ...Array.from(new Set((Array.isArray(publications) ? publications : []).map(pub => pub.category)))];

  const filteredPublications = (Array.isArray(publications) ? publications : []).filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pub.authors.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "ALL" || pub.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">
              Scholarly <span className="text-blue-500">Works</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-8">
              Explore our research contributions and scientific publications in the field of environmental science and sustainability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-900"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPublications.map((pub, idx) => (
                  <motion.div
                    key={pub.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-blue-100">
                        {pub.category}
                      </span>
                      <BookOpen size={20} className="text-slate-200" />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 italic uppercase">
                      {pub.title}
                    </h3>

                    <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-3 leading-relaxed italic">
                      {pub.description}
                    </p>

                    <div className="mt-auto space-y-6">
                      <div className="flex items-start gap-3">
                        <User size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest line-clamp-1">{pub.authors}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {pub.tags?.split(',').map((tag: string) => (
                          <span key={tag} className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                            <Tag size={10} /> {tag.trim()}
                          </span>
                        ))}
                      </div>

                      <a
                        href={pub.pdfUrl ? (pub.pdfUrl.includes('cloudinary.com') && !pub.pdfUrl.includes('/raw/upload/') ? pub.pdfUrl.replace('/image/upload/', '/raw/upload/') : pub.pdfUrl) : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98]"
                      >
                        VIEW PDF <FileText size={18} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredPublications.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
              <BookOpen size={48} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2 italic uppercase">No Publications Found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}