"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown, Calendar, Loader2, BookOpen, User, ArrowRight, Tag, Filter } from "lucide-react";
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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Research Archive
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Explore our laboratory's scientific contributions and findings in environmental sustainability and social well-being.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 text-sm font-bold appearance-none cursor-pointer"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Loading Repository...</p>
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
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col"
                  >
                    <Link href={`/research/${item.id}`} className="relative aspect-[16/10] block overflow-hidden bg-slate-100">
                      {item.titleImage ? (
                        <img 
                          src={item.titleImage} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <BookOpen size={40} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                          {item.category}
                        </span>
                      </div>
                    </Link>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3 text-slate-400">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">{item.year}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        <Link href={`/research/${item.id}`}>{item.title}</Link>
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {item.tags?.split(',').slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {item.authors?.slice(0, 3).map((author: any, i: number) => (
                            <div 
                              key={i} 
                              className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 relative overflow-hidden"
                              title={author.name}
                            >
                              {author.image ? (
                                <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
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
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:gap-2.5 transition-all"
                        >
                          View Research <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
              <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No matching entries found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
