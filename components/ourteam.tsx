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
  socialLinks: Record<string, string>;
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
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 60,
      rotate: -5
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
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
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-medium text-slate-900 mb-4 tracking-tight"
          >
            Staff
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-xl text-lg leading-relaxed"
          >
            Our team brings a wealth of experience from some of the world's most 
            formidable production studios, agencies and startups.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative min-h-[600px] flex flex-wrap justify-center items-start gap-4"
        >
          {team.map((member, index) => {
            // Precise positional offsets for the "Stink Studios" organic look
            const positionClasses = [
              "mt-20",    // Member 1
              "mt-44",    // Member 2
              "mt-0",     // Member 3 (higher up)
              "mt-64",    // Member 4 (lower down)
              "mt-12",    // Member 5
              "mt-80",    // Member 6
              "mt-32",    // Member 7
            ];
            
            const mobileStyles = "w-[45%] md:w-[22%] lg:w-[15%]";
            const offsetClass = positionClasses[index % positionClasses.length];

            return (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className={`relative group ${mobileStyles} ${offsetClass} transition-all duration-700`}
              >
                <div className="relative aspect-[4/5] overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Minimal Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                    <div className="text-white">
                      <h3 className="text-sm font-bold truncate">{member.name}</h3>
                      <p className="text-[10px] uppercase tracking-tighter opacity-80">{member.role}</p>
                    </div>
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
