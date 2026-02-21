"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, FileText, User, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
            className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase"
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
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full"
            >
              {/* Cover Image */}
              <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-slate-100 overflow-hidden">
                {pub.coverImageUrl ? (
                  <Image
                    src={pub.coverImageUrl}
                    alt={pub.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={48} className="text-blue-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
              </div>

              <div className="p-8 flex flex-col h-full">
                {/* Publication Type and Year */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-blue-200">
                    {pub.publicationType}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black tracking-widest flex items-center gap-1 rounded-full border border-slate-200">
                    <Calendar size={12} /> {pub.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-slate-900 mb-3 line-clamp-2 uppercase leading-tight group-hover:text-blue-600 transition-colors">
                  {pub.title}
                </h3>

                {/* Authors */}
                <div className="flex items-start gap-2 mb-4 text-sla text-sm">
                  <User size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 font-semibold line-clamp-2">{pub.authors}</span>
                </div>

                {/* Journal/Conference Name */}
                {pub.journalConferenceName && (
                  <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-1 italic">
                    {pub.journalConferenceName}
                  </p>
                )}

                {/* Abstract */}
                <p className="text-sm text-slate-600 font-medium mb-6 line-clamp-3 flex-grow">
                  {pub.abstract}
                </p>

                {/* Keywords */}
                {pub.keywords && (
                  <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {pub.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-md border border-slate-200">
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer with Links */}
                <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                  {pub.pdfUrl && (
                    <a 
                      href={pub.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-100 transition-all flex items-center gap-2"
                    >
                      <FileText size={14} /> PDF
                    </a>
                  )}
                  {pub.doiUrl && (
                    <a 
                      href={pub.doiUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-2"
                    >
                      <ExternalLink size={14} /> View
                    </a>
                  )}
                </div>
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