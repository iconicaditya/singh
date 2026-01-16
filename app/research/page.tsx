"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, ChevronDown, Calendar, Loader2, BookOpen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

const ITEMS_PER_PAGE = 12;

export default function ResearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("All Dates");
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

  const filteredResearch = useMemo(() => {
    return researchList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchesDate = selectedDate === "All Dates" || item.year === selectedDate;
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [searchTerm, selectedCategory, selectedDate, researchList]);

  const totalPages = Math.ceil(filteredResearch.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleResearch = filteredResearch.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const categories = useMemo(() => ["All Categories", ...new Set(researchList.map(p => p.category).filter(Boolean))], [researchList]);
  const dates = useMemo(() => ["All Dates", ...new Set(researchList.map(p => p.year).filter(Boolean))].sort().reverse(), [researchList]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1532187875605-2fe358a3d46a?q=80&w=2000"
            alt="Research Hero"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic text-white">
              Research <span className="text-blue-500">Gallery</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              Explore our core research focus areas and scientific milestones.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="relative z-20 -mt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search research gallery..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-16 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 font-bold"
                />
              </div>

              <div className="lg:col-span-3 relative">
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                <select 
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none pl-6 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold cursor-pointer"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="lg:col-span-3 relative">
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                <select 
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none pl-6 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold cursor-pointer"
                >
                  {dates.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Database...</p>
            </div>
          ) : visibleResearch.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
              {visibleResearch.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative h-72 overflow-hidden">
                    {item.titleImage ? (
                      <Image
                        src={item.titleImage}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-200">
                        <BookOpen size={64} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black tracking-widest text-blue-600 shadow-xl border border-white/50 uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60">{item.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.tags?.split(',').slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider rounded-md border border-slate-100">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex -space-x-2">
                         {item.authors?.slice(0, 3).map((a: any, i: number) => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative shadow-sm" title={a.name}>
                             {a.image ? (
                               <Image src={a.image} alt={a.name} fill className="object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                                 <User size={12} />
                               </div>
                             )}
                           </div>
                         ))}
                      </div>
                      <Link href={`/research/${item.id}`} className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 group-hover:text-blue-600 transition-all uppercase">
                        Read More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-slate-50 rounded-[3rem] border border-slate-100">
              <Search size={48} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase italic">No Gallery Items Found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`w-14 h-14 rounded-2xl font-black transition-all border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-500 shadow-xl scale-110"
                      : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
