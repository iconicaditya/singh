"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Users, Linkedin, Twitter, Facebook, Instagram, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";

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

export default function PeoplePage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "professor";
  
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(roleParam);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

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
  );

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

  const stripHtmlTags = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
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
          className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Users className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 sm:mb-3">Our People</h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Meet our dedicated team of researchers, professors, and students working towards excellence
          </p>
        </motion.div>

        {/* Role Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-10 sm:mb-12 md:mb-14 lg:mb-16"
        >
          {roleButtons.map((button) => (
            <button
              key={button.key}
              onClick={() => setActiveRole(button.key)}
              className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                activeRole === button.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                  : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
              }`}
            >
              {button.label}
            </button>
          ))}
        </motion.div>

        {/* People List */}
        {filteredPeople.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {filteredPeople.map((person, idx) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
              >
                {/* Main Content Container */}
                <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 p-4 sm:p-5 md:p-6 lg:p-8">
                  {/* Left Content - Information */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {/* Name and Title */}
                    <div className="mb-4 sm:mb-5 md:mb-6 pb-4 sm:pb-5 md:pb-6 border-b border-slate-200">
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-1 sm:mb-2">
                        {person.fullName}
                      </h2>
                      <p className="text-blue-600 font-semibold text-xs sm:text-sm md:text-base">
                        {person.roleDesignation}
                      </p>
                    </div>

                    {/* Nationality */}
                    {person.nationality && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1">
                          Nationality
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base">{person.nationality}</p>
                      </div>
                    )}

                    {/* Educational Background */}
                    {person.educationBackground && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">
                          Educational Background
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                          {stripHtmlTags(person.educationBackground)}
                        </p>
                      </div>
                    )}

                    {/* Past Teaching Background */}
                    {person.pastTeachingBackground && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">
                          Past Teaching Experience
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                          {stripHtmlTags(person.pastTeachingBackground)}
                        </p>
                      </div>
                    )}

                    {/* Research Topic (Students) */}
                    {person.researchTopic && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1 sm:mb-2">
                          Research Topic
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                          {person.researchTopic}
                        </p>
                      </div>
                    )}

                    {/* Graduation Years (Students) */}
                    {person.graduationYears && person.graduationYears.length > 0 && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-1">
                          Graduation Year
                        </h3>
                        <p className="text-slate-700 text-xs sm:text-sm md:text-base">{person.graduationYears[0]}</p>
                      </div>
                    )}

                    {/* Conference Presentation (Students) */}
                    {person.conferencePresentation && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <button
                          onClick={() => toggleExpand(person.id)}
                          className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider hover:text-blue-600 transition-colors"
                        >
                          Conference Presentations
                          <ChevronDown 
                            size={14} 
                            className={`transition-transform duration-300 ${expandedIds.includes(person.id) ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {expandedIds.includes(person.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed"
                          >
                            {stripHtmlTags(person.conferencePresentation)}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Publications (Professors) */}
                    {person.publications && person.publications.length > 0 && (
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-600 uppercase tracking-wider mb-2 sm:mb-3">
                          Publications
                        </h3>
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                          {person.publications.map((pub, pubIdx) => (
                            <a
                              key={pubIdx}
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-xs sm:text-sm md:text-base group"
                            >
                              <span className="line-clamp-1">{pub.link}</span>
                              <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Profile Image and Actions */}
                  <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-5 w-full sm:w-80 lg:w-80 flex-shrink-0">
                    {/* Profile Image Container */}
                    <div className="w-full">
                      <div className="aspect-video sm:aspect-square lg:h-72 overflow-hidden shadow-lg bg-slate-100">
                        {person.profileImage ? (
                          <img
                            src={person.profileImage}
                            alt={person.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <Users className="text-slate-400" size={64} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Links and CV Button Container */}
                    <div className="w-full flex flex-col gap-3 sm:gap-3 md:gap-3 items-center">
                      {/* Social Links */}
                      {(person.linkedinUrl || person.twitterUrl || person.facebookUrl || person.instagramUrl) && (
                        <div className="w-full flex items-center gap-2 sm:gap-2.5 md:gap-3 justify-center pt-1">
                          {person.linkedinUrl && (
                            <a
                              href={person.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 flex items-center justify-center min-h-10"
                              title="LinkedIn"
                            >
                              <Linkedin size={18} className="sm:w-5 sm:h-5" />
                            </a>
                          )}
                          {person.facebookUrl && (
                            <a
                              href={person.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 flex items-center justify-center min-h-10"
                              title="Facebook"
                            >
                              <Facebook size={18} className="sm:w-5 sm:h-5" />
                            </a>
                          )}
                          {person.twitterUrl && (
                            <a
                              href={person.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 flex items-center justify-center min-h-10"
                              title="Twitter"
                            >
                              <Twitter size={18} className="sm:w-5 sm:h-5" />
                            </a>
                          )}
                          {person.instagramUrl && (
                            <a
                              href={person.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 p-2 sm:p-2.5 md:p-2.5 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 flex items-center justify-center min-h-10"
                              title="Instagram"
                            >
                              <Instagram size={18} className="sm:w-5 sm:h-5" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* View CV Button */}
                      {(person.cvUrl || (person.cvLinks && person.cvLinks.length > 0)) && (
                        <a
                          href={person.cvUrl || person.cvLinks?.[0]?.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 sm:px-4 md:px-5 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 group text-xs sm:text-sm md:text-base"
                        >
                          <span>View CV</span>
                          <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform sm:w-4 sm:h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
