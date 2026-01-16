"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, FileText, Calendar, User, Search } from "lucide-react";
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
        console.log("Fetching from /api/publications...");
        const res = await fetch("/api/publications", { cache: 'no-store' });
        const data = await res.json();
        console.log("Data received:", data);
        if (Array.isArray(data)) {
          setPublications(data);
        } else {
          setPublications([]);
          console.error("Publications data is not an array:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setPublications([]);
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
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2000')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Publications</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Our research contributions to journals, conferences, and academic books.
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
              placeholder="Search by title, author, or journal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-black"
            />
          </div>
        </div>
      </section>

      {/* Publications List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {filteredPublications.map((pub: any, idx: number) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all flex flex-col md:flex-row gap-8"
                >
                  {pub.imageUrl && (
                    <div className="relative w-full md:w-48 h-64 md:h-auto shrink-0 overflow-hidden rounded-2xl">
                      <Image
                        src={pub.imageUrl}
                        alt={pub.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase rounded-lg">
                        {pub.type}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                        <Calendar size={14} />
                        {pub.year}
                      </div>
                    </div>

                    <Link href={`/publications/${pub.id}`}>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        {pub.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-slate-600 mb-4 italic">
                      <User size={16} className="shrink-0" />
                      <p className="text-sm line-clamp-1">{pub.authors}</p>
                    </div>

                    {pub.journal && (
                      <p className="text-slate-500 text-sm font-semibold mb-3 flex items-center gap-2">
                        <BookOpen size={16} />
                        {pub.journal}
                      </p>
                    )}

                    {pub.description && (
                      <p className="text-slate-600 text-sm mb-6 line-clamp-2 font-medium">
                        {pub.description}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap gap-4">
                      <Link
                        href={`/publications/${pub.id}`}
                        className="group/btn flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest uppercase hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-black/5 active:scale-95"
                      >
                        <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        View Details
                      </Link>
                      {pub.pdfUrl && (
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                        >
                          <FileText size={14} className="group-hover/btn:scale-110 transition-transform" />
                          Read PDF
                        </a>
                      )}
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