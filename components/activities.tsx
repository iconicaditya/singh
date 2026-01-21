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
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sidebar (List) */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-24">
              <div className="mb-8">
                <h3 className="text-xl font-black text-[#1e293b] flex items-center gap-2 uppercase tracking-tight">
                  <Bell className="text-blue-600" size={20} />
                  Latest Updates
                </h3>
                <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
              </div>

              <div className="space-y-4">
                {currentActivitiesList.map((activity, index) => {
                  const globalIndex = indexOfFirstActivity + index;
                  return (
                    <motion.button
                      key={activity.id}
                      onClick={() => setSelectedId(activity.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-full text-left p-5 rounded-2xl transition-all border ${
                        selectedId === activity.id
                          ? "bg-blue-50 border-blue-200 shadow-md"
                          : "bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 text-right md:text-left">
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">
                            {activity.category}
                          </span>
                          <h4 className="text-sm font-bold text-[#1e293b] line-clamp-2 leading-snug">
                            {activity.title}
                          </h4>
                        </div>
                        <div className="text-gray-300 shrink-0">
                          {selectedId === activity.id ? (
                            <ChevronRight size={18} className="text-blue-600" />
                          ) : (
                            <span className="text-xl font-black italic">{globalIndex + 1}</span>
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
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          currentPage === page
                            ? "bg-[#1e293b] text-white shadow-lg"
                            : "bg-white border border-gray-100 text-gray-400 hover:border-blue-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area (Main Display) */}
          <div className="w-full md:w-2/3 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedActivity?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={selectedActivity?.titleImage || "/attached_assets/stock_images/professional_researc_2d676eab.jpg"}
                    alt={selectedActivity?.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      {selectedActivity?.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
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
                  <h2 className="text-3xl md:text-4xl font-black text-[#1e293b] leading-tight">
                    {selectedActivity?.title}
                  </h2>
                  <div className="prose prose-blue max-w-none">
                    {selectedActivity?.contentSections.map((section, idx) => (
                      <div key={idx} className="mb-6">
                        {section.title && <h3 className="text-xl font-bold mb-2">{section.title}</h3>}
                        <div 
                          className="text-gray-600 leading-relaxed text-lg activity-content"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
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

