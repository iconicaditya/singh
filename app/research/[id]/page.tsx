"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Download, 
  ExternalLink, 
  List,
  Loader2,
  FileText,
  Clock,
  Tag,
  ChevronRight,
  Bookmark
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function ResearchDetail() {
  const params = useParams();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start start", "end end"],
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Only fetch if params.id is available
    if (!params?.id) return;
    
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research');
        if (response.ok) {
          const data = await response.json();
          const found = data.find((p: any) => p.id.toString() === params.id);
          if (found) {
            setPaper(found);
          } else {
            setError("Research paper not found.");
          }
        } else {
          setError("Failed to fetch research data.");
        }
      } catch (err) {
        setError("An error occurred while loading research.");
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">{error || "Paper Not Found"}</h2>
          <Link href="/research" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 group shadow-2xl shadow-blue-500/10">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            BACK TO RESEARCH
          </Link>
        </motion.div>
      </div>
    );
  }

  const sections = paper.contentSections
    ?.filter((s: any) => s.title || s.content)
    .map((s: any, idx: number) => ({
      id: s.id || `section-${idx}`,
      label: s.title || "Section",
    })) || [];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans antialiased overflow-x-hidden">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-blue-600 z-50 origin-left shadow-[0_0_15px_rgba(37,99,235,0.5)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex items-center pt-24 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          {paper.titleImage ? (
            <div className="relative h-full w-full">
              <Image
                src={paper.titleImage}
                alt={paper.title}
                fill
                className="object-cover opacity-40 scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/80 to-[#020617]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/60 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b_0%,#020617_100%)]" />
          )}
          {/* Animated Glows */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <Link 
              href="/research"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold mb-10 transition-all group px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 backdrop-blur-sm"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              RESEARCH ARCHIVE
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-blue-600/90 backdrop-blur-md px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase text-white shadow-xl shadow-blue-600/20 border border-blue-400/20">
                {paper.category}
              </span>
              {paper.tags && paper.tags.split(',').map((tag: string) => (
                <span key={tag} className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-gray-300 border border-white/10 flex items-center gap-2">
                  <Tag size={12} className="text-blue-400" />
                  {tag.trim().toUpperCase()}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-[0.95] tracking-tighter text-white drop-shadow-2xl">
              {paper.title}
            </h1>

            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors shadow-lg shadow-black/20">
                  <Calendar size={20} className="text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-0.5">Release Year</span>
                  <span className="text-white text-lg font-black tracking-tight">{paper.year}</span>
                </div>
              </div>
              
              <div className="flex -space-x-4 overflow-hidden py-1">
                {paper.authors && paper.authors.map((author: any, idx: number) => (
                  <div key={idx} className="relative group">
                    {author.image ? (
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#020617] ring-1 ring-white/10 shadow-xl transform transition-transform group-hover:-translate-y-2 group-hover:z-10">
                        <Image src={author.image} alt={author.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-[#020617] ring-1 ring-white/10 transform transition-transform group-hover:-translate-y-2 group-hover:z-10">
                        <User size={24} className="text-slate-400" />
                      </div>
                    )}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-black py-1.5 px-3 rounded-lg whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-2xl">
                      {author.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-10 -mt-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            
            {/* Sidebar Navigation - Sticky */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32 space-y-10">
                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl">
                  <h4 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                    <List size={14} className="text-blue-500" />
                    Outline
                  </h4>
                  <nav className="space-y-1">
                    {sections.map((section: any) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                      >
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500" />
                        <span className="text-sm font-bold tracking-tight line-clamp-1">{section.label}</span>
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-blue-600 shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black text-white leading-none mb-6">Need the full document?</h4>
                    <button className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl text-xs uppercase tracking-widest">
                      <Download size={18} strokeWidth={3} />
                      Download PDF
                    </button>
                  </div>
                  <Bookmark className="absolute -bottom-6 -right-6 w-24 h-24 text-white/10 -rotate-12" />
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <article className="lg:col-span-9 space-y-24 pb-32">
              <div className="prose prose-invert max-w-none">
                {paper.contentSections && paper.contentSections.length > 0 ? (
                  paper.contentSections.map((section: any, idx: number) => (
                    <motion.section 
                      key={idx}
                      id={section.id || `section-${idx}`}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8 }}
                      className="scroll-mt-32"
                    >
                      {section.image && (
                        <div className="relative h-[450px] w-full rounded-[3rem] overflow-hidden mb-16 group ring-1 ring-white/10 shadow-2xl">
                          <Image 
                            src={section.image} 
                            alt={section.title || "Research visual"} 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {section.title && (
                            <div className="absolute bottom-10 left-10 right-10">
                              <span className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border border-white/20">
                                Figure {idx + 1}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="max-w-4xl">
                        {section.title && (
                          <div className="flex items-baseline gap-6 mb-10">
                            <span className="text-5xl font-black text-blue-500/20 tabular-nums">0{idx + 1}</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                              {section.title}
                            </h2>
                          </div>
                        )}
                        
                        {section.content && (
                          <div 
                            className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium editor-content space-y-6" 
                            dangerouslySetInnerHTML={{ __html: section.content }} 
                          />
                        )}
                      </div>
                      
                      {idx < paper.contentSections.length - 1 && (
                        <div className="mt-24 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      )}
                    </motion.section>
                  ))
                ) : (
                  <div className="py-32 text-center rounded-[4rem] bg-white/5 border border-dashed border-white/10 flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                      <Clock className="text-slate-600" size={40} />
                    </div>
                    <p className="text-slate-400 text-xl font-bold italic">Detailed research analysis is currently in review.</p>
                  </div>
                )}

                {/* Related Work */}
                {paper.relatedPublications && paper.relatedPublications.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 pt-24 border-t border-white/10"
                  >
                    <div className="flex items-center justify-between mb-16">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <FileText className="text-indigo-400" size={28} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">References</h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {paper.relatedPublications.map((pub: any, idx: number) => (
                        <div key={idx} className="group p-8 md:p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all flex flex-col md:flex-row gap-10 items-center">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase px-3 py-1 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                {pub.category || "Research Paper"}
                              </span>
                              <span className="text-slate-600 font-bold text-xs">{pub.year}</span>
                            </div>
                            <h3 className="text-2xl font-black text-white leading-tight group-hover:text-blue-400 transition-colors">
                              {pub.title}
                            </h3>
                            <p className="text-slate-400 font-bold italic">{pub.authors}</p>
                            <div className="flex items-center gap-3 text-slate-500 text-xs font-black uppercase tracking-widest">
                              <BookOpen size={14} />
                              {pub.journal || "SinghLab Publications"}
                            </div>
                          </div>
                          <a 
                            href={pub.link || (pub.doi ? `https://doi.org/${pub.doi}` : '#')} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full md:w-auto flex-shrink-0 px-8 py-5 bg-white text-black rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/40 text-xs tracking-widest uppercase"
                          >
                            <ExternalLink size={18} strokeWidth={3} />
                            Source
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </div>
            </article>

          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="py-32 border-t border-white/5 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <div className="flex flex-col items-center gap-12">
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none italic">Interested in<br/>this research?</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 uppercase tracking-widest text-sm">
                <Share2 size={20} strokeWidth={2.5} />
                Share Analysis
              </button>
              <Link 
                href="/research"
                className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
                More Papers
              </Link>
            </div>
          </div>
        </div>
        {/* Abstract Background Detail */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      </footer>
    </div>
  );
}
