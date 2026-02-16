"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Recycle, ThermometerSun, Zap, Users, Globe2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const gradients = [
  "from-blue-500/20 to-cyan-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-orange-500/20 to-red-500/20",
  "from-yellow-500/20 to-amber-500/20",
  "from-purple-500/20 to-indigo-500/20",
  "from-pink-500/20 to-rose-500/20"
];

const defaultIcons = [
  <Droplets className="w-10 h-10 text-blue-400" />,
  <Recycle className="w-10 h-10 text-green-400" />,
  <ThermometerSun className="w-10 h-10 text-orange-400" />,
  <Zap className="w-10 h-10 text-yellow-400" />,
  <Users className="w-10 h-10 text-purple-400" />,
  <Globe2 className="w-10 h-10 text-pink-400" />
];

export default function ResearchThemes() {
  const { t } = useLanguage();
  const [themes, setThemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch("/api/research-themes", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setThemes(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch research themes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            {t("RESEARCH")} <span className="text-blue-500">{t("THEMES")}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            {t("RESEARCH_THEMES_DESCRIPTION")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
            </div>
          ) : themes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No research themes available yet.
            </div>
          ) : (
            themes.map((theme, index) => (
              <motion.div
                key={theme.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)]"
              >
                {/* Inner Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-8">
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-600/30 to-indigo-600/30 p-[3px] group-hover:scale-110 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/40">
                      <div className="w-full h-full rounded-full bg-[#0a0f1e]/95 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                        {theme.iconImage ? (
                          <img 
                            src={theme.iconImage} 
                            alt={theme.title} 
                            className="w-20 h-20 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="scale-125 group-hover:scale-150 transition-transform duration-300">
                            {defaultIcons[index % defaultIcons.length]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-6 text-center group-hover:text-blue-400 transition-colors">
                    {theme.title}
                  </h3>
                  
                  <ul className="space-y-4 max-w-xs mx-auto flex flex-col items-center">
                    {Array.isArray(theme.points) && theme.points.map((point: string, pIndex: number) => (
                      <motion.li 
                        key={pIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (pIndex * 0.1) }}
                        className="flex items-start gap-3 text-gray-400 text-sm group-hover:text-gray-300 w-full"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span className="flex-1 text-left leading-relaxed">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
