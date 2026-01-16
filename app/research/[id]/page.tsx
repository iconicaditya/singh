"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  BookOpen,
  Loader2,
  Tag,
  ArrowRight,
  ChevronRight,
  Download,
  FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

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
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold mb-4">{error || "Not Found"}</h2>
      <Link href="/research" className="text-blue-600 font-bold hover:underline">Back to Archive</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 1. Hero Header - Full Width Title Image at the Very Top */}
      <section className="relative w-full h-[65vh] flex items-end overflow-hidden">
        {item.titleImage ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={item.titleImage} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        
        {/* Subtle Transparent Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Key Information Over Image */}
        <div className="container mx-auto px-6 max-w-7xl relative pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                {item.category}
              </span>
              <div className="flex items-center text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Calendar size={12} className="mr-2" />
                {item.year}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex -space-x-3">
                {item.authors?.map((author: any, i: number) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white/30 bg-slate-800 relative overflow-hidden shadow-lg" title={author.name}>
                    {author.image ? (
                      <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 bg-slate-700"><User size={18} /></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-white/70 text-xs font-bold uppercase tracking-[0.1em]">
                By {item.authors?.map((a: any) => a.name).join(", ")}
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags?.split(',').map((tag: string) => (
                  <span key={tag} className="text-[10px] font-bold text-white/60 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Content - Two Column Layout */}
      <div className="container mx-auto px-6 max-w-7xl py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Research Content */}
          <main className="lg:w-2/3 overflow-hidden">
            <div className="space-y-20">
              {item.contentSections?.map((section: any, idx: number) => (
                <section key={idx} id={`section-${idx}`} className="scroll-mt-32 overflow-hidden">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                    <span className="w-10 h-[3px] bg-blue-600 rounded-full" />
                    {section.title}
                  </h2>
                  <div 
                    className="prose prose-slate max-w-none break-words whitespace-pre-wrap
                      prose-p:text-slate-900 prose-p:leading-relaxed prose-p:text-lg
                      prose-strong:text-slate-900 prose-headings:text-slate-900
                      prose-li:text-slate-900 prose-li:text-lg"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                  {section.image && (
                    <div className="mt-12 relative aspect-[16/9] rounded-3xl overflow-hidden border border-slate-100 shadow-2xl">
                      <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Related Publications Footer */}
            {item.relatedPublications?.length > 0 && (
              <div className="mt-32 pt-20 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-10 uppercase tracking-[0.2em]">Related Resources</h3>
                <div className="grid grid-cols-1 gap-6">
                  {item.relatedPublications.map((pub: any, idx: number) => (
                    <Link key={idx} href={`/publications/${pub.id || '#'}`} className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Resource</p>
                          <span className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{pub.title || "Linked Publication"}</span>
                        </div>
                      </div>
                      <ArrowRight size={24} className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Side: Sticky TOC & Actions */}
          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-10">
              {/* Table of Contents */}
              <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <FileText size={16} className="text-blue-600" /> Navigation
                </h4>
                <nav className="space-y-5">
                  {toc.map((link: any, i: number) => (
                    <a 
                      key={i} 
                      href={`#${link.id}`} 
                      className="group flex items-center gap-3 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors" />
                      {link.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/20 space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Researcher Tools</h4>
                <button className="flex items-center justify-between w-full p-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 group">
                  <div className="flex items-center gap-4">
                    <Download size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">Download Full PDF</span>
                  </div>
                  <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-between w-full p-6 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all group">
                  <div className="flex items-center gap-4">
                    <Share2 size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">Share Research</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              <div className="text-center">
                <Link href="/research" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">
                  <ArrowLeft size={14} /> Back to Repository
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <Link 
            href="/research"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 hover:text-blue-600 hover:border-blue-600 transition-all font-bold shadow-sm"
          >
            <ArrowLeft size={20} />
            Explore More Research
          </Link>
        </div>
      </footer>
    </div>
  );
}
