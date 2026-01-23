"use client";

import { motion } from "framer-motion";
import { Microscope, Globe, Leaf, BarChart3, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const researchFocusData = [
  {
    icon: <Microscope className="w-6 h-6 text-blue-600" />,
    titleKey: "APPLIED_ENVIRONMENTAL_SCIENCE",
    descriptionKey: "APPLIED_ENVIRONMENTAL_DESC",
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-600" />,
    titleKey: "GLOBAL_SUSTAINABILITY_POLICY",
    descriptionKey: "GLOBAL_SUSTAINABILITY_DESC",
  },
  {
    icon: <Leaf className="w-6 h-6 text-blue-600" />,
    titleKey: "CIRCULAR_ECONOMY_MODELS",
    descriptionKey: "CIRCULAR_ECONOMY_DESC",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    titleKey: "IMPACT_ASSESSMENT",
    descriptionKey: "IMPACT_ASSESSMENT_DESC",
  },
];

export default function ResearchFocus() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("RESEARCH_FOCUS")}</h2>
            <div className="w-16 h-1 bg-blue-600 mb-8" />
            
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              {t("RESEARCH_FOCUS_DESCRIPTION")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {researchFocusData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-lg"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{t(item.titleKey)}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{t(item.descriptionKey)}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/research"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl group"
              >
                {t("EXPLORE_RESEARCH")}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl h-[400px] md:h-[600px] lg:h-[700px] w-full">
              <Image 
                src="/researchfocus.png" 
                alt="Research Focus Visualization" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Animated background element */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute -top-10 -right-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute -bottom-10 -left-10 w-80 h-80 bg-slate-100 rounded-full blur-3xl -z-0"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
