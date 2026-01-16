"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  BookOpen,
  Loader2,
  Quote,
  Layout,
  Tag
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
            setError("Research focus not found.");
          }
        }
      } catch (err) {
        setError("An error occurred while loading the research gallery.");
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase italic">{error || "Research Not Found"}</h2>
        <Link href="/research" className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500/30">
      {/* Header Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Link 
              href="/research"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] tracking-widest uppercase mb-12 transition-all group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Back to Publications
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase border border-blue-100">
                {item.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Volume {item.year}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-10 leading-tight tracking-tight">
              {item.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-12">
              {item.tags?.split(',').map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  #{tag.trim()}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-8 py-8 border-y border-slate-100">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authors</p>
                <div className="flex flex-wrap gap-6">
                  {item.authors?.map((author: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200 shadow-sm">
                        {author.image ? (
                          <Image src={author.image} alt={author.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{author.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Image */}
      {item.titleImage && (
        <section className="container mx-auto px-6 max-w-7xl -mt-12">
          <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
            <Image src={item.titleImage} alt={item.title} fill className="object-cover" priority />
          </div>
        </section>
      )}

      {/* Main Content Sections */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-24">
            {item.contentSections?.map((section: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{section.title}</h2>
                  <div 
                    className="prose prose-lg prose-slate max-w-none font-medium text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>

                {section.image && (
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                    <Image src={section.image} alt={section.title} fill className="object-cover" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Related Publications Footer */}
          {item.relatedPublications?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-40 p-16 rounded-[4rem] bg-slate-900 text-white relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-10 tracking-tight uppercase italic">Associated Research</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {item.relatedPublications.map((pub: any, pIdx: number) => (
                    <Link 
                      key={pIdx}
                      href={`/publications/${pub.id || '#'}`}
                      className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Tag className="text-blue-500" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Publication</span>
                      </div>
                      <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors leading-tight">
                        {pub.title || "Reference Research Paper"}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}