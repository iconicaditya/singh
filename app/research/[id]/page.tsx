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
    <div className="min-h-screen bg-white">
      {/* 1. Hero Header - Full Width Title Image */}
      <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end overflow-hidden">
        {item.titleImage ? (
          <Image 
            src={item.titleImage} 
            alt={item.title} 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        
        {/* Transparency Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Hero Information Over Image */}
        <div className="container mx-auto px-6 max-w-7xl relative pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                {item.category}
              </span>
              <div className="flex items-center text-white/80 text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={12} className="mr-1.5" />
                {item.year}
              </div>
            </div>

            <h1 className="text-3xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex -space-x-3">
                {item.authors?.map((author: any, i: number) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 bg-slate-800 relative overflow-hidden group" title={author.name}>
                    {author.image ? (
                      <Image src={author.image} alt={author.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/60"><User size={16} /></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest">
                {item.authors?.length} Investigators
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags?.split(',').map((tag: string) => (
                  <span key={tag} className="text-[10px] font-bold text-white/50 bg-white/10 px-2 py-0.5 rounded border border-white/5">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Layout - Split Content & Sidebar */}
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Contents */}
          <main className="lg:w-2/3">
            <div className="space-y-16">
              {item.contentSections?.map((section: any, idx: number) => (
                <section key={idx} id={`section-${idx}`} className="scroll-mt-32">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                    <span className="w-8 h-[2px] bg-blue-600" />
                    {section.title}
                  </h2>
                  <div 
                    className="prose prose-slate max-w-none 
                      prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                      prose-strong:text-slate-900 prose-headings:text-slate-900
                      prose-li:text-slate-600"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                  {section.image && (
                    <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 shadow-xl">
                      <Image src={section.image} alt={section.title} fill className="object-cover" />
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Related Publications Footer */}
            {item.relatedPublications?.length > 0 && (
              <div className="mt-24 pt-16 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-8 uppercase tracking-widest">Related Resources</h3>
                <div className="grid grid-cols-1 gap-4">
                  {item.relatedPublications.map((pub: any, idx: number) => (
                    <Link key={idx} href={`/publications/${pub.id || '#'}`} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-white hover:border-blue-200 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                          <BookOpen size={20} />
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{pub.title || "Linked Publication"}</span>
                      </div>
                      <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Side: Sidebar TOC & Actions */}
          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              {/* Table of Contents */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <FileText size={14} /> On This Page
                </h4>
                <nav className="space-y-4">
                  {toc.map((link: any, i: number) => (
                    <a 
                      key={i} 
                      href={`#${link.id}`} 
                      className="block text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {link.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-between w-full p-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 group">
                  <div className="flex items-center gap-4">
                    <Download size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">Download PDF</span>
                  </div>
                  <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-between w-full p-6 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all group">
                  <div className="flex items-center gap-4">
                    <Share2 size={20} />
                    <span className="font-bold text-sm uppercase tracking-widest">Share Report</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              <Link href="/research" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                <ArrowLeft size={14} /> Back to Repository
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
