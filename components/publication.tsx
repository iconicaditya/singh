"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, ExternalLink, FileText, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Publication() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch("/api/publications", { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data)) {
          // Only show the most recent 3
          setPublications(data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-blue-100"
          >
            <BookOpen size={14} /> SCHOLARLY WORKS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase italic"
          >
            Recent <span className="text-blue-600">Publications</span>
          </motion.h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
            Our latest contributions to scientific research and academic literature.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {publications.map((pub, index) => {
              const targetUrl = pub.pdfUrl || pub.link || "#";
              return (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full overflow-hidden cursor-pointer"
                  onClick={() => window.open(targetUrl, '_blank')}
                >
                  {/* Thumbnail if available */}
                  <div className="relative aspect-video bg-slate-50 overflow-hidden">
                    {pub.imageUrl ? (
                      <Image 
                        src={pub.imageUrl} 
                        alt={pub.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-blue-600/10">
                        <BookOpen size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black tracking-widest uppercase text-blue-600 shadow-lg border border-white/50">
                        {pub.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[9px] mb-4">
                      <Calendar size={12} className="text-blue-500" />
                      {pub.year}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight tracking-tight line-clamp-2 uppercase italic">
                      {pub.title}
                    </h3>

                    <p className="text-slate-500 text-sm font-medium italic mb-6 line-clamp-2">
                      {pub.authors}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                        <Tag size={12} className="text-blue-500" />
                        <span className="truncate max-w-[120px]">{pub.journal || "SINGHLAB"}</span>
                      </div>
                      <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/all-publications"
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-2xl shadow-black/10 group active:scale-95"
          >
            EXPLORE FULL ARCHIVE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}