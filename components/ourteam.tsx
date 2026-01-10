"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
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

        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-12"
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="min-w-[280px] md:min-w-[320px] group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                    <div className="flex gap-4">
                      <Link href={member.social.facebook} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-600 transition-all">
                        <Facebook size={20} />
                      </Link>
                      <Link href={member.social.twitter} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-400 transition-all">
                        <Twitter size={20} />
                      </Link>
                      <Link href={member.social.linkedin} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-700 transition-all">
                        <Linkedin size={20} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-[#1e293b] mb-1 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm mb-4 uppercase tracking-wider">
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all hidden md:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link href="#" className="inline-flex items-center gap-2 px-8 py-3 bg-[#1e293b] text-white rounded-full font-bold hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg">
            Join Our Team <ExternalLink size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
