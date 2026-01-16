"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, Calendar, User, Search, Filter, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AllPublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedYear, setSelectedYear] = useState("All Years");

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch("/api/publications", { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPublications(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const categories = ["All Categories", ...new Set(publications.map(p => p.type).filter(Boolean))];
  const years = ["All Years", ...new Set(publications.map(p => p.year).filter(Boolean))].sort((a, b) => b.localeCompare(a));

  const filteredPublications = publications.filter((pub: any) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pub.authors.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || pub.type === selectedCategory;
    const matchesYear = selectedYear === "All Years" || pub.year === selectedYear;
    return matchesSearch && matchesCategory && matchesYear;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-bold text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="text-sm font-black text-slate-900 tracking-tighter uppercase italic">
            SinghLab <span className="text-blue-600">Archive</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none italic uppercase"
          >
            Full <span className="text-blue-500">Archive</span>
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            A comprehensive database of every research milestone achieved by the SinghLab group.
          </p>
        </div>
      </section>

      {/* Control Panel */}
      <section className="py-12 border-b border-slate-100 sticky top-16 bg-white/90 backdrop-blur-2xl z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Filter by title or author name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-black font-semibold shadow-inner"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-8 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-blue-500/5 transition-all font-black text-slate-600 text-xs tracking-widest uppercase cursor-pointer appearance-none min-w-[180px]"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-8 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-blue-500/5 transition-all font-black text-slate-600 text-xs tracking-widest uppercase cursor-pointer appearance-none min-w-[140px]"
              >
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Results Grid */}
      <section className="py-24 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPublications.map((pub: any, idx: number) => {
                const targetUrl = pub.pdfUrl || pub.link || "#";
                return (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between cursor-pointer"
                    onClick={() => window.open(targetUrl, '_blank')}
                  >
                    <div>
                      {/* Thumbnail if available */}
                      {pub.imageUrl && (
                        <div className="relative aspect-video mb-8 rounded-[2rem] overflow-hidden">
                          <Image src={pub.imageUrl} alt={pub.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-6">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-blue-100">
                          {pub.type}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <Calendar size={14} className="text-blue-500" />
                          {pub.year}
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight tracking-tight line-clamp-2">
                        {pub.title}
                      </h3>

                      {pub.journal && (
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-4">
                          <Tag size={12} className="text-blue-500" />
                          {pub.journal}
                        </div>
                      )}

                      <p className="text-slate-500 text-sm font-medium italic mb-8 line-clamp-2">
                        {pub.authors}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-8 border-t border-slate-50">
                      <div className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 text-[10px] tracking-widest uppercase">
                        {pub.pdfUrl ? <FileText size={14} /> : <ExternalLink size={14} />}
                        {pub.pdfUrl ? "PDF" : "Link"}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && filteredPublications.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search size={40} className="text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight italic uppercase">Archive Empty</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">No publications match your current filters. Try resetting the year or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}