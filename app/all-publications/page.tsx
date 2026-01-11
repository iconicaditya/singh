"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const allPublications = [
  {
    id: 1,
    title: "Socio-economic impacts of plastic pollution in coastal communities",
    authors: "Singh, A., Rokaya, N., & Chaudhary, A.",
    journal: "Journal of Environmental Management",
    year: "2024",
    doi: "10.1016/j.jenvman.2024.120000",
    category: "RESEARCH PAPER"
  },
  {
    id: 2,
    title: "Microplastic distribution patterns in urban river systems",
    authors: "Ghatani, B., & Singh, A.",
    journal: "Water Research",
    year: "2023",
    doi: "10.1016/j.watres.2023.110000",
    category: "RESEARCH PAPER"
  },
  {
    id: 3,
    title: "Community-led waste management: A case study from Nepal",
    authors: "Rokaya, N., & Singh, A.",
    journal: "Sustainability Science",
    year: "2024",
    doi: "10.1007/s11625-024-01500-w",
    category: "CASE STUDY"
  },
  ...Array.from({ length: 17 }).map((_, i) => ({
    id: i + 4,
    title: `Sustainability Research Paper ${i + 1}: Global Environmental Policy`,
    authors: "Singh, A., et al.",
    journal: i % 2 === 0 ? "Global Environmental Change" : "Nature Sustainability",
    year: (2020 + (i % 5)).toString(),
    doi: `10.1038/s41893-024-0${100 + i}`,
    category: i % 3 === 0 ? "REVIEW" : "RESEARCH PAPER"
  }))
];

const ITEMS_PER_PAGE = 16;

export default function AllPublicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allPublications.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visiblePublications = allPublications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center text-blue-600 font-bold mb-12 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4">
            Full <span className="text-blue-600">Publications</span>
          </h1>
          <p className="text-gray-500 text-lg">A comprehensive list of our scientific contributions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {visiblePublications.map((pub, idx) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group"
            >
              <div className="mb-4">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {pub.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1e293b] mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                {pub.title}
              </h3>
              <p className="text-gray-500 text-[10px] mb-4 font-medium italic">
                {pub.authors}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400">
                <span>{pub.year}</span>
                <Link href={`https://doi.org/${pub.doi}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                  DOI <ExternalLink size={10} />
                </Link>
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
