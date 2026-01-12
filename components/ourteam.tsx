"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const team = [
  {
    name: "Er. Aaditya Chaudhary",
    role: "RESEARCH MEMBER",
    image: "/ourteamimages/aaditya.png",
    bio: "Focusing on environmental sustainability and social i...",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Dr. Nabin Rokaya",
    role: "MANAGING DIRECTOR",
    image: "/ourteamimages/nabin.png",
    bio: "Specializing in community resilience and climate data...",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Mr. Bibas Ghatani",
    role: "RESEARCH MEMBER",
    image: "/ourteamimages/bibas.png",
    bio: "Expert in waste management and resource efficiency.",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  },
];

export default function OurTeam() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#1e293b] mb-4"
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

        <div className="relative max-w-7xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full transition-shadow hover:shadow-xl"
              >
                <div className="relative h-72 overflow-hidden shrink-0 m-4 rounded-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 text-center flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#1e293b] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-bold text-xs mb-3 uppercase tracking-widest">
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  <div className="mt-auto flex justify-center gap-4">
                    <Link href={member.social.facebook} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Facebook size={18} />
                    </Link>
                    <Link href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Twitter size={18} />
                    </Link>
                    <Link href={member.social.linkedin} className="text-gray-400 hover:text-blue-700 transition-colors">
                      <Linkedin size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-12">
          <div className="h-2 w-2 rounded-full bg-gray-200" />
          <div className="h-2 w-8 rounded-full bg-blue-600" />
          <div className="h-2 w-2 rounded-full bg-gray-200" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/all-teams"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 group"
          >
            VIEW ALL OUR TEAMS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
