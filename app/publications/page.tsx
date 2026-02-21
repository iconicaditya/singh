"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { BookOpen, Search, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch("/api/publications");
        const data = await res.json();
        setPublications(data);
      } catch (err) {
        console.error("Error fetching publications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const categories = ["ALL", ...Array.from(new Set((Array.isArray(publications) ? publications : []).map(pub => pub.publicationType || pub.category).filter(Boolean)))];

  const filteredPublications = (Array.isArray(publications) ? publications : []).filter(pub => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = pub.title.toLowerCase().includes(searchLower) || 
                          pub.authors.toLowerCase().includes(searchLower) ||
                          pub.journalConferenceName?.toLowerCase().includes(searchLower) ||
                          pub.year?.includes(searchTerm);
    const pubType = pub.publicationType || pub.category;
    const matchesCategory = activeCategory === "ALL" || pubType === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative text-white py-20 md:py-32 overflow-hidden"
        style={{
          backgroundImage: `url('/image.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 mix-blend-overlay z-0"></div>
        
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent z-0"></div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-xl">
              <BookOpen size={14} /> Our Research
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              Publications & <span className="text-blue-400">Research</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              Explore our scholarly contributions and scientific publications in environmental science and sustainability research.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm py-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-4">
            {/* Search Bar with Integrated Filter */}
            <div className="flex-1 relative">
              <div className="flex items-center border-2 border-blue-500 rounded-2xl px-4 py-3.5 bg-white hover:shadow-md transition-all">
                <Search className="text-slate-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, author, journal, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none font-medium text-slate-900 placeholder-slate-400"
                />
                
                {/* Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="ml-3 pl-3 border-l border-slate-200 py-1 flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-bold text-sm tracking-widest uppercase"
                  >
                    {activeCategory}
                    <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl min-w-56 overflow-hidden z-50"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setActiveCategory(cat);
                              setDropdownOpen(false);
                            }}
                            className={`w-full px-5 py-3.5 text-left font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2 ${
                              activeCategory === cat
                                ? "bg-blue-600 text-white"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {activeCategory === cat && <div className="w-2 h-2 rounded-full bg-white" />}
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPublications.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPublications.map((pub, idx) => (
                  <motion.div
                    key={pub.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-0">
                      {/* Left Image Section */}
                      <div className="w-full md:w-56 h-40 md:h-auto bg-gradient-to-br from-blue-100 to-slate-100 relative flex-shrink-0 overflow-hidden">
                        {pub.coverImageUrl || pub.imageUrl ? (
                          <Image
                            src={pub.coverImageUrl || pub.imageUrl}
                            alt={pub.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                            <BookOpen size={48} className="text-blue-300" />
                          </div>
                        )}
                      </div>

                      {/* Right Content Section */}
                      <div className="flex-1 p-4 md:p-6 flex flex-col">
                        {/* Top: Type and Date Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold tracking-widest uppercase rounded-sm border border-gray-400">
                            {pub.publicationType || pub.category || "Publication"}
                          </span>
                          {pub.year && (
                            <span className="text-gray-600 text-sm font-medium">
                              {pub.year}
                            </span>
                          )}
                        </div>

                        {/* Title as Link */}
                        <h3 className="text-lg md:text-xl font-bold text-blue-600 hover:text-blue-700 mb-2 line-clamp-2 transition-colors leading-tight cursor-pointer">
                          {pub.title}
                        </h3>

                        {/* Authors */}
                        {pub.authors && (
                          <div className="mb-2">
                            <p className="text-sm text-slate-600 font-medium">
                              <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">Author:</span>
                              <span className="text-slate-900">{pub.authors}</span>
                            </p>
                          </div>
                        )}

                        {/* Journal/Conference Name */}
                        {pub.journalConferenceName && (
                          <p className="text-xs text-slate-600 italic mb-2 font-medium">
                            {pub.journalConferenceName}
                          </p>
                        )}

                        {/* Keywords */}
                        {pub.keywords && (
                          <div className="mb-2">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Keywords:</p>
                            <div className="flex flex-wrap gap-2">
                              {pub.keywords.split(',').slice(0, 4).map((keyword: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                                  {keyword.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Abstract */}
                        {pub.abstract && (
                          <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                            {pub.abstract}
                          </p>
                        )}

                        {/* Old Description Field as backup */}
                        {!pub.abstract && pub.description && (
                          <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                            {pub.description}
                          </p>
                        )}

                        {/* Bottom: View Link */}
                        <div className="mt-auto pt-4 flex items-center gap-3">
                          {pub.pdfUrl || pub.doiUrl ? (
                            <a
                              href={pub.pdfUrl ? (pub.pdfUrl.includes('cloudinary.com') && !pub.pdfUrl.includes('/raw/upload/') ? pub.pdfUrl.replace('/image/upload/', '/raw/upload/') : pub.pdfUrl) : pub.doiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-xs tracking-widest uppercase rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                              View <ExternalLink size={14} />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Publications Found</h3>
              <p className="text-slate-600 font-medium">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}