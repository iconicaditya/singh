"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, ArrowLeft } from "lucide-react";

const galleryData = [
  { id: 1, title: "Plastic Pollution Research", category: "PLASTIC WASTE", image: "/galleryimages/env_gallery1.jpg", description: "Documenting microplastic accumulation in natural water bodies." },
  { id: 2, title: "Ocean Debris Analysis", category: "PLASTIC WASTE", image: "/galleryimages/env_gallery2.jpg", description: "Studying the impact of non-biodegradable waste on marine ecosystems." },
  { id: 3, title: "Coastal Cleanup Monitoring", category: "PLASTIC WASTE", image: "/galleryimages/env_gallery3.jpg", description: "Tracking the effectiveness of coastal waste removal programs." },
  { id: 4, title: "Riverine Waste Flow", category: "PLASTIC WASTE", image: "/galleryimages/env_gallery4.jpg", description: "Analyzing how plastic waste travels through urban river systems." },
  { id: 5, title: "Urban Litter Assessment", category: "PLASTIC WASTE", image: "/galleryimages/env_gallery5.jpg", description: "Statistical sampling of plastic litter in metropolitan green spaces." },
  { id: 6, title: "Industrial Recycling Workflow", category: "RECYCLING", image: "/galleryimages/env_gallery6.jpg", description: "Optimizing sorting processes for multi-material recycling streams." },
  { id: 7, title: "Material Recovery Analysis", category: "RECYCLING", image: "/galleryimages/env_gallery7.jpg", description: "Evaluating the purity of recovered secondary raw materials." },
  { id: 8, title: "Circular Economy Research", category: "RECYCLING", image: "/galleryimages/env_gallery8.jpg", description: "Designing closed-loop systems for industrial byproduct management." },
  { id: 9, title: "Waste-to-Energy Process", category: "RECYCLING", image: "/galleryimages/env_gallery9.jpg", description: "Monitoring thermal conversion of non-recyclable waste into energy." },
  { id: 10, title: "Electronic Waste Sorting", category: "RECYCLING", image: "/galleryimages/env_gallery10.jpg", description: "Advanced separation techniques for high-value metal recovery from E-waste." },
  { id: 11, title: "Landfill Methane Monitoring", category: "LANDFILL MGMT", image: "/galleryimages/env_gallery11.jpg", description: "Remote sensing of greenhouse gas emissions from active landfill sites." },
  { id: 12, title: "Geosynthetic Barrier Audit", category: "LANDFILL MGMT", image: "/galleryimages/env_gallery12.jpg", description: "Inspecting integrity of containment systems for hazardous waste." },
  { id: 13, title: "Leachate Treatment Study", category: "LANDFILL MGMT", image: "/galleryimages/env_gallery13.jpg", description: "Testing biological treatment methods for landfill runoff." },
  { id: 14, title: "Groundwater Contamination Mapping", category: "LANDFILL MGMT", image: "/galleryimages/env_gallery14.jpg", description: "3D visualization of subsurface pollutant plumes." },
  { id: 15, title: "Landfill Rehabilitation Plan", category: "LANDFILL MGMT", image: "/galleryimages/env_gallery15.jpg", description: "Planning the conversion of closed landfill cells into community parks." },
  { id: 16, title: "Large-Scale Composting", category: "ORGANIC WASTE", image: "/galleryimages/env_gallery16.jpg", description: "Industrial-scale processing of municipal organic waste." },
  { id: 17, title: "Anaerobic Digestion Research", category: "ORGANIC WASTE", image: "/galleryimages/env_gallery17.jpg", description: "Optimizing biogas yields from high-nitrogen organic substrates." },
  { id: 18, title: "Vermin Control in Waste Sites", category: "ORGANIC WASTE", image: "/galleryimages/env_gallery18.jpg", description: "Study on managing biodiversity in organic waste processing facilities." },
  { id: 19, title: "Bio-Fertilizer Quality Test", category: "ORGANIC WASTE", image: "/galleryimages/env_gallery19.jpg", description: "Chemical analysis of nutrient profiles in waste-derived fertilizers." },
  { id: 20, title: "Food Waste Reduction Program", category: "ORGANIC WASTE", image: "/galleryimages/env_gallery20.jpg", description: "Data-driven approach to minimizing institutional food waste." },
];

const CATEGORIES = ["ALL", "PLASTIC WASTE", "RECYCLING", "LANDFILL MGMT", "ORGANIC WASTE"];
const ITEMS_PER_PAGE = 16;

export default function AllGallery() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<typeof galleryData[0] | null>(null);

  const filteredItems = galleryData.filter(
    (item) => activeCategory === "ALL" || item.category === activeCategory
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-12 font-medium group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4">
            Research <span className="text-blue-600">Archive</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            A comprehensive visual documentation of our environmental research initiatives.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid (4x4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gray-50 rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-black tracking-widest text-blue-400 mb-2">{item.category}</span>
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-[10px]">
                    <Maximize2 size={12} /> Click to expand
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
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
              className="px-6 h-12 rounded-2xl bg-white border border-gray-100 font-black text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all flex items-center gap-2"
            >
              NEXT <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-8 md:p-12">
                <span className="text-blue-500 font-black tracking-widest text-xs mb-3 block">{selectedImage.category}</span>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{selectedImage.title}</h2>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">{selectedImage.description}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all group"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}