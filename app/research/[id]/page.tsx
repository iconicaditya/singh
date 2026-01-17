"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  User, 
  Tag, 
  ChevronRight, 
  FileText,
  Target,
  Users,
  Info,
  Clock,
  ExternalLink,
  CheckCircle2,
  Share2,
  Download,
  BookOpen,
  List
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ResearchDetail() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          const found = data.find((r: any) => r.id.toString() === params.id);
          if (found) {
            setItem(found);
          } else {
            setError("Document not found.");
          }
        }
      } catch (err) {
        setError("Connection error.");
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, [params.id]);

  const toc = useMemo(() => {
    if (!item?.contentSections) return [];
    return item.contentSections.map((section: any, index: number) => ({
      title: section.title,
      id: `section-${index}`
    }));
  }, [item]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Research Profile</p>
      </div>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 text-slate-200">
        <Info size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Research Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md font-medium">The scholarly work you are looking for might have been moved or archived.</p>
      <Link href="/research" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center gap-3">
        <ArrowLeft size={16} /> Back to Repository
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Hero Header - Full Width Title Image at the Very Top */}
      <section className="relative w-full h-[75vh] flex items-end overflow-hidden bg-slate-950">
        {item.titleImage ? (
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={item.titleImage} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-950" />
        )}
        
        {/* Advanced Overlay to match Screenshot */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-grid-white/[0.03] -z-0" />
        
        <div className="container mx-auto px-6 max-w-7xl relative pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded shadow-lg shadow-blue-600/20">
                {item.category || "RESEARCH"}
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded text-white text-[9px] font-black uppercase tracking-widest">
                <Calendar size={12} className="text-blue-400" />
                {item.year || "2026"}
              </div>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.9] drop-shadow-2xl">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4 p-1 pr-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden shadow-lg">
                  {item.authors?.[0]?.image ? (
                    <img src={item.authors[0].image} alt={item.authors[0].name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white/50"><User size={16} /></div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">By</p>
                  <p className="text-xs font-black text-white uppercase tracking-widest">{item.authors?.map((a: any) => a.name).join(", ")}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags?.split(',').map((tag: string) => (
                  <span key={tag} className="text-[9px] font-bold text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Content - Two Column Layout */}
      <div className="container mx-auto px-6 max-w-7xl py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left Side: Research Content */}
          <main className="lg:w-[65%] space-y-24">
            <div className="space-y-24">
              {item.contentSections?.map((section: any, idx: number) => (
                <section key={idx} id={`section-${idx}`} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                      <FileText size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">{section.title}</h2>
                  </div>

                  {section.image && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="mb-12 relative aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl"
                    >
                      <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                    </motion.div>
                  )}

                  <div 
                    className="prose prose-slate max-w-none 
                      text-xl text-slate-600 leading-[1.8] font-medium rich-text-content
                      prose-p:mb-8 prose-strong:text-slate-900 prose-strong:font-black"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </section>
              ))}
            </div>

            {/* Related Publications Section to match Screenshot */}
            <div className="pt-24 border-t border-slate-100">
              <div className="flex items-center gap-4 mb-16">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Related Publications</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {(item.relatedPublications?.length > 0 ? item.relatedPublications : [1,2,3]).map((pub: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -10 }}
                    className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all flex flex-col h-full"
                  >
                    <div className="mb-6 flex justify-between items-start">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded border border-blue-100">
                        {pub.category || "RESEARCH"}
                      </span>
                      <div className="text-slate-200 group-hover:text-blue-100 transition-colors">
                        <FileText size={20} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {pub.title || "TGREREER"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{pub.subtitle || "gdsrgvde"}</p>
                    
                    <div className="flex items-center gap-3 mb-8 pt-6 border-t border-slate-50 mt-auto">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <User size={14} />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A. GRGRGGRF</span>
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                      VIEW PDF <FileText size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </main>

          {/* Right Side: Sticky TOC & Actions */}
          <aside className="lg:w-[35%] space-y-10">
            <div className="sticky top-32 space-y-10">
              {/* Table of Contents Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-50/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <List size={18} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Table of contents</h4>
                </div>
                <nav className="space-y-6">
                  {toc.map((link: any, i: number) => (
                    <a 
                      key={i} 
                      href={`#${link.id}`} 
                      className="group flex items-center gap-4 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-600 group-hover:scale-150 transition-all" />
                      {link.title}
                    </a>
                  ))}
                </nav>
              </motion.div>

              {/* Researcher Tools Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/20"
              >
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">RESEARCHER TOOLS</h4>
                
                <div className="space-y-4">
                  <a 
                    href={item.pdfUrl ? (item.pdfUrl.includes('cloudinary.com') && !item.pdfUrl.includes('/raw/upload/') ? item.pdfUrl.replace('/image/upload/', '/raw/upload/') : item.pdfUrl) : "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full p-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 group active:scale-95"
                  >
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Access Document</span>
                  </a>
                  
                  <button className="flex items-center justify-between w-full p-6 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all group active:scale-95">
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] ml-2">SHARE RESEARCH</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </motion.div>

              <div className="px-6 text-center">
                <Link href="/research" className="inline-flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.3em] group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Repository Archive
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400;1,900&display=swap');
        
        .rich-text-content {
          font-family: 'Playfair Display', serif;
        }
        .rich-text-content p { margin-bottom: 2rem; }
        .rich-text-content ul { list-style-type: none; margin-left: 0; margin-bottom: 2rem; }
        .rich-text-content ul li { position: relative; padding-left: 2.5rem; margin-bottom: 1.5rem; }
        .rich-text-content ul li::before { 
          content: ''; 
          position: absolute; 
          left: 0; 
          top: 0.7em; 
          width: 1.2rem; 
          height: 3px; 
          background: #2563eb; 
          border-radius: 99px;
        }
        .rich-text-content ol { list-style-type: decimal; margin-left: 2.5rem; margin-bottom: 2rem; }
        .rich-text-content a { color: #2563eb; font-weight: 900; text-decoration: underline; text-underline-offset: 4px; }
      `}</style>
    </div>
  );
}
