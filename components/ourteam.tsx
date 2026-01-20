"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { Facebook, Twitter, Instagram, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

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
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const nextSlide = useCallback(() => {
    if (team.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % team.length);
  }, [team.length]);

  const prevSlide = useCallback(() => {
    if (team.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? team.length - 1 : prev - 1));
  }, [team.length]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 3000);
  }, [nextSlide]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get 3 visible members
  const getVisibleMembers = () => {
    if (team.length === 0) return [];
    const members = [];
    for (let i = 0; i < 3; i++) {
      members.push(team[(currentIndex + i) % team.length]);
    }
    return members;
  };

  const visibleMembers = getVisibleMembers();

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

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

        <div className="relative max-w-6xl mx-auto px-12">
          {/* Navigation Arrows */}
          <button 
            onClick={() => { prevSlide(); startTimer(); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => { nextSlide(); startTimer(); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-red-50 text-slate-400 hover:text-red-400 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-8 min-h-[500px]">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              {visibleMembers.map((member, index) => (
                <motion.div
                  key={`${member.id}-${currentIndex}-${index}`}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "tween", duration: 0.8, ease: "easeInOut" },
                    opacity: { duration: 0.4 }
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/our-team"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 group"
          >
            VIEW ALL OUR TEAMS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
