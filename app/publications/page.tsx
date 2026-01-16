"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, Calendar, User, Search, Tag, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPublications = publications.filter((pub: any) =>
    pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.journal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2000')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter italic uppercase">
              Research <span className="text-blue-500">Publications</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
              Academic contributions and scholarly works from the SinghLab research group.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-12 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-xl z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search by title, author, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-black font-semibold text-lg shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Database...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {filteredPublications.map((pub: any, idx: number) => {
                const targetUrl = pub.pdfUrl || pub.link || "#";
                return (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-[3rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col lg:flex-row overflow-hidden"
                  >
                    {/* Image/Thumbnail Column */}
                    <a 
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lg:w-80 shrink-0 relative aspect-[4/3] lg:aspect-auto bg-slate-100 overflow-hidden cursor-pointer block"
                    >
                      {pub.imageUrl ? (
                        <Image
                          src={pub.imageUrl}
                          alt={pub.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/5 text-blue-600/20">
                          <BookOpen size={80} />
                        </div>
                      )}
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black tracking-widest uppercase text-blue-600 shadow-xl border border-white/50">
                          {pub.type}
                        </span>
                      </div>
                    </a>

                    {/* Content Column */}
                    <div className="flex-1 p-10 lg:p-14 flex flex-col">
                      <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
                          <Calendar size={16} className="text-blue-500" />
                          {pub.year}
                        </div>
                        {pub.journal && (
                          <div className="flex items-center gap-2 text-slate-600 font-black uppercase tracking-widest text-xs">
                            <Tag size={16} className="text-blue-500" />
                            {pub.journal}
                          </div>
                        )}
                      </div>

                      <a 
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                      >
                        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight group-hover:text-blue-600 transition-colors">
                          {pub.title}
                        </h3>
                      </a>

                      <div className="flex items-start gap-3 mb-8">
                        <User size={20} className="text-slate-300 shrink-0 mt-1" />
                        <p className="text-lg text-slate-500 font-medium italic leading-relaxed">
                          {pub.authors}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-wrap gap-4">
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] text-xs font-black tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                        >
                          {pub.pdfUrl ? <FileText size={18} /> : <ExternalLink size={18} />}
                          {pub.pdfUrl ? "View Full PDF" : "Visit Publisher Site"}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}