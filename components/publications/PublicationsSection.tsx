"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, FileText, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PublicationsSection() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch("/api/publications");
        const data = await res.json();
        setPublications(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  if (loading) return null;
  if (publications.length === 0) return null;

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
            <BookOpen size={14} /> RECENT RESEARCH
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase italic"
          >
            Latest <span className="text-blue-600">Publications</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
            >
              <div className="mb-6">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase rounded-full">
                  {pub.category}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 uppercase italic leading-tight group-hover:text-blue-600 transition-colors">
                {pub.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2 italic">
                {pub.description}
              </p>
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                  <User size={12} className="text-blue-500" />
                  <span className="truncate max-w-[120px]">{pub.authors}</span>
                </div>
                <a 
                  href={pub.pdfUrl ? (pub.pdfUrl.includes("cloudinary.com") ? pub.pdfUrl.replace("/raw/upload/", "/image/upload/").replace("/fl_attachment", "") : pub.pdfUrl) : "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:translate-x-1 transition-transform"
                >
                  <ArrowRight size={20} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/publications"
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-2xl group active:scale-95"
          >
            EXPLORE FULL ARCHIVE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}