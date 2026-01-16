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
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

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
            setError("The research paper you are looking for does not exist.");
          }
        }
      } catch (err) {
        setError("Unable to connect to the research database.");
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Retrieving Document</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || "Document Not Found"}</h2>
        <Link href="/research" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm transition-all hover:bg-blue-700 shadow-lg shadow-blue-100">
          <ArrowLeft size={16} />
          Back to Research
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-50 selection:text-blue-900">
      {/* Article Header */}
      <section className="relative pt-32 pb-16 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              href="/research"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs mb-8 transition-colors group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Research Archive
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                {item.category}
              </span>
              <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={12} className="mr-1.5" />
                Published {item.year}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.15] tracking-tight">
              {item.title}
            </h1>

            {/* Featured Image - Always rendered below title if exists */}
            {item.titleImage && (
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50 mb-10">
                <Image 
                  src={item.titleImage} 
                  alt={item.title} 
                  fill 
                  className="object-cover" 
                  priority 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-100">
              <div className="flex flex-wrap gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lead Investigators</p>
                  <div className="flex flex-wrap gap-4">
                    {item.authors?.map((author: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-slate-50 overflow-hidden relative border border-slate-200">
                          {author.image ? (
                            <Image src={author.image} alt={author.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                              <User size={16} />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{author.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Share2 size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Share</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-16">
            {item.contentSections?.map((section: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 tracking-tight flex items-center gap-3">
                  <span className="w-6 h-[2px] bg-blue-600" />
                  {section.title}
                </h2>
                
                <div 
                  className="prose prose-slate max-w-none 
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-ul:text-slate-600 prose-li:marker:text-blue-500"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />

                {section.image && (
                  <div className="mt-10 relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-slate-100 group-hover:shadow-xl transition-shadow duration-500">
                    <Image src={section.image} alt={section.title} fill className="object-cover" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Keywords / Tags */}
          <div className="mt-16 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Tag size={14} className="text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Research Focus Areas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tags?.split(',').map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Related Content */}
          {item.relatedPublications?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-24"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-2">
                Related Resources
                <ChevronRight size={18} className="text-blue-600" />
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {item.relatedPublications.map((pub: any, pIdx: number) => (
                  <Link 
                    key={pIdx}
                    href={`/publications/${pub.id || '#'}`}
                    className="p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all group flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.2em] block mb-2">Reference Material</span>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {pub.title || "Academic Publication Reference"}
                      </h4>
                    </div>
                    <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Navigation Footer */}
      <footer className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-4xl flex justify-between items-center">
          <Link 
            href="/research"
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Browse all research
          </Link>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            SINGHLAB Environment © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
