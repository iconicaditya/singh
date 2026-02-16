"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Users } from "lucide-react";

interface Person {
  id: number;
  fullName: string;
  roleDesignation: string;
  profileImage: string;
}

export default function People() {
  const [peopleList, setPeopleList] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch("/api/people", { cache: 'no-store' });
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

  if (loading) {
    return (
      <section className="py-12 md:py-20 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        </div>
      </section>
    );
  }

  if (peopleList.length === 0) {
    return (
      <section className="py-12 md:py-20 px-4 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-600">No People Available</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">People</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mx-auto"></div>
        </motion.div>

        {/* People Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {peopleList.map((person, idx) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group"
              >
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  {person.profileImage ? (
                    <>
                      <img 
                        src={person.profileImage} 
                        alt={person.fullName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Users size={48} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 line-clamp-2 mb-2">
                    {person.fullName}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-blue-600 uppercase tracking-widest">
                    {person.roleDesignation}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
