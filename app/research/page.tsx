"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, ChevronDown, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

const researchPapers = [
  {
    id: 1,
    title: "Plastic lifecycle impacts",
    category: "WASTE MANAGEMENT",
    description: "Evaluating the environmental footprint of plastic products from production to disposal.",
    image: "/researchimages/research_1.jpg",
    tags: ["LCA", "Sustainability", "Environment"],
    date: "2024-03-15"
  },
  {
    id: 2,
    title: "Plastic-climate connections",
    category: "CLIMATE CHANGE",
    description: "Studying the intersection of plastic pollution and greenhouse gas emissions.",
    image: "/researchimages/research_2.jpg",
    tags: ["Carbon", "Policy", "Climate"],
    date: "2024-01-20"
  },
  {
    id: 3,
    title: "Microplastics monitoring",
    category: "PLASTICS",
    description: "Advanced techniques for detecting and tracking microplastics in urban water systems.",
    image: "/researchimages/research_3.jpg",
    tags: ["Technology", "Monitoring", "Water"],
    date: "2023-11-05"
  },
  {
    id: 4,
    title: "Composting & Biowaste processing",
    category: "WASTE MANAGEMENT",
    description: "Optimizing organic waste conversion for sustainable agricultural applications.",
    image: "/researchimages/research_4.jpg",
    tags: ["Circular Economy", "Agriculture"],
    date: "2023-09-12"
  },
  {
    id: 5,
    title: "Municipal solid waste planning",
    category: "URBAN SYSTEMS",
    description: "Strategic frameworks for integrated waste management in rapidly growing cities.",
    image: "/researchimages/research_1.jpg",
    tags: ["Urban Planning", "Public Health"],
    date: "2023-07-28"
  },
  {
    id: 6,
    title: "Waste-to-energy innovations",
    category: "RENEWABLE ENERGY",
    description: "Exploring next-generation technologies for energy recovery from non-recyclable waste.",
    image: "/researchimages/research_2.jpg",
    tags: ["Energy", "Innovation", "Tech"],
    date: "2023-05-15"
  },
  ...Array.from({ length: 14 }).map((_, i) => ({
    id: i + 7,
    title: `Research Initiative ${i + 7}: Environmental Analysis`,
    category: ["PLASTICS", "CLIMATE", "ENERGY", "URBAN"][i % 4],
    description: "Comprehensive scientific study focusing on long-term sustainability and environmental preservation strategies.",
    image: `/researchimages/research_${(i % 4) + 1}.jpg`,
    tags: ["Science", "Research", "Analysis"],
    date: `2023-0${(i % 9) + 1}-10`
  }))
];

const ITEMS_PER_PAGE = 12;

export default function ResearchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("All Dates");

  const filteredResearch = useMemo(() => {
    return researchPapers.filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           paper.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || paper.category === selectedCategory;
      const matchesDate = selectedDate === "All Dates" || paper.date.startsWith(selectedDate);
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [searchTerm, selectedCategory, selectedDate]);

  const totalPages = Math.ceil(filteredResearch.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleResearch = filteredResearch.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const categories = ["All Categories", ...new Set(researchPapers.map(p => p.category))];
  const dates = ["All Dates", "2024", "2023"];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/researchimages/researchtitle.jpg"
            alt="Research Hero"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/60 to-[#020617]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
              Lab <span className="text-blue-500">Research</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
              Advancing environmental sustainability through rigorous scientific inquiry and innovative methodology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="relative z-20 -mt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search the researches..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-500 font-medium"
                />
              </div>

              <div className="lg:col-span-3 relative">
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                <select 
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none pl-6 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium cursor-pointer"
                >
                  {categories.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                </select>
              </div>

              <div className="lg:col-span-3 relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                <select 
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-medium cursor-pointer"
                >
                  {dates.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                </select>
              </div>

              <div className="lg:col-span-1 flex justify-center">
                <Link href="/" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                  <ArrowLeft size={24} className="text-blue-500 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Count */}
      <div className="container mx-auto px-6 max-w-7xl pt-12 pb-4 text-center">
        <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">
          Showing {filteredResearch.length} scientific publications
        </p>
      </div>

      {/* Main Grid */}
      <section className="py-12 relative min-h-[40vh]">
        <div className="container mx-auto px-6 max-w-7xl">
          {visibleResearch.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
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
                  className="group relative bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full perspective-1000 shadow-2xl hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={paper.image}
                      alt={paper.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-blue-600 px-4 py-2 rounded-full text-[10px] font-black tracking-widest text-white shadow-lg uppercase">
                        {paper.category}
                      </span>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-gray-300">
                        {paper.date}
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
                        {paper.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg font-bold">
                            #{tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                      <Link href={`/research/${paper.id}`} className="flex items-center gap-2 text-xs font-black text-blue-500 hover:text-white transition-all">
                        EXPLORE <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No research papers found matching your criteria.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All Categories"); setSelectedDate("All Dates"); }}
                className="mt-6 text-blue-500 font-bold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}

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
