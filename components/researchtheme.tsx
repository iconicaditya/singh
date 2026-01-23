"use client";

import { motion } from "framer-motion";
import { Droplets, Recycle, ThermometerSun, Zap, Users, Globe2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ResearchThemes() {
  const { t } = useLanguage();
  const themes = [
    {
      titleKey: "PLASTICS",
      icon: <Droplets className="w-10 h-10 text-blue-400" />,
      pointKeys: ["MARINE_LITTER_EDUCATION", "MICROPLASTICS_MONITORING", "PLASTIC_CLIMATE_NEXUS"],
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      titleKey: "WASTE_MANAGEMENT",
      icon: <Recycle className="w-10 h-10 text-green-400" />,
      pointKeys: ["CAMPUS_COMPOST", "OPEN_BURNING_MITIGATION", "MUNICIPAL_SOLID_WASTE"],
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      titleKey: "CLIMATE_CHANGE",
      icon: <ThermometerSun className="w-10 h-10 text-orange-400" />,
      pointKeys: ["HEAT_RISK_PERCEPTION", "MITIGATION_CO_BENEFITS", "COMMUNITY_RESILIENCE"],
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      titleKey: "RENEWABLE_ENERGY_TECH",
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
      pointKeys: ["SOLAR_ADOPTION", "ENERGY_EFFICIENCY", "COMMUNITY_ENERGY"],
      gradient: "from-yellow-500/20 to-amber-500/20"
    },
    {
      titleKey: "SOCIAL_URBAN_SYSTEMS",
      icon: <Users className="w-10 h-10 text-purple-400" />,
      pointKeys: ["SUSTAINABLE_URBAN_PLANNING", "ENVIRONMENTAL_JUSTICE", "PUBLIC_HEALTH"],
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      titleKey: "OTHERS_THEMES",
      icon: <Globe2 className="w-10 h-10 text-pink-400" />,
      pointKeys: ["FAIR_TRADE_IMPACTS", "BIODIVERSITY_PLASTICS", "POLICY_DESIGN"],
      gradient: "from-pink-500/20 to-rose-500/20"
    }
  ];

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
          {themes.map((theme, index) => (
            <motion.div
              key={theme.titleKey}
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
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-slate-800/80 group-hover:scale-110 transition-transform duration-300 group-hover:bg-slate-800">
                    {theme.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-6 text-center group-hover:text-blue-400 transition-colors">
                  {t(theme.titleKey)}
                </h3>
                
                <ul className="space-y-4 max-w-xs mx-auto flex flex-col items-center">
                  {theme.pointKeys.map((pointKey, pIndex) => (
                    <motion.li 
                      key={pIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index * 0.1) + (pIndex * 0.1) }}
                      className="flex items-center gap-3 text-gray-400 text-sm group-hover:text-gray-300 text-center"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {t(pointKey)}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
