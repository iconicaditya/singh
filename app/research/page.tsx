"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, Globe2, Beaker, FileText, Lightbulb } from "lucide-react";
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
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/attached_assets/stock_images/professional_researc_2d676eab.jpg"
            alt="Research Hero"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#020617]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
              ADVANCED <span className="text-blue-500">RESEARCH</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Pioneering interdisciplinary studies to solve global environmental challenges through local action and scientific excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <Link href="/" className="flex items-center gap-2 text-blue-500 font-bold hover:gap-4 transition-all group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1" /> BACK TO PORTAL
            </Link>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search publications & data..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {visibleResearch.map((paper, idx) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ 
                  y: -15,
                  rotateX: 2,
                  rotateY: 2,
                  scale: 1.02
                }}
                className="group relative bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full perspective-1000 shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={paper.image}
                    alt={paper.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-blue-600 px-4 py-2 rounded-full text-[10px] font-black tracking-widest text-white shadow-lg uppercase">
                      {paper.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {paper.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <FileText size={18} />
                      </span>
                      <span className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Lightbulb size={18} />
                      </span>
                    </div>
                    <Link href="#" className="flex items-center gap-2 text-xs font-black text-blue-500 hover:text-white transition-all">
                      EXPLORE DATA <ArrowRight size={16} />
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
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`w-14 h-14 rounded-2xl font-black transition-all border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] scale-110"
                      : "bg-white/5 text-gray-500 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-8 h-14 rounded-2xl bg-blue-600 border border-blue-500 font-black text-white hover:bg-blue-700 disabled:opacity-30 shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2"
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
