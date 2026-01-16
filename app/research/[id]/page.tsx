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
      <section className="relative pt-40 pb-24 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-20 items-center"
          >
            {/* Title Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-1/2 shrink-0"
            >
              <div className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                {item.titleImage ? (
                  <Image src={item.titleImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
                    <BookOpen size={80} className="text-white/20" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Title Info */}
            <div className="flex-1">
              <Link 
                href="/research"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-black text-[10px] tracking-widest uppercase mb-10 transition-all group"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Back to Gallery
              </Link>

              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-6 py-2 bg-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-xl shadow-blue-600/20">
                  {item.category}
                </span>
                <span className="px-6 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Active in {item.year}
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-10 leading-none tracking-tighter uppercase italic">
                {item.title}
              </h1>

              <div className="flex flex-wrap gap-8">
                 <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Principal Investigators</p>
                   <div className="flex -space-x-3">
                     {item.authors?.map((author: any, idx: number) => (
                       <div key={idx} className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 overflow-hidden relative shadow-lg" title={author.name}>
                         {author.image ? (
                           <Image src={author.image} alt={author.name} fill className="object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600">
                             <User size={20} />
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-32">
            {item.contentSections?.map((section: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col gap-12 ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
              >
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                      <Layout className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">{section.title}</h2>
                  </div>
                  <div className="text-slate-600 text-xl leading-relaxed font-medium space-y-6">
                    {section.content?.split('\n').map((para: string, pIdx: number) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                </div>

                {section.image && (
                  <div className="lg:w-1/3 shrink-0">
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                      <Image src={section.image} alt={section.title} fill className="object-cover" />
                    </div>
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