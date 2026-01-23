"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown, ArrowRight, Rocket, Tag, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translateProjectCategory } from "@/lib/dbTranslations";
import { getTranslatedProjectList } from "@/lib/dynamicTranslations";

export default function Projects() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Apply dynamic translations
          const translated = getTranslatedProjectList(data, language as 'en' | 'ja');
          setProjects(translated.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [language]);

  return (
    <section className="py-24 bg-gray-50/50" id="projects">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#1e293b] mb-6"
          >
            {t("OUR_PROJECTS")} <span className="text-blue-600">{t("PROJECTS_TITLE")}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            {t("PROJECTS_DESCRIPTION")}
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : (
            projects.map((proj, index) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  {proj.imageUrl ? (
                    <Image 
                      src={proj.imageUrl} 
                      alt={proj.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                      <Rocket size={48} className="text-slate-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white shadow-sm uppercase">
                      {translateProjectCategory(proj.category, language as 'en' | 'ja')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {proj.description}
                  </p>
                  
                  {proj.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tags.split(',').map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-100">
                          <Tag size={10} /> {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-gray-50">
                    <Link 
                      href={`/projects/${proj.id}`} 
                      className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest uppercase hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-black/5"
                    >
                      <ExternalLink size={16} />
                      {t("EXPLORE_PROJECT")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* View All Button */}
        {!loading && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-10 py-4 rounded-full font-black hover:bg-[#1d4ed8] transition-all shadow-xl shadow-blue-500/25 group"
            >
              {t("VIEW_ALL_PROJECTS")} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
