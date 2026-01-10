"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const team = [
  {
    name: "Aaditya Singh",
    role: "Research Member",
    image: "/ourteamimages/aaditya.png",
    bio: "Focusing on environmental sustainability and social impacts.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Aakroshan",
    role: "Research Member",
    image: "/ourteamimages/Aakroshan.png",
    bio: "Specializing in community resilience and climate data analysis.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Bibas",
    role: "Research Member",
    image: "/ourteamimages/bibas.png",
    bio: "Expert in waste management and resource efficiency.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Nabin",
    role: "Research Member",
    image: "/ourteamimages/nabin.png",
    bio: "Policy analyst focusing on sustainability frameworks.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  }
];

export default function OurTeam() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % team.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % team.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? team.length - 1 : prev - 1));

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4"
          >
            Meet Our <span className="text-blue-600">Team</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            A dedicated group of researchers and professionals working towards a sustainable future.
          </motion.p>
        </div>

        <div className="relative max-w-lg mx-auto h-[500px]">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-full"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={team[currentIndex].image}
                  alt={team[currentIndex].name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent flex items-end justify-center pb-6">
                  <div className="flex gap-4">
                    <Link href={team[currentIndex].social.facebook} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-600 transition-all">
                      <Facebook size={18} />
                    </Link>
                    <Link href={team[currentIndex].social.twitter} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-400 transition-all">
                      <Twitter size={18} />
                    </Link>
                    <Link href={team[currentIndex].social.linkedin} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-700 transition-all">
                      <Linkedin size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-[#1e293b] mb-2">
                  {team[currentIndex].name}
                </h3>
                <p className="text-blue-600 font-bold text-sm mb-4 uppercase tracking-widest">
                  {team[currentIndex].role}
                </p>
                <p className="text-gray-500 text-base leading-relaxed">
                  {team[currentIndex].bio}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={nextSlide}
            className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all hidden md:block"
          >
            <ChevronRight size={24} />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {team.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? "w-8 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
