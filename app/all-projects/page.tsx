"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const allProjects = [
  {
    id: 1,
    title: "MARINE PLASTIC POLLUTION ANALYSIS",
    category: "RESEARCH",
    description: "Comprehensive study on the distribution and impact of microplastics in coastal waters, focusing on marine ecosystem health.",
    status: "Ongoing...",
    image: "/projectimages/marine.png",
    year: "2024"
  },
  {
    id: 2,
    title: "COMMUNITY RECYCLING WORKSHOP",
    category: "COMMUNITY",
    description: "Empowering local communities with sustainable waste management practices through interactive workshops and resource sharing.",
    status: "Completed",
    image: "/projectimages/recycling.jpg",
    year: "2023"
  },
  {
    id: 3,
    title: "CLIMATE DATA VISUALIZATION AI",
    category: "TECHNOLOGY",
    description: "Developing advanced AI models to visualize complex climate data patterns, helping policymakers make informed decisions.",
    status: "Ongoing...",
    image: "/projectimages/climate_ai.jpg",
    year: "2024"
  },
  // Adding 16 more projects
  ...Array.from({ length: 16 }).map((_, i) => ({
    id: i + 4,
    title: `Sustainable Project Initiative ${i + 1}`,
    category: ["RESEARCH", "COMMUNITY", "TECHNOLOGY"][i % 3],
    description: "A professional initiative focused on implementing cutting-edge sustainability solutions and environmental protection strategies.",
    status: i % 2 === 0 ? "Ongoing..." : "Completed",
    image: `/attached_assets/stock_images/professional_researc_${["2d676eab", "b03bfae3", "b446b59e", "f172db13"][i % 4]}.jpg`,
    year: (2020 + (i % 5)).toString()
  }))
];

const ITEMS_PER_PAGE = 16;

export default function AllProjects() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allProjects.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = allProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50/50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-12 font-medium group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4">
            Our <span className="text-blue-600">Full Portfolio</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A comprehensive look at our commitment to a sustainable and resilient future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {visibleProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group"
            >
              <div className="relative h-48 overflow-hidden shrink-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-blue-600 shadow-sm uppercase">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-black text-[#1e293b] mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className={`text-[10px] font-bold ${project.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
                    {project.status}
                  </span>
                  <Link href="#" className="flex items-center gap-1 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors">
                    LEARN MORE <ArrowRight size={12} />
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
