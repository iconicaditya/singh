"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Facebook, Twitter, Instagram, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  socialLinks: Record<string, string>;
}

export default function OurTeam() {
  const { t } = useLanguage();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setTeam(data);
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // Create a tripled list for seamless infinite scroll
  const scrollItems = useMemo(() => [...team, ...team, ...team], [team]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-[#fdf8f4] overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          >
            {t("MEET_OUR_RESEARCH_TEAM")}
          </motion.h2>
          <div className="w-20 h-0.5 bg-blue-600 mx-auto mb-8" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed"
          >
            {t("OUR_TEAM_DESCRIPTION")}
          </motion.p>
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative w-full">
        <motion.div
          animate={{
            x: [0, -1035], // Approximate width of one set of team members
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30, // Slow, professional speed
              ease: "linear",
            },
          }}
          className="flex gap-8 px-4"
          style={{ width: "fit-content" }}
        >
          {scrollItems.map((member, index) => (
            <div
              key={`${member.id}-${index}`}
              className="w-80 flex-shrink-0 bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-lg bg-slate-50">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="320px"
                />
              </div>
              
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">
                  {member.role}
                </p>
                
                <div className="flex justify-center gap-4 pt-2">
                  {member.socialLinks?.facebook && (
                    <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-50 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks?.instagram && (
                    <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-50 text-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            href="/our-team"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 group"
          >
            {t("VIEW_ALL_TEAMS")} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
