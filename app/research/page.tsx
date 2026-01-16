"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown, Calendar, Loader2, BookOpen, User, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

const ITEMS_PER_PAGE = 9;

export default function ResearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [researchList, setResearchList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setResearchList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResearch();
  }, []);

  const categories = useMemo(() => ["All Categories", ...new Set(researchList.map(p => p.category).filter(Boolean))], [researchList]);

  const filteredResearch = useMemo(() => {
    return researchList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.tags && item.tags.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, researchList]);

  const totalPages = Math.ceil(filteredResearch.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleResearch = filteredResearch.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-100 selection:text-blue-900">
      {/* Refined Hero */}
      <section className="relative pt-32 pb-20 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase text-blue-600 bg-blue-50 rounded-full border border-blue-100">
                Scientific Repository
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
                Research <span className="text-blue-600">Archive</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
                Documenting our latest findings in environmental science and sustainable ecosystem management.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Filter Bar */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-6 max-w-6xl py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by title, category, or tags..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-semibold"
              />
            </div>
            <div className="w-full md:w-64 relative">
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select 
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-sm font-bold cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Research Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Publications...</p>
            </div>
          ) : visibleResearch.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleResearch.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] transition-all duration-500"
                  >
                    <Link href={`/research/${item.id}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {item.titleImage ? (
                        <Image
                          src={item.titleImage}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <BookOpen size={48} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>

                    <div className="p-7 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                          {item.category}
                        </span>
                        <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          <Calendar size={12} className="mr-1.5" />
                          {item.year}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        <Link href={`/research/${item.id}`}>{item.title}</Link>
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.tags?.split(',').slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] font-medium text-slate-500">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {item.authors?.slice(0, 3).map((author: any, i: number) => (
                            <div 
                              key={i} 
                              className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative"
                              title={author.name}
                            >
                              {author.image ? (
                                <Image src={author.image} alt={author.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                                  <User size={12} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <Link 
                          href={`/research/${item.id}`} 
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-all"
                        >
                          View Report <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-3">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                          : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <Search size={48} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No research found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
