"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const galleryData = [
  { id: 1, title: "Laboratory Waste Analysis", category: "LABORATORY", image: "/galleryimages/gallery1.jpg", description: "Analyzing chemical waste components in a controlled lab environment." },
  { id: 2, title: "Chemical Processing Research", category: "LABORATORY", image: "/galleryimages/gallery2.jpg", description: "Researching safe chemical waste neutralization methods." },
  { id: 3, title: "Microscopic Sample Study", category: "LABORATORY", image: "/galleryimages/gallery3.jpg", description: "Examining environmental micro-particles under high magnification." },
  { id: 4, title: "Biotech Waste Solutions", category: "LABORATORY", image: "/galleryimages/gallery4.jpg", description: "Developing biological solutions for organic waste breakdown." },
  { id: 5, title: "Water Quality Testing", category: "LABORATORY", image: "/galleryimages/gallery5.jpg", description: "Assessing heavy metal concentrations in industrial runoff." },
  { id: 6, title: "River Sediment Sampling", category: "FIELD STUDY", image: "/galleryimages/gallery6.jpg", description: "Collecting riverbed samples for pollution longitudinal study." },
  { id: 7, title: "Soil Contamination Mapping", category: "FIELD STUDY", image: "/galleryimages/gallery7.jpg", description: "In-situ soil analysis for industrial site remediation." },
  { id: 8, title: "Ecosystem Health Audit", category: "FIELD STUDY", image: "/galleryimages/gallery8.jpg", description: "Monitoring biodiversity markers in waste-adjacent zones." },
  { id: 9, title: "Coastal Impact Study", category: "FIELD STUDY", image: "/galleryimages/gallery9.jpg", description: "Studying the effects of marine debris on local flora." },
  { id: 10, title: "Groundwater Extraction", category: "FIELD STUDY", image: "/galleryimages/gallery10.jpg", description: "Sampling deep aquifer water for landfill leakage detection." },
  { id: 11, title: "Waste Sorting Efficiency", category: "MONITORING", image: "/galleryimages/gallery11.jpg", description: "Automated analysis of waste stream segregation quality." },
  { id: 12, title: "Air Quality Station", category: "MONITORING", image: "/galleryimages/gallery12.jpg", description: "Continuous monitoring of emissions at processing facilities." },
  { id: 13, title: "Landfill Thermal Imaging", category: "MONITORING", image: "/galleryimages/gallery13.jpg", description: "Detecting underground heat signatures in waste deposits." },
  { id: 14, title: "Odor Dispersion Modeling", category: "MONITORING", image: "/galleryimages/gallery14.jpg", description: "Mapping atmospheric dispersion of waste processing byproducts." },
  { id: 15, title: "Recycling Plant Throughput", category: "MONITORING", image: "/galleryimages/gallery15.jpg", description: "Monitoring material recovery rates in modern facilities." },
  { id: 16, title: "Field Data Digitization", category: "DATA COLLECTION", image: "/galleryimages/gallery16.jpg", description: "Real-time logging of environmental parameters on-site." },
  { id: 17, title: "Survey Site Surveying", category: "DATA COLLECTION", image: "/galleryimages/gallery17.jpg", description: "Using GPS to map exact sampling coordinates." },
  { id: 18, title: "Sensor Array Deployment", category: "DATA COLLECTION", image: "/galleryimages/gallery18.jpg", description: "Setting up remote sensing equipment for long-term data." },
  { id: 19, title: "Water Flow Measurement", category: "DATA COLLECTION", image: "/galleryimages/gallery19.jpg", description: "Recording discharge rates in drainage systems." },
  { id: 20, title: "Community Waste Surveys", category: "DATA COLLECTION", image: "/galleryimages/gallery20.jpg", description: "Gathering statistical data on household waste habits." },
];

const CATEGORIES = ["ALL", "LABORATORY", "FIELD STUDY", "MONITORING", "DATA COLLECTION"];
const ITEMS_PER_PAGE = 12;

export default function Gallery() {
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4"
          >
            Research <span className="text-blue-600">Gallery</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg"
          >
            Explore our authentic field operations, laboratory analysis, and environmental monitoring initiatives.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gray-50 rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
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
    </section>
  );
}