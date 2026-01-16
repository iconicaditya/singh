"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Download, 
  ExternalLink, 
  BookOpen,
  Loader2,
  FileText,
  Quote
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PublicationDetail() {
  const params = useParams();
  const [pub, setPub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await fetch('/api/publications', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          const found = data.find((p: any) => p.id.toString() === params.id);
          if (found) {
            setPub(found);
          } else {
            setError("Publication not found.");
          }
        }
      } catch (err) {
        setError("An error occurred while loading the publication.");
      } finally {
        setLoading(false);
      }
    };
    fetchPublication();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !pub) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">{error || "Publication Not Found"}</h2>
        <Link href="/publications" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
          <ArrowLeft size={20} /> RETURN TO PUBLICATIONS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500/30">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-12 items-start"
          >
            {/* Cover Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full md:w-80 shrink-0"
            >
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
                {pub.imageUrl ? (
                  <Image src={pub.imageUrl} alt={pub.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
                    <BookOpen size={64} className="text-white/20" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  href="/publications"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-8 transition-colors group"
                >
                  <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                  BACK TO PUBLICATIONS
                </Link>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-lg shadow-blue-600/20">
                    {pub.type}
                  </span>
                  {pub.year && (
                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {pub.year}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                  {pub.title}
                </h1>

                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Authors</p>
                      <p className="text-lg font-bold text-slate-700">{pub.authors}</p>
                    </div>
                  </div>

                  {pub.journal && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                        <BookOpen size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Journal / Publisher</p>
                        <p className="text-lg font-bold text-slate-700">{pub.journal}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="prose prose-slate max-w-none">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Quote className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight m-0">Abstract / Description</h2>
                </div>
                
                <div className="text-slate-600 text-xl leading-relaxed font-medium">
                  {pub.description || "Detailed abstract is currently unavailable for this publication."}
                </div>

                {pub.doi && (
                  <div className="mt-12 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Digital Object Identifier (DOI)</p>
                      <p className="text-sm font-bold text-slate-900 font-mono">{pub.doi}</p>
                    </div>
                    <a 
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      className="p-3 bg-white border border-slate-200 rounded-xl text-blue-600 hover:text-white hover:bg-blue-600 transition-all shadow-sm"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            <aside className="lg:col-span-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-10 text-white tracking-tight leading-none italic uppercase text-center">Resources</h3>
                  <div className="space-y-4">
                    {pub.link && (
                      <a 
                        href={pub.link}
                        target="_blank"
                        className="w-full bg-blue-600 text-white font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 text-xs tracking-widest uppercase"
                      >
                        <ExternalLink size={22} />
                        View Document
                      </a>
                    )}
                    {pub.pdfUrl && (
                      <a 
                        href={pub.pdfUrl}
                        target="_blank"
                        className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-[0.98] text-xs tracking-widest uppercase"
                      >
                        <FileText size={22} />
                        Download PDF
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied!");
                      }}
                      className="w-full bg-white/5 text-white/50 hover:text-white font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98] text-[10px] tracking-widest uppercase"
                    >
                      <Share2 size={18} />
                      Share Publication
                    </button>
                  </div>
                </div>
                <div className="absolute -right-10 -top-10 w-56 h-56 bg-blue-600/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-[1.5s]" />
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}