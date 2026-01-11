"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const researchPapers = [
  {
    id: 1,
    title: "Plastic lifecycle impacts",
    category: "WASTE MANAGEMENT",
    description: "Evaluating the environmental footprint of plastic products from production to disposal.",
    image: "/attached_assets/stock_images/professional_researc_2d676eab.jpg",
    tags: ["LCA", "Sustainability", "Environment"]
  },
  {
    id: 2,
    title: "Plastic-climate connections",
    category: "CLIMATE CHANGE",
    description: "Studying the intersection of plastic pollution and greenhouse gas emissions.",
    image: "/attached_assets/stock_images/professional_researc_b03bfae3.jpg",
    tags: ["Carbon", "Policy", "Climate"]
  },
  {
    id: 3,
    title: "Microplastics monitoring",
    category: "PLASTICS",
    description: "Advanced techniques for detecting and tracking microplastics in urban water systems.",
    image: "/attached_assets/stock_images/professional_researc_b446b59e.jpg",
    tags: ["Technology", "Monitoring", "Water"]
  },
  {
    id: 4,
    title: "Composting & Biowaste processing",
    category: "WASTE MANAGEMENT",
    description: "Optimizing organic waste conversion for sustainable agricultural applications.",
    image: "/attached_assets/stock_images/professional_researc_f172db13.jpg",
    tags: ["Circular Economy", "Agriculture"]
  },
  {
    id: 5,
    title: "Municipal solid waste planning",
    category: "URBAN SYSTEMS",
    description: "Strategic frameworks for integrated waste management in rapidly growing cities.",
    image: "/attached_assets/stock_images/professional_researc_2d676eab.jpg",
    tags: ["Urban Planning", "Public Health"]
  },
  {
    id: 6,
    title: "Waste-to-energy innovations",
    category: "RENEWABLE ENERGY",
    description: "Exploring next-generation technologies for energy recovery from non-recyclable waste.",
    image: "/attached_assets/stock_images/professional_researc_b03bfae3.jpg",
    tags: ["Energy", "Innovation", "Tech"]
  },
  // Adding more mock research to showcase pagination (Total 20)
  ...Array.from({ length: 14 }).map((_, i) => ({
    id: i + 7,
    title: `Research Initiative ${i + 7}: Environmental Analysis`,
    category: ["PLASTICS", "CLIMATE", "ENERGY", "URBAN"][i % 4],
    description: "Comprehensive scientific study focusing on long-term sustainability and environmental preservation strategies.",
    image: `/attached_assets/stock_images/professional_researc_${["2d676eab", "b03bfae3", "b446b59e", "f172db13"][i % 4]}.jpg`,
    tags: ["Science", "Research", "Analysis"]
  }))
];

const ITEMS_PER_PAGE = 12;

export default function ResearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(researchPapers.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleResearch = researchPapers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/attached_assets/stock_images/professional_researc_2d676eab.jpg"
          alt="Research Hero"
          fill
          className="object-cover brightness-50"
        />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter"
          >
            Our <span className="text-blue-500 underline decoration-white/30">Research</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Pioneering scientific investigations into the most pressing environmental challenges of our time.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all group">
              <ArrowLeft size={20} /> BACK TO HOME
            </Link>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search publications..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {visibleResearch.map((paper, idx) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={paper.image}
                    alt={paper.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black tracking-widest text-blue-600 shadow-sm uppercase">
                      {paper.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {paper.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex gap-2">
                      {paper.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-blue-50 text-blue-500 px-3 py-1 rounded-lg font-bold">
                          #{tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <Link href="#" className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all group-hover:rotate-12">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className={`w-14 h-14 rounded-2xl font-black transition-all ${
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
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-8 h-14 rounded-2xl bg-white border border-gray-100 font-black text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all flex items-center gap-2"
              >
                NEXT <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
