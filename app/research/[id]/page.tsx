"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  BookOpen,
  List,
  ArrowRight,
  Loader2
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
          // Find the paper by ID
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
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-white mb-4">{error || "Paper Not Found"}</h2>
        <Link href="/research" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
          <ArrowLeft size={20} /> RETURN TO RESEARCH
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      {/* Header Image */}
      <section className="relative h-[60vh] w-full overflow-hidden">
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
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <BookOpen size={64} className="text-slate-800 opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-[#020617]/60 to-[#020617]" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link 
              href="/research"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold mb-8 transition-colors group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              BACK TO RESEARCH
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-lg shadow-blue-600/20">
                {paper.category}
              </span>
              {paper.tags && paper.tags.split(',').map((tag: string) => (
                <span key={tag} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-gray-300 border border-white/5">
                  #{tag.trim().toUpperCase()}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tighter max-w-5xl">
              {paper.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Calendar size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Published Year</span>
                  <span className="text-gray-200 font-bold">{paper.year}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <User size={18} className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Lead Author(s)</span>
                  <span className="text-gray-200 font-bold tracking-tight">
                    {Array.isArray(paper.authors) ? paper.authors.join(", ") : paper.authors}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-[#020617]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="prose prose-invert max-w-none">
                <div id="content" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 shadow-xl shadow-blue-600/5">
                      <List className="text-blue-500" size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Research Details</h2>
                  </div>
                  
                  <div className="space-y-24">
                    {paper.contentSections && paper.contentSections.length > 0 ? (
                      paper.contentSections.map((section: any, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative group"
                        >
                          {section.title && (
                            <h3 className="text-2xl font-black mb-6 text-white tracking-tight flex items-center gap-3">
                              <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
                              {section.title}
                            </h3>
                          )}
                          <div 
                            className="text-slate-400 text-lg leading-relaxed mb-10 font-medium" 
                            dangerouslySetInnerHTML={{ __html: section.content }} 
                          />
                          {section.image && (
                            <div className="relative h-[30rem] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                              <Image 
                                src={section.image} 
                                alt={section.title || "Research image"} 
                                fill 
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-slate-500 italic text-lg">No detailed content sections available for this paper.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-10">
                {/* Resources Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-blue-600 rounded-[3rem] p-10 shadow-2xl shadow-blue-600/40 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-8 text-white tracking-tight leading-none">Access<br/>Resources</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-white text-blue-600 font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-xl shadow-black/10 text-sm tracking-widest uppercase">
                        <Download size={22} strokeWidth={2.5} />
                        Download PDF
                      </button>
                      <button className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-[0.98] text-sm tracking-widest uppercase">
                        <Share2 size={22} strokeWidth={2.5} />
                        Share Paper
                      </button>
                    </div>
                  </div>
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                </motion.div>

                {/* Info Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-8 text-white tracking-tight">Publication Metadata</h3>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 py-5 border-b border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Hash</span>
                      <span className="text-blue-400 font-black text-lg tracking-tighter font-mono">#{paper.id.toString().padStart(6, '0')}</span>
                    </div>
                    <div className="flex flex-col gap-1 py-5 border-b border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scientific Domain</span>
                      <span className="text-white font-bold text-lg">{paper.category}</span>
                    </div>
                    <div className="flex flex-col gap-1 py-5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Status</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-2 text-lg">
                        <CheckCircle2 size={18} /> Peer Reviewed
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Back to feed */}
                <Link 
                  href="/research"
                  className="flex items-center justify-center gap-3 w-full py-6 rounded-[2rem] border-2 border-slate-800 text-slate-400 font-black hover:bg-white hover:text-black hover:border-white transition-all group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  EXPLORE MORE RESEARCH
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
