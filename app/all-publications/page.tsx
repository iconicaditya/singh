"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Search, ChevronDown, Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedYear, setSelectedYear] = useState("All Years");

  const categories = ["All Categories", ...new Set(allPublications.map(p => p.category))];
  const years = ["All Years", ...new Set(allPublications.map(p => p.year))].sort((a, b) => b.localeCompare(a));

  const filteredPublications = useMemo(() => {
    return allPublications.filter(pub => {
      const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           pub.authors.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || pub.category === selectedCategory;
      const matchesYear = selectedYear === "All Years" || pub.year === selectedYear;
      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [searchTerm, selectedCategory, selectedYear]);

  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visiblePublications = filteredPublications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center text-blue-600 font-bold mb-12 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4"
          >
            Full <span className="text-blue-600">Publications</span>
          </motion.h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Explore our comprehensive repository of scientific research and scholarly contributions.
          </p>
        </div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              <input 
                type="text" 
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="md:col-span-3 relative">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <select 
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-gray-600 cursor-pointer"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="md:col-span-3 relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <select 
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-gray-600 cursor-pointer"
              >
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCategory("All Categories"); setSelectedYear("All Years"); }}
                className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                title="Reset Filters"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {filteredPublications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {visiblePublications.map((pub, idx) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 relative z-10">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {pub.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-3 relative z-10">
                  {pub.title}
                </h3>
                <p className="text-gray-500 text-[10px] mb-4 font-medium italic relative z-10">
                  {pub.authors}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 relative z-10">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-blue-500" />
                    <span>{pub.year}</span>
                  </div>
                  <Link href={`https://doi.org/${pub.doi}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                    DOI <ExternalLink size={10} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-gray-100"
          >
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">No publications found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </motion.div>
        )}

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
              className="px-6 h-12 rounded-2xl bg-white border border-gray-100 font-black text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all flex items-center gap-2"
            >
              NEXT <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
