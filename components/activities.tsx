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
          {/* Left Content Area (Main Display) */}
          <div className="w-full md:w-2/3 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedActivity?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
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
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Link
                      href={`/activities/${selectedActivity?.id}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all group"
                    >
                      LEARN MORE ABOUT THIS ACTIVITY 
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar (List) */}
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
                {activities.map((activity, index) => (
                  <motion.button
                    key={activity.id}
                    onClick={() => setSelectedId(activity.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full text-left p-5 rounded-2xl transition-all border ${
                      selectedId === activity.id
                        ? "bg-blue-50 border-blue-200 shadow-md"
                        : "bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
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
                          <span className="text-xl font-black italic">{index + 1}</span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/all-activities"
                  className="flex items-center justify-between bg-[#1e293b] text-white p-5 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg group"
                >
                  ALL ACTIVITIES
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

