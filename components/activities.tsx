"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Bell, Tag, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ContentSection {
  title: string;
  content: string;
  image?: string;
}

interface Activity {
  id: number;
  title: string;
  category: string;
  year: string;
  tags?: string;
  titleImage?: string;
  contentSections: ContentSection[];
  createdAt?: string;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 5;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/activities");
        const data = await res.json();
        setActivities(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivitiesList = activities.slice(indexOfFirstActivity, indexOfLastActivity);

  const selectedActivity = activities.find((a) => a.id === selectedId) || activities[0];

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (activities.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Sidebar (List) */}
          <div className="w-full md:w-1/3 pt-0">
            <div className="sticky top-24">
              <div className="mb-8">
                <motion.h3 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-black text-[#1e293b] flex items-center gap-2 uppercase tracking-tight"
                >
                  <Bell className="text-blue-600" size={20} />
                  Latest Updates
                </motion.h3>
                <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
              </div>

              <div className="space-y-4">
                {currentActivitiesList.map((activity, index) => {
                  const globalIndex = indexOfFirstActivity + index;
                  const isActive = selectedId === activity.id;
                  return (
                    <motion.button
                      key={activity.id}
                      onClick={() => setSelectedId(activity.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-blue-50 border-blue-600 shadow-lg scale-[1.02]"
                          : "bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 transition-colors ${isActive ? 'text-blue-700' : 'text-blue-600'}`}>
                            {activity.category}
                          </span>
                          <h4 className={`text-sm font-bold leading-snug transition-colors ${isActive ? 'text-blue-900' : 'text-[#1e293b]'}`}>
                            {activity.title}
                          </h4>
                        </div>
                        <div className="shrink-0">
                          {isActive ? (
                            <ChevronRight size={18} className="text-blue-600" />
                          ) : (
                            <span className="text-xl font-black italic text-gray-200">{globalIndex + 1}</span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border-2 border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-200 hover:bg-gray-50 transition-all"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all border-2 ${
                          currentPage === page
                            ? "bg-[#1e293b] border-[#1e293b] text-white shadow-lg"
                            : "bg-white border-gray-100 text-gray-400 hover:border-blue-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border-2 border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-200 hover:bg-gray-50 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area (Main Display) */}
          <div className="w-full md:w-2/3 relative min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedActivity?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-8"
              >
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src={selectedActivity?.titleImage || "/attached_assets/stock_images/professional_researc_2d676eab.jpg"}
                    alt={selectedActivity?.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      {selectedActivity?.category}
                    </span>
                  </div>
                </motion.div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                    <Calendar size={16} />
                    <span>{selectedActivity?.year}</span>
                    {selectedActivity?.tags && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                          <Tag size={14} /> {selectedActivity.tags}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-black text-[#1e293b] leading-[1.2]"
                  >
                    {selectedActivity?.title}
                  </motion.h2>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-blue max-w-none prose-lg"
                  >
                    {selectedActivity?.contentSections.map((section, idx) => (
                      <div key={idx} className="mb-8">
                        {section.title && <h3 className="text-2xl font-bold mb-4 text-[#1e293b]">{section.title}</h3>}
                        <div 
                          className="text-gray-600 leading-[1.8] activity-content text-lg"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .activity-content p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          text-align: justify;
        }
        .activity-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .activity-content li {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .activity-content * {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </section>
  );
}
      <style jsx global>{`
        .activity-content p {
          margin-bottom: 1rem;
        }
        .activity-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .activity-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </section>
  );
}

