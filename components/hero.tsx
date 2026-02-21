"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useScrollToSection } from "@/lib/useScrollToSection";
import Link from "next/link";

interface HeroSlide {
  id: number;
  mainHeading: string;
  subheading: string;
  backgroundImage: string;
}

export default function Hero() {
  const { t } = useLanguage();
  const { handleSectionScroll } = useScrollToSection();
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  // Fetch hero slides from database
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const res = await fetch("/api/hero", { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHeroSlides(data);
        }
      } catch (err) {
        console.error("Error fetching hero slides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroSlides();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));

  // Loading state
  if (loading) {
    return (
      <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium">Loading Hero...</p>
        </div>
      </section>
    );
  }

  // No data state
  if (heroSlides.length === 0) {
    return (
      <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center px-6">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-2">No Hero Slides Available</h2>
          <p className="text-sm md:text-base text-gray-300">Please add hero slides from the admin dashboard.</p>
        </div>
      </section>
    );
  }

  const currentSlide = heroSlides[current];

  return (
    <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-110"
            style={{ 
              backgroundImage: `url(${currentSlide.backgroundImage})` 
            }}
          />
          <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 md:px-4 text-center text-white">
        <motion.h2
          key={`title-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl text-3xl font-black md:text-7xl leading-tight"
        >
          {currentSlide.mainHeading}
        </motion.h2>
        
        <motion.p
          key={`subtitle-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-4 md:mt-6 max-w-2xl text-base font-medium md:text-xl text-gray-200"
        >
          {currentSlide.subheading}
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 md:mt-10"
        >
          <button 
            onClick={handleSectionScroll("/#about")}
            className="flex items-center gap-2 rounded-full bg-[#2563eb] px-6 md:px-10 py-3 md:py-4 text-base md:text-lg font-bold transition-all hover:bg-[#1d4ed8] hover:scale-105 active:scale-95 shadow-lg"
          >
            {t("LEARN_MORE")} <span>→</span>
          </button>
        </motion.div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 md:bottom-10 flex gap-2 md:gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === i ? "w-8 bg-[#2563eb]" : "w-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-110"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-110"
      >
        <ChevronRight size={32} />
      </button>
    </section>
  );
}
