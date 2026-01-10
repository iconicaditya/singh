"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

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
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % team.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? team.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const getVisibleItems = () => {
    // Show 1 item on mobile, 2 on tablet/small laptops, 3 on large screens
    // For now, let's keep the logic simple and handle visibility via Tailwind
    const items = [];
    for (let i = 0; i < 4; i++) { // Fetch more items to be safe
      items.push(team[(currentIndex + i) % team.length]);
    }
    return items;
  };

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

        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 z-20 bg-white p-2 md:p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all focus:outline-none"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {getVisibleItems().map((member, idx) => (
                <motion.div
                  key={`${member.name}-${currentIndex}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className={`bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full ${idx > 0 ? "hidden md:flex" : "flex"}`}
                >
                  {/* Image Container */}
                  <div className="relative h-64 md:h-72 lg:h-64 overflow-hidden shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-4">
                        <Link href={member.social.facebook} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-600 transition-all">
                          <Facebook size={18} />
                        </Link>
                        <Link href={member.social.twitter} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-400 transition-all">
                          <Twitter size={18} />
                        </Link>
                        <Link href={member.social.linkedin} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-700 transition-all">
                          <Linkedin size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#1e293b] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-xs mb-3 uppercase tracking-widest">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                    {/* Social Icons always visible on mobile/default if preferred, or hover */}
                    <div className="mt-auto pt-4 flex justify-center gap-3">
                        <Link href={member.social.facebook} className="text-gray-400 hover:text-blue-600 transition-all">
                          <Facebook size={18} />
                        </Link>
                        <Link href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-all">
                          <Twitter size={18} />
                        </Link>
                        <Link href={member.social.linkedin} className="text-gray-400 hover:text-blue-700 transition-all">
                          <Linkedin size={18} />
                        </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 z-20 bg-white p-2 md:p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all focus:outline-none"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {team.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === i ? "w-8 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
