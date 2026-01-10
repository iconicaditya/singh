"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const team = [
  {
    name: "Er. Aaditya Chaudhary",
    role: "RESEARCH MEMBER",
    image: "/ourteamimages/aaditya.png",
    bio: "Focusing on environmental sustainability and social impacts.",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Dr. Nabin Rokaya",
    role: "MANAGING DIRECTOR",
    image: "/ourteamimages/nabin.png",
    bio: "Specializing in community resilience and climate data analysis.",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Mr. Bibas Ghatani",
    role: "RESEARCH MEMBER",
    image: "/ourteamimages/bibas.png",
    bio: "Expert in waste management and resource efficiency.",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  },
  {
    name: "Mr. Aakroshan Chaudhary",
    role: "MANAGING DIRECTOR",
    image: "/ourteamimages/Aakroshan1.png",
    bio: "Policy analyst focusing on sustainability frameworks.",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  },
  // Adding 16 more members as requested
  ...Array.from({ length: 16 }).map((_, i) => ({
    name: `Team Member ${i + 5}`,
    role: i % 2 === 0 ? "RESEARCHER" : "ADVISOR",
    image: `/attached_assets/stock_images/professional_researc_${["2d676eab", "b03bfae3", "b446b59e", "f172db13"][i % 4]}.jpg`,
    bio: "Passionate professional dedicated to sustainable development and environmental research.",
    social: { facebook: "#", twitter: "#", linkedin: "#" },
  }))
];

const ITEMS_PER_PAGE = 12;

export default function AllTeams() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(team.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleMembers = team.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-12 font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4">
            Meet Our <span className="text-blue-600">Full Team</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our diverse group of experts working together for a better future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {visibleMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full group transition-all hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6 text-center flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#1e293b] mb-1 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-bold text-xs mb-3 uppercase tracking-widest">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>
                
                <div className="mt-auto pt-4 flex justify-center gap-4 border-t border-gray-50">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black transition-all ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110"
                    : "bg-white text-gray-400 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-6 h-12 rounded-2xl bg-white border border-gray-100 font-black text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
