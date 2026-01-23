"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Workflow } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  
  const cards = [
    {
      titleKey: "OUR_VISION",
      icon: <Target className="w-8 h-8 text-[#3b82f6]" />,
      descriptionKey: "VISION_DESC"
    },
    {
      titleKey: "OUR_MISSION",
      icon: <Lightbulb className="w-8 h-8 text-[#3b82f6]" />,
      descriptionKey: "MISSION_DESC"
    },
    {
      titleKey: "OUR_APPROACH",
      icon: <Workflow className="w-8 h-8 text-[#3b82f6]" />,
      descriptionKey: "APPROACH_DESC"
    }
  ];

  return (
    <section id="about" className="relative py-24 bg-[#020617] text-white overflow-hidden scroll-mt-20">
      {/* Abstract Background Animation Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
          >
            {t("ABOUT_LAB")}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            className="h-1 bg-blue-500 mx-auto mb-8 rounded-full"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed"
          >
            {t("ABOUT_LAB_DESCRIPTION")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                y: -15,
                rotateX: 5,
                rotateY: 5,
                scale: 1.05,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group hover:border-blue-500/50 hover:shadow-[0_25px_60px_rgba(37,99,235,0.3)] perspective-1000"
            >
              <div className="mb-6 p-3 bg-blue-500/10 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                {t(card.titleKey)}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {t(card.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
