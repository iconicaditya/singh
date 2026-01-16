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
  ExternalLink
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
            setError("The research publication was not found in our database.");
          }
        }
      } catch (err) {
        setError("Unable to establish connection to the scientific database.");
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Fetching Publication</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <BookOpen size={48} className="text-slate-200 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || "Document Not Found"}</h2>
        <Link href="/research" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/10">
          <ArrowLeft size={16} />
          Return to Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
          <Link 
            href="/research"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
              SinghLab Research
            </span>
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <article className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Metadata */}
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                {item.category}
              </span>
              <div className="flex items-center text-slate-400 text-xs font-bold">
                <Calendar size={14} className="mr-1.5" />
                {item.year}
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-[1.2] tracking-tight"
            >
              {item.title}
            </motion.h1>

            {item.titleImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl shadow-slate-200/50 mb-12"
              >
                <Image 
                  src={item.titleImage} 
                  alt={item.title} 
                  fill 
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}

            {/* Author Profiles */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Investigative Team</h3>
              <div className="flex flex-wrap gap-8">
                {item.authors?.map((author: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 relative overflow-hidden flex-shrink-0">
                      {author.image ? (
                        <Image src={author.image} alt={author.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-600">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{author.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Research Associate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* Main Content Sections */}
          <div className="space-y-16">
            {item.contentSections?.map((section: any, idx: number) => (
              <section key={idx} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-blue-600" />
                  {section.title}
                </h2>
                <div 
                  className="prose prose-slate max-w-none 
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                    prose-headings:text-slate-900 prose-strong:text-slate-900
                    prose-img:rounded-2xl prose-img:border prose-img:border-slate-100"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
                {section.image && (
                  <div className="mt-8 relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-100 shadow-lg">
                    <Image src={section.image} alt={section.title} fill className="object-cover" />
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Footer Meta */}
          <div className="mt-20 pt-10 border-t border-slate-100">
            <div className="flex flex-wrap gap-2 mb-12">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                <Tag size={12} /> Keywords
              </span>
              {item.tags?.split(',').map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  {tag.trim()}
                </span>
              ))}
            </div>

            {/* Related Publications */}
            {item.relatedPublications?.length > 0 && (
              <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  Linked Resources
                  <ChevronRight size={24} className="text-blue-200" />
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {item.relatedPublications.map((pub: any, pIdx: number) => (
                    <Link 
                      key={pIdx}
                      href={`/publications/${pub.id || '#'}`}
                      className="group flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <span className="font-bold text-sm md:text-base pr-4">
                          {pub.title || "Scholarly Publication"}
                        </span>
                      </div>
                      <ExternalLink size={18} className="text-blue-200 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Final Call to Action */}
      <footer className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">End of Document</p>
          <Link 
            href="/research"
            className="inline-flex items-center gap-2 text-slate-900 hover:text-blue-600 font-bold transition-colors"
          >
            <ArrowLeft size={18} />
            Explore more Research
          </Link>
        </div>
      </footer>
    </div>
  );
}
