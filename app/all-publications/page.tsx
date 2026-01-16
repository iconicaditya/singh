"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, Calendar, User, Search, Filter, ArrowLeft } from "lucide-react";
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
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
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
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none italic uppercase"
          >
            Full <span className="text-blue-600">Publications</span>
          </motion.h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Explore our comprehensive repository of scientific research and scholarly contributions.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 border-b border-slate-100 sticky top-16 bg-white/80 backdrop-blur-xl z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-black font-medium shadow-inner"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-600 text-sm cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-600 text-sm cursor-pointer"
              >
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <button className="p-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPublications.map((pub: any, idx: number) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgb(0,0,0,0.05)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-blue-100">
                        {pub.type}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <Calendar size={14} />
                        {pub.year}
                      </div>
                    </div>

                    <Link href={`/publications/${pub.id}`}>
                      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                        {pub.title}
                      </h3>
                    </Link>

                    <p className="text-slate-500 text-sm font-medium italic mb-6 line-clamp-2">
                      {pub.authors}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <Link 
                      href={`/publications/${pub.id}`}
                      className="text-[10px] font-black tracking-widest uppercase text-slate-400 group-hover:text-blue-600 flex items-center gap-2 transition-colors"
                    >
                      DOI <ExternalLink size={12} />
                    </Link>
                    <Link 
                      href={`/publications/${pub.id}`}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 transition-all shadow-lg shadow-black/5 active:scale-95"
                    >
                      View Full Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredPublications.length === 0 && (
            <div className="text-center py-40">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}