"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Users, Linkedin, Twitter, Facebook, Instagram, ExternalLink, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import 'react-quill-new/dist/quill.snow.css';

interface Person {
  id: number;
  fullName: string;
  roleDesignation: string;
  profileImage: string;
  nationality?: string;
  educationBackground?: string;
  pastTeachingBackground?: string;
  publications?: Array<{ link: string }>;
  cvUrl?: string;
  cvLinks?: Array<{ title: string; link: string }>;
  graduationYears?: string[];
  researchTopic?: string;
  conferencePresentation?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

const roleDisplayNames: { [key: string]: string } = {
  professor: "Professor",
  graduate: "Graduate Students",
  undergraduate: "Undergraduate Students",
};

const roleQueryMaps: { [key: string]: string } = {
  professor: "Professor",
  graduate: "Graduate students",
  undergraduate: "Undergraduate students",
};

function PeoplePageContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "professor";
  
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(roleParam);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLimitOpen, setIsLimitOpen] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/people", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPeopleList(data);
        }
      } catch (err) {
        console.error("Error fetching people:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  // Filter people by role
  const filteredPeople = peopleList.filter(
    (person) => person.roleDesignation === roleQueryMaps[activeRole]
  ).filter((person) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      person.fullName.toLowerCase().includes(query) ||
      person.roleDesignation.toLowerCase().includes(query) ||
      person.nationality?.toLowerCase().includes(query) ||
      person.researchTopic?.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPeople = filteredPeople.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeRole]);

  const roleButtons = [
    { key: "professor", label: "Professor" },
    { key: "graduate", label: "Graduate Students" },
    { key: "undergraduate", label: "Undergraduate Students" },
  ];

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center py-20 px-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6 sm:py-10 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Navigation Link */}
      <div className="max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-10">
        <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-sm sm:text-base">
          <span>←</span> Back to Home
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 sm:mb-3">Our People</h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Meet our dedicated team of researchers, professors, and students working towards excellence
          </p>
        </motion.div>

        {/* Search Bar and Role Filter Buttons - Single Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row items-center gap-4 mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          {/* Search Bar */}
          <div className="w-full lg:flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, role, nationality, or research topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-blue-600 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 transition-colors text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Role Filter Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-2 sm:gap-3">
            {roleButtons.map((button, idx) => (
              <motion.button
                key={button.key}
                onClick={() => setActiveRole(button.key)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                  activeRole === button.key
                    ? "border-2 border-blue-600 text-blue-600 bg-blue-50 shadow-md"
                    : "border-2 border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:shadow-sm"
                }`}
              >
                {button.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* People List */}
        {filteredPeople.length > 0 ? (
          <>
            {/* Results Info and Limit Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
            >
              <p className="text-slate-600 text-sm md:text-base font-medium">
                Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(endIndex, filteredPeople.length)}</span> of <span className="font-bold text-slate-900">{filteredPeople.length}</span> results
              </p>

              {/* Results Limit Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setIsLimitOpen(!isLimitOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-semibold text-sm hover:border-blue-600 hover:text-blue-600 hover:shadow-sm transition-all"
                >
                  Show {itemsPerPage === 999999 ? "All" : itemsPerPage}
                  <motion.div
                    animate={{ rotate: isLimitOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.button>

                {/* Dropdown Menu */}
                {isLimitOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 bg-white border-2 border-slate-300 shadow-lg z-10 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {[10, 20, 30, 50, { label: "All", value: 999999 }].map((option, optIdx) => {
                      const val = typeof option === 'number' ? option : option.value;
                      const label = typeof option === 'number' ? option : option.label;
                      return (
                        <motion.button
                          key={val}
                          onClick={() => {
                            setItemsPerPage(val);
                            setIsLimitOpen(false);
                            setCurrentPage(1);
                          }}
                          whileHover={{ x: 4 }}
                          whileTap={{ x: 2 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: optIdx * 0.03 }}
                          className={`w-full px-4 py-3 text-sm font-semibold text-left min-w-[120px] transition-colors ${
                            itemsPerPage === val
                              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {label}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* People Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              {paginatedPeople.map((person, idx) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
              >
                {/* Main Content Container */}
                <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 p-4 sm:p-5 md:p-6 lg:p-8">
                  {/* Left Content - Information */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {/* Name and Title */}
                    <motion.div 
                      className="mb-4 sm:mb-5 md:mb-6 pb-4 sm:pb-5 md:pb-6 border-b border-slate-200"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-1 sm:mb-2">
                        {person.fullName}
                      </h2>
                      <p className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base">
                        {person.roleDesignation}
                      </p>
                    </motion.div>

                    {/* Nationality */}
                    {person.nationality && (
                      <motion.div 
                        className="mb-4 sm:mb-5 md:mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1">
                          Nationality
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base">{person.nationality}</p>
                      </motion.div>
                    )}

                    {/* Educational Background */}
                    {person.educationBackground && (
                      <motion.div 
                        className="mb-4 sm:mb-5 md:mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">
                          Educational Background
                        </h3>
                        <div 
                          className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>p]:mb-2 [&>*]:text-inherit" 
                          dangerouslySetInnerHTML={{ __html: person.educationBackground }}
                        />
                      </motion.div>
                    )}

                    {/* Past Teaching Background */}
                    {person.pastTeachingBackground && (
                      <motion.div 
                        className="mb-4 sm:mb-5 md:mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">
                          Past Teaching Experience
                        </h3>
                        <div 
                          className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>p]:mb-2 [&>*]:text-inherit" 
                          dangerouslySetInnerHTML={{ __html: person.pastTeachingBackground }}
                        />
                      </motion.div>
                    )}

                    {/* Research Topic (Students) */}
                    {person.researchTopic && (
                      <motion.div 
                        className="mb-4 sm:mb-5 md:mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">
                          Research Topic
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                          {person.researchTopic}
                        </p>
                      </motion.div>
                    )}

                    {/* Graduation Years (Students) */}
                    {person.graduationYears && person.graduationYears.length > 0 && (
                      <motion.div 
                        className="mb-4 sm:mb-5 md:mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1">
                          Graduation Year
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base">{person.graduationYears[0]}</p>
                      </motion.div>
                    )}

                    {/* Conference Presentation (Students) */}
                    {person.conferencePresentation && (
                      <motion.div 
                        className="mb-4 sm:mb-5 md:mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.button
                          onClick={() => toggleExpand(person.id)}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider hover:text-blue-600 transition-colors"
                        >
                          Conference Presentations
                          <motion.div
                            animate={{ rotate: expandedIds.includes(person.id) ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown 
                              size={14} 
                            />
                          </motion.div>
                        </motion.button>
                        {expandedIds.includes(person.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>p]:mb-2 [&>*]:text-inherit"
                            dangerouslySetInnerHTML={{ __html: person.conferencePresentation }}
                          />
                        )}
                      </motion.div>
                    )}

                    {/* Publications (Professors) */}
                    {person.publications && person.publications.length > 0 && (
                      <motion.div 
                        className="mb-4 sm:mb-5 md:mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-2 sm:mb-3">
                          Publications
                        </h3>
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                          {person.publications.map((pub, pubIdx) => (
                            <motion.a
                              key={pubIdx}
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ x: 4 }}
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-xs sm:text-sm md:text-base group"
                            >
                              <span className="line-clamp-1">{pub.link}</span>
                              <motion.div
                                className="flex-shrink-0"
                                whileHover={{ x: 4 }}
                              >
                                <ExternalLink size={12} />
                              </motion.div>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Side: Profile Image and Actions */}
                  <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-5 w-full sm:w-80 lg:w-80 flex-shrink-0">
                    {/* Profile Image Container */}
                    <motion.div 
                      className="w-full"
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div 
                        className="aspect-video sm:aspect-square lg:h-72 overflow-hidden shadow-lg bg-slate-100 cursor-pointer"
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 30px rgba(0,0,0,0.15)" }}
                        transition={{ duration: 0.3 }}
                      >
                        {person.profileImage ? (
                          <motion.img
                            src={person.profileImage}
                            alt={person.fullName}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <motion.div 
                            className="w-full h-full flex items-center justify-center bg-slate-200"
                            whileHover={{ backgroundColor: "rgb(203, 213, 225)" }}
                          >
                            <Users className="text-slate-400" size={64} />
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>

                    {/* Social Links and CV Button Container */}
                    <motion.div 
                      className="w-full flex flex-col gap-3 sm:gap-3 md:gap-3 items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Social Links */}
                      {(person.linkedinUrl || person.twitterUrl || person.facebookUrl || person.instagramUrl) && (
                        <div className="w-full flex items-center gap-2 sm:gap-2.5 md:gap-3 justify-center pt-1">
                          {person.linkedinUrl && (
                            <motion.a
                              href={person.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-h-10"
                              title="LinkedIn"
                            >
                              <Linkedin size={18} className="sm:w-5 sm:h-5" />
                            </motion.a>
                          )}
                          {person.facebookUrl && (
                            <motion.a
                              href={person.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 0.4, delay: 0.15 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-h-10"
                              title="Facebook"
                            >
                              <Facebook size={18} className="sm:w-5 sm:h-5" />
                            </motion.a>
                          )}
                          {person.twitterUrl && (
                            <motion.a
                              href={person.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-h-10"
                              title="Twitter"
                            >
                              <Twitter size={18} className="sm:w-5 sm:h-5" />
                            </motion.a>
                          )}
                          {person.instagramUrl && (
                            <motion.a
                              href={person.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 0.4, delay: 0.25 }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center min-h-10"
                              title="Instagram"
                            >
                              <Instagram size={18} className="sm:w-5 sm:h-5" />
                            </motion.a>
                          )}
                        </div>
                      )}

                      {/* View CV Button */}
                      {(person.cvUrl || (person.cvLinks && person.cvLinks.length > 0)) && (
                        <motion.a
                          href={person.cvUrl || person.cvLinks?.[0]?.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          whileHover={{ scale: 1.02, backgroundColor: "rgb(239, 246, 255)" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 sm:px-4 md:px-5 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 group text-xs sm:text-sm md:text-base"
                        >
                          <span>View CV</span>
                          <motion.div
                            className="sm:w-4 sm:h-4"
                            whileHover={{ x: 4 }}
                          >
                            <ExternalLink size={14} />
                          </motion.div>
                        </motion.a>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 sm:mt-12 md:mt-14 pt-6 sm:pt-8 border-t border-slate-200"
              >
                <p className="text-slate-600 text-sm font-medium">
                  Page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    whileHover={currentPage > 1 ? { scale: 1.02 } : {}}
                    whileTap={currentPage > 1 ? { scale: 0.98 } : {}}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 hover:shadow-sm transition-all"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </motion.button>

                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 font-semibold text-sm transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-2 border-blue-600 shadow-md"
                            : "border-2 border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 hover:shadow-sm"
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    whileHover={currentPage < totalPages ? { scale: 1.02 } : {}}
                    whileTap={currentPage < totalPages ? { scale: 0.98 } : {}}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 hover:shadow-sm transition-all"
                  >
                    Next
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 sm:py-16 md:py-20"
          >
            <Users className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-500 mb-2">No people found</p>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base">Check back soon for more team members</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function PeoplePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center py-20 px-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    }>
      <PeoplePageContent />
    </Suspense>
  );
}
