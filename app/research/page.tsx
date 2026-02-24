"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown, Loader2, BookOpen, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { getTranslatedResearchList } from "@/lib/dynamicTranslations";

const ITEMS_PER_PAGE = 18;

export default function ResearchPage() {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAuthor, setSelectedAuthor] = useState("All Authors");
  const [researchList, setResearchList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const response = await fetch('/api/research', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setResearchList(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResearch();
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

  const categories = useMemo(() => ["All Categories", ...new Set(researchList.map(p => p.category).filter(Boolean))], [researchList]);

  const authors = useMemo(() => {
    const all = researchList.flatMap(r => Array.isArray(r.authors) ? r.authors.map((a: any) => a.name).filter(Boolean) : []);
    return ["All Authors", ...Array.from(new Set(all))];
  }, [researchList]);

  const filteredResearch = useMemo(() => {
    // Apply dynamic translations first
    const translatedList = getTranslatedResearchList(researchList, language as 'en' | 'ja');
    
    return translatedList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.tags && item.tags.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchesAuthor = selectedAuthor === "All Authors" || (Array.isArray(item.authors) && item.authors.some((a: any) => String(a.name) === selectedAuthor));
      return matchesSearch && matchesCategory && matchesAuthor;
    });
  }, [searchTerm, selectedCategory, selectedAuthor, researchList, language]);

  const totalPages = Math.ceil(filteredResearch.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleResearch = filteredResearch.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const stripHtml = (value: string) => {
    if (!value) return "";
    return value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getFirstContentExcerpt = (item: any, wordLimit = 20) => {
    const firstContent = item?.contentSections?.[0]?.content || "";
    const plainText = stripHtml(firstContent);
    if (!plainText) return "";

    const words = plainText.split(" ");
    if (words.length <= wordLimit) {
      return plainText;
    }

    return `${words.slice(0, wordLimit).join(" ")} ...`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Filters & Search */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm py-6">
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center border border-slate-200 rounded-none px-4 py-3 sm:px-5 sm:py-4 bg-white transition-shadow focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md">
                  <Search className="text-slate-400 mr-3" size={20} />
                  <input 
                    type="text"
                    placeholder="Search research by title or description..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="flex-1 outline-none font-semibold text-base md:text-lg text-slate-900 placeholder-slate-400 bg-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 font-semibold">
                    <Filter size={18} />
                    <span className="text-slate-800 font-bold">Filters:</span>
                  </div>
                  <select
                    value={selectedAuthor}
                    onChange={e => { setSelectedAuthor(e.target.value); setCurrentPage(1); }}
                    className="border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 bg-white w-full sm:w-auto"
                  >
                    {authors.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <select
                    value={selectedCategory}
                    onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                    className="border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 bg-white w-full sm:w-auto"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-slate-500 mt-1 sm:mt-0">{filteredResearch.length} projects</div>
              </div>
            </div>
        </div>
      </div>

      {/* Research Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Loading Repository...</p>
            </div>
          ) : visibleResearch.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {visibleResearch.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white overflow-hidden flex flex-col"
                  >
                    <Link href={`/research/${item.id}`} className="relative aspect-[16/10] block overflow-hidden bg-slate-100">
                      {item.titleImage ? (
                        <img 
                          src={item.titleImage} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <BookOpen size={40} />
                        </div>
                      )}
                    </Link>

                    <div className="pt-4 pb-2 flex flex-col flex-grow">
                      <h3
                        className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] font-bold text-slate-900 mb-3 leading-tight tracking-tight group-hover:text-blue-700 transition-colors overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        <Link href={`/research/${item.id}`}>{item.title}</Link>
                      </h3>

                      <p
                        className="text-sm md:text-base uppercase tracking-wide leading-relaxed text-slate-700 mb-4 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 6,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {getFirstContentExcerpt(item, 20)}
                      </p>

                      <div className="mt-auto">
                        <Link
                          href={`/research/${item.id}`}
                          className="inline-flex items-center gap-2 text-base md:text-lg font-semibold text-slate-900 transition-all duration-300 hover:text-blue-700 hover:gap-3"
                        >
                          <span>View Full Details</span>
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-md text-sm font-bold transition-all ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
              <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t("NO_MATCHING_ENTRIES")}</h3>
              <p className="text-slate-500 text-sm">{t("TRY_ADJUSTING_FILTERS")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
