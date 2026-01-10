"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/heroimages/hero0.png",
    title: "Understanding Environmental Challenges",
    subtitle: "Addressing Climate Change & Biodiversity Loss",
  },
  {
    image: "/heroimages/renewalenergy.jpg",
    title: "Renewable Energy Solutions",
    subtitle: "Powering the future with clean, sustainable energy.",
  },
  {
    image: "/heroimages/wastemanagement.jpg",
    title: "Waste Management Innovation",
    subtitle: "Reducing our footprint through circular economy practices.",
  },
  {
    image: "/heroimages/hero3.jpg",
    title: "Community Driven Action",
    subtitle: "Working together for a greener and cleaner planet.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-black">
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
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.h2
          key={`title-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl text-5xl font-black md:text-7xl"
        >
          {slides[current].title}
        </motion.h2>
        
        <motion.p
          key={`subtitle-${current}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 max-w-2xl text-lg font-medium md:text-xl text-gray-200"
        >
          {slides[current].subtitle}
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10"
        >
          <button className="flex items-center gap-2 rounded-full bg-[#2563eb] px-10 py-4 text-lg font-bold transition-all hover:bg-[#1d4ed8] hover:scale-105 active:scale-95 shadow-lg">
            Learn More <span>→</span>
          </button>
        </motion.div>

        {/* Navigation Dots */}
        <div className="absolute bottom-10 flex gap-3">
          {slides.map((_, i) => (
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
