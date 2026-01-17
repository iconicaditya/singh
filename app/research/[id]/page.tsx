"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  User, 
  FileText,
  ChevronRight,
  Info,
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
      <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase">Research Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md font-medium">The scholarly work you are looking for might have been moved or archived.</p>
      <Link href="/research" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center gap-3">
        <ArrowLeft size={16} /> Back to Repository
      </Link>
    </div>
  );

  return (
    <div id="research-content" className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50 no-print">
        <Link 
          href="/research" 
          className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 1. Hero Header */}
      <section className="relative w-full h-[60vh] flex items-end overflow-hidden print-section">
        {item.titleImage ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={item.titleImage} 
              alt={item.title} 
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
        )}
        
        <div className="container mx-auto px-6 max-w-7xl relative pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm">
                RESEARCH
              </span>
              <div className="flex items-center gap-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded-sm text-white text-[9px] font-bold uppercase tracking-widest">
                <Calendar size={12} className="text-white" />
                {item.year || "2026"}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight uppercase leading-[1.1] font-[family-name:var(--font-playfair)]">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              {item.authors?.map((author: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden shadow-lg">
                    {author.image ? (
                      <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white/50"><User size={20} /></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">BY {author.name.toUpperCase()}</span>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Researcher</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {item.tags?.split(',').map((tag: string) => (
                <span key={tag} className="text-[9px] font-bold text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Content */}
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="flex flex-col lg:row-layout gap-12">
          
          {/* Main Column */}
          <main className="w-full lg:w-[65%] print-full-width space-y-16 overflow-hidden">
            {item.contentSections?.map((section: any, idx: number) => (
              <section key={idx} id={`section-${idx}`} className="scroll-mt-32 print-section px-4">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-bold text-slate-900 lowercase tracking-tight">{section.title}</h2>
                </div>

                {section.image && (
                  <div className="mb-8 rounded-2xl overflow-hidden shadow-xl border border-slate-200 w-full">
                    <img src={section.image} alt={section.title} className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                )}

                <div 
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed break-words overflow-hidden prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl w-full"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}

            {/* Related Publications */}
            {item.relatedPublications?.length > 0 && (
              <div className="pt-16 border-t border-slate-100 print-section px-4">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Related Publications</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {item.relatedPublications.map((pub: any, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest rounded border border-blue-100">RESEARCH</span>
                        <div className="text-slate-200"><FileText size={16} /></div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 uppercase leading-tight">{pub.title}</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-4">{pub.subtitle}</p>
                      
                      <div className="flex items-center gap-2 mb-6 pt-4 border-t border-slate-50 mt-auto">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><User size={12} /></div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{pub.authors}</span>
                      </div>

                      <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors no-print">
                        VIEW PDF <FileText size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar - Hidden on Print */}
          <aside className="lg:w-[35%] no-print">
            <div className="sticky top-24 space-y-8">
              {/* TOC */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <List size={16} className="text-blue-600" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">table of contents</h4>
                </div>
                <nav className="space-y-4">
                  {toc.map((link: any, i: number) => (
                    <a key={i} href={`#${link.id}`} className="block text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors pl-2 border-l-2 border-transparent hover:border-blue-600">
                      • {link.title}
                    </a>
                  ))}
                </nav>
              </motion.div>

              {/* Tools */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-100 space-y-4"
              >
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">RESEARCHER TOOLS</h4>
                  <button 
                  onClick={async () => {
                    const { default: html2canvas } = await import('html2canvas');
                    const { default: jsPDF } = await import('jspdf');
                    
                    const element = document.getElementById('research-content');
                    if (!element) return;

                    // Apply print-friendly styles
                    const style = document.createElement('style');
                    style.innerHTML = `
                      .no-print { display: none !important; }
                      .print-full-width { width: 100% !important; max-width: 100% !important; }
                      .print-section { page-break-inside: avoid; margin-bottom: 2rem !important; }
                      .lg\\:row-layout { flex-direction: column !important; }
                    `;
                    document.head.appendChild(style);
                    
                    try {
                      const canvas = await html2canvas(element, {
                        scale: 1.5,
                        useCORS: true,
                        logging: false,
                        windowWidth: 1024,
                        onclone: (clonedDoc) => {
                          const sidebar = clonedDoc.querySelector('aside');
                          const backBtn = clonedDoc.querySelector('.no-print');
                          if (sidebar) sidebar.style.display = 'none';
                          if (backBtn) (backBtn as HTMLElement).style.display = 'none';
                          
                          const main = clonedDoc.querySelector('main');
                          if (main) {
                            main.style.width = '100%';
                            main.style.maxWidth = '100%';
                            main.style.padding = '0 40px';
                          }
                          
                          const sections = clonedDoc.querySelectorAll('.print-section');
                          sections.forEach((s: any) => {
                            s.style.width = '100%';
                            s.style.padding = '0 40px';
                            s.style.marginBottom = '40px';
                          });
                        }
                      });
                      
                      const imgData = canvas.toDataURL('image/jpeg', 0.85);
                      const pdf = new jsPDF('p', 'mm', 'a4');
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = pdf.internal.pageSize.getHeight();
                      
                      const imgWidth = canvas.width;
                      const imgHeight = canvas.height;
                      const ratio = imgWidth / pdfWidth;
                      
                      const totalPDFPages = Math.ceil(imgHeight / (pdfHeight * ratio));
                      
                      for (let i = 0; i < totalPDFPages; i++) {
                        if (i > 0) pdf.addPage();
                        
                        pdf.addImage(
                          imgData, 
                          'JPEG', 
                          0, 
                          -(i * pdfHeight), 
                          pdfWidth, 
                          imgHeight / ratio,
                          undefined,
                          'FAST'
                        );
                      }
                      
                      pdf.save(`${item.title.replace(/\s+/g, '_')}_Research.pdf`);
                    } finally {
                      document.head.removeChild(style);
                    }
                  }}
                  className="flex items-center justify-center w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Download
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: item.title,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard');
                    }
                  }}
                  className="flex items-center justify-between w-full px-6 py-4 bg-white border border-slate-300 text-slate-900 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:border-blue-600 hover:text-blue-600 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    SHARE RESEARCH
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                </button>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
