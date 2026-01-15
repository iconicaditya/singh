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
  List,
  Loader2,
  FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ResearchDetail() {
  const params = useParams();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const handleDownload = () => {
    if (paper?.pdfUrl) {
      window.open(paper.pdfUrl, '_blank');
    } else {
      // Fallback: Generate a simple text file if no PDF is linked
      const content = `Title: ${paper.title}\nCategory: ${paper.category}\nYear: ${paper.year}\nAuthors: ${paper.authors?.map((a: any) => a.name).join(', ')}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.title.replace(/\s+/g, '_')}_summary.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: paper.title,
          text: `Check out this research: ${paper.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">{error || "Paper Not Found"}</h2>
        <Link href="/research" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
          <ArrowLeft size={20} /> RETURN TO RESEARCH
        </Link>
      </div>
    );
  }

  const sections = paper.contentSections
    ?.filter((s: any) => s.title || s.content)
    .map((s: any) => ({
      id: s.id || `section-${Math.random()}`,
      label: s.title || "Section",
    })) || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500/30">
      {/* Header Image */}
      <section className="relative h-[60vh] w-full overflow-hidden border-b border-slate-100">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {paper.titleImage ? (
            <Image
              src={paper.titleImage}
              alt={paper.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
              <BookOpen size={64} className="text-slate-200 opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link 
              href="/research"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-8 transition-colors group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              BACK TO RESEARCH
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-lg shadow-blue-600/20">
                {paper.category}
              </span>
              {paper.tags && paper.tags.split(',').map((tag: string) => (
                <span key={tag} className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200">
                  #{tag.trim().toUpperCase()}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tighter max-w-5xl text-slate-900">
              {paper.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Published Year</span>
                  <span className="text-slate-700 font-bold">{paper.year}</span>
                </div>
              </div>
              
              {paper.authors && paper.authors.map((author: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  {author.image ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                      <Image src={author.image} alt={author.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                      <User size={18} className="text-slate-400" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Author</span>
                    <span className="text-slate-700 font-bold tracking-tight">{author.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="max-w-none">
                <div className="space-y-32">
                  {paper.contentSections && paper.contentSections.length > 0 ? (
                    paper.contentSections.map((section: any, idx: number) => (
                      <motion.div 
                        key={idx}
                        id={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group scroll-mt-32"
                      >
                        {section.title && (
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                              <List className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{section.title}</h3>
                          </div>
                        )}
                        {section.image && (
                          <div className="relative h-[30rem] w-full rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl mb-12">
                            <Image 
                              src={section.image} 
                              alt={section.title || "Research image"} 
                              fill 
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                        )}
                        {section.content && (
                          <div 
                            className="text-slate-600 text-lg leading-relaxed font-medium editor-content prose prose-slate max-w-none break-words overflow-hidden" 
                            dangerouslySetInnerHTML={{ __html: section.content }} 
                          />
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 italic text-lg">Detailed research content will be available shortly.</p>
                    </div>
                  )}
                </div>

                {/* Related Publications Section */}
                {paper.relatedPublications && paper.relatedPublications.length > 0 && (
                  <div className="mt-40 pt-24 border-t border-slate-100">
                    <div className="flex items-center gap-4 mb-16">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <FileText className="text-blue-600" size={24} />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Related Publications</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                      {paper.relatedPublications.map((pub: any, idx: number) => (
                        <div key={idx} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group flex flex-col md:flex-row gap-8 items-start">
                          <div className="flex-1">
                            <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase mb-4 block tracking-[0.2em]">{pub.category || "RESEARCH PAPER"}</span>
                            <h3 className="text-2xl font-black mb-6 group-hover:text-blue-600 transition-colors leading-tight text-slate-900">{pub.title}</h3>
                            <p className="text-slate-500 mb-8 font-medium italic text-lg">{pub.authors}</p>
                            <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                              <span className="flex items-center gap-2"><Calendar size={14} /> {pub.year}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                              <span className="text-blue-600 uppercase tracking-widest text-[10px]">{pub.journal || "SinghLab"}</span>
                            </div>
                          </div>
                          <a 
                            href={pub.link || `https://doi.org/${pub.doi}`} 
                            target="_blank" 
                            className="w-full md:w-auto px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 text-sm tracking-widest"
                          >
                            <ExternalLink size={20} />
                            ACCESS DOCUMENT
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-12">
                {/* Table of Contents */}
                {sections.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl"
                  >
                    <h3 className="text-xl font-black mb-8 text-slate-900 tracking-tight border-b border-slate-100 pb-6">Quick Navigation</h3>
                    <nav className="space-y-6">
                      {sections.map((section: any) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="flex items-center gap-5 text-slate-500 hover:text-blue-600 transition-all group text-sm font-bold leading-tight"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-all flex-shrink-0">
                            <List size={16} className="group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="line-clamp-2">{section.label}</span>
                        </a>
                      ))}
                    </nav>
                  </motion.div>
                )}

                {/* Bottom Actions Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-blue-600 rounded-[3rem] p-12 shadow-2xl shadow-blue-600/40 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-10 text-white tracking-tight leading-none italic uppercase text-center">Resources</h3>
                    <div className="space-y-4">
                      <button 
                        onClick={handleDownload}
                        className="w-full bg-white text-blue-600 font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-xl shadow-black/10 text-xs tracking-widest uppercase"
                      >
                        <Download size={22} strokeWidth={2.5} />
                        Download Paper
                      </button>
                      <button 
                        onClick={handleShare}
                        className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-[0.98] text-xs tracking-widest uppercase"
                      >
                        <Share2 size={22} strokeWidth={2.5} />
                        Share Research
                      </button>
                    </div>
                  </div>
                  <div className="absolute -right-10 -top-10 w-56 h-56 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-[1.5s]" />
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}