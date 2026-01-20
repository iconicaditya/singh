"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  socialLinks: Record<string, string>;
}

export default function OurTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  useEffect(() => {
    if (team.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === 0 ? team.length - 1 : prev - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [team.length]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Determine which members to show (3 at a time)
  const visibleMembers = [];
  for (let i = 0; i < 3; i++) {
    if (team.length > 0) {
      // Reverse selection for left-to-right logic if needed, 
      // but simple index wrap works for continuous feel
      visibleMembers.push(team[(currentIndex + i) % team.length]);
    }
  }

  return (
    <section className="py-24 bg-[#fdf8f4] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          >
            Meet Our Research Team
          </motion.h2>
          <div className="w-20 h-0.5 bg-red-400 mx-auto mb-8" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed"
          >
            Our multidisciplinary team of experts is dedicated to advancing scientific knowledge through rigorous research and collaborative innovation to address global challenges.
          </motion.p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-center gap-8 min-h-[500px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleMembers.map((member, index) => (
                <motion.div
                  key={`${member.id}-${currentIndex}-${index}`}
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="w-full md:w-1/3 bg-white p-6 rounded-sm border border-transparent hover:border-red-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-slate-100">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{member.role}</p>
                    
                    <div className="flex justify-center gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Facebook className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600" />
                      <Twitter className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600" />
                      <Instagram className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
