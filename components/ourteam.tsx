"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  socialLinks: any;
}

export default function OurTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team");
        const data = await res.json();
        setTeam(data);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          >
            Our Professional <span className="text-blue-600">Team</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            Meet the dedicated minds driving our mission for a sustainable and resilient future.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto"
        >
          {team.map((member, index) => {
            // Calculate pseudo-random offsets for the "organic" scattered look in the image
            const offsets = [
              "mt-0", "mt-12", "mt-24", "mt-4", "mt-32", "mt-16"
            ];
            const offsetClass = offsets[index % offsets.length];

            return (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className={`relative group w-64 ${offsetClass}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md transition-all duration-500 group-hover:rounded-[2rem] group-hover:shadow-2xl">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="text-white"
                    >
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">{member.role}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
