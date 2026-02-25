"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface GalleryItem {
  id: number | string;
  title: string;
  category: string;
  imageUrl: string;
  description: string | null;
}

const normalizeImageUrl = (url: string) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://res.cloudinary.com")) {
    return trimmed.replace("http://", "https://");
  }
  if (trimmed.startsWith("http://") && /fbcdn\.net|fbsbx\.com/.test(trimmed)) {
    return trimmed.replace("http://", "https://");
  }
  return trimmed;
};

const isDirectImageUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    return /\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)$/.test(pathname);
  } catch {
    return false;
  }
};

export default function Gallery() {
  const { t } = useLanguage();
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) throw new Error("Failed to fetch gallery");
        const data = await response.json();
        
        // Transform the data to match GalleryItem interface
        const transformedData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          imageUrl: normalizeImageUrl(item.image_url || item.imageUrl),
          description: item.description
        }));
        
        setGalleryData(transformedData);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const categories = [
    "ALL",
    ...Array.from(new Set(galleryData.map((item) => item.category).filter(Boolean))),
  ];

  const getCategoryLabel = (category: string) => {
    if (category === "ALL") return t("ALL_CATEGORIES");
    const key = category.replace(/\s+/g, "_").toUpperCase();
    const translated = t(key);
    return translated !== key ? translated : category;
  };

  const filteredItems = galleryData
    .filter((item) => (activeCategory === "ALL" ? true : item.category === activeCategory))
    .slice(0, 12);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t("LOADING_GALLERY")}</p>
          </div>
        </div>
      </section>
    );
  }

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
            {t("RESEARCH_GALLERY")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg"
          >
            {t("GALLERY_DESCRIPTION")}
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, idx) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {getCategoryLabel(category)}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gray-50 overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                onClick={() => setSelectedImage(item)}
              >
                {item.imageUrl && (
                  isDirectImageUrl(item.imageUrl) ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized={item.imageUrl.startsWith('http')}
                    />
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-black tracking-widest text-blue-400 mb-2">{item.category}</span>
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-[10px]">
                    <Maximize2 size={12} /> {t("EXPAND")}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredItems.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-gray-400 font-medium">No images found in this category.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/all-gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-blue-200 flex items-center gap-3 transition-all"
            >
              {t("VIEW_ALL_IMAGES")} <ArrowRight size={20} />
            </motion.button>
          </Link>
        </div>
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
              className="relative max-w-5xl w-full aspect-video bg-black overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.imageUrl && (
                isDirectImageUrl(selectedImage.imageUrl) ? (
                  <Image
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                    unoptimized={selectedImage.imageUrl.startsWith('http')}
                  />
                ) : (
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                )
              )}
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
