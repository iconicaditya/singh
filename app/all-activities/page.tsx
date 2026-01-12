"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const allActivities = [
  {
    id: 1,
    title: "International Symposium on Sustainable Waste Management",
    date: "2024-05-15",
    description: "The Singh Lab hosted a global symposium featuring experts from 12 countries to discuss microplastic mitigation strategies. The event focused on lifecycle analysis and policy frameworks.",
    image: "/researchimages/research_1.jpg",
    category: "NEWS"
  },
  {
    id: 2,
    title: "New Research Grant: Coastal Ecosystem Restoration",
    date: "2024-04-10",
    description: "We are thrilled to announce a new major grant focusing on restoring mangrove forests in Southeast Asia. This three-year project will study carbon sequestration.",
    image: "/researchimages/research_2.jpg",
    category: "UPDATE"
  },
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: i + 3,
    title: `Lab Announcement ${i + 3}: Strategic Environmental Initiative`,
    date: `2024-0${(i % 5) + 1}-01`,
    description: "Comprehensive updates on our ongoing research efforts, community outreach programs, and technological innovations aimed at fostering global environmental sustainability.",
    image: `/researchimages/research_${(i % 5) + 1}.jpg`,
    category: i % 2 === 0 ? "UPDATE" : "NEWS"
  }))
];

const ITEMS_PER_PAGE = 16;

export default function AllActivitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allActivities.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleActivities = allActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center text-blue-600 font-bold mb-12 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4">
            News & <span className="text-blue-600">Updates</span>
          </h1>
          <p className="text-gray-500 text-lg">Stay updated with the latest happenings at Singh Lab.</p>
        </div>

        <div className="space-y-10 mb-16">
          {visibleActivities.map((activity, idx) => (
            <motion.article
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="relative w-full md:w-64 aspect-[4/3] overflow-hidden rounded-3xl shrink-0">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Tag size={12} /> {activity.category}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1.5 font-medium">
                    <Calendar size={14} /> {activity.date}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                  {activity.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">
                  {activity.description}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                  Read More <ArrowRight size={18} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
