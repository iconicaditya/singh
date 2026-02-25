"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

interface Collaborator {
  id: number;
  companyName?: string;
  logoUrl?: string;
  imageUrl?: string;
  website?: string;
}

export default function Collaborator() {
  const { t } = useLanguage();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // framer-motion variants for staggered grid appearance
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] } },
  };

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const res = await fetch("/api/collaborators");
        const data = await res.json();
        setCollaborators(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch collaborators:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  // simple responsive grid implementation — no carousel animation

  if (isLoading) {
    return (
      <section id="collaborators" className="scroll-mt-32 py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-2">
              {t("OUR_COLLABORATORS")} <span className="text-blue-600">{t("COLLABORATORS")}</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              {t("COLLABORATORS_DESCRIPTION")}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-slate-400">{t("LOADING")}</div>
          </div>
        </div>
      </section>
    );
  }

  if (collaborators.length === 0) {
    return null;
  }

  // Render a responsive grid of collaborators (no duplication)
  return (
    <section id="collaborators" className="scroll-mt-32 py-16 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-2">
            <span>Our </span>
            <span className="text-blue-600">Collaborators</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            {t("COLLABORATORS_DESCRIPTION")}
          </p>
        </motion.div>

        {/* Responsive Grid: auto-fit fills available space based on item count; rows equalized */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
          style={{ gridAutoRows: '1fr' }}
        >
          {collaborators.map((c, idx) => (
            <motion.div key={c.id} className="w-full" variants={itemVariants}>
              <CollaboratorCard collaborator={c} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CollaboratorCard({ collaborator }: { collaborator: Collaborator }) {
  const cardContent = (
    <motion.div 
      className="relative h-40 sm:h-44 md:h-48 w-full flex flex-col"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Subtle shadow behind the card */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          zIndex: 0,
        }}
      />

      {/* Main Card Container */}
      <motion.div 
        className="relative bg-white rounded-lg h-full w-full flex items-center justify-center p-6 sm:p-8 border border-gray-200"
        whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
        transition={{ duration: 0.25 }}
        style={{
          zIndex: 1,
        }}
        aria-label={collaborator.companyName || 'Collaborator'}
      >
        {/* Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {collaborator.logoUrl ? (
            <motion.div 
              className="relative flex items-center justify-center"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.25 }}
            >
                <div className="relative w-36 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 p-2">
                  <Image
                    src={collaborator.logoUrl}
                    alt={collaborator.companyName || "Collaborator logo"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={false}
                  />
                </div>
            </motion.div>
          ) : collaborator.imageUrl ? (
            <motion.div 
              className="relative flex items-center justify-center"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative w-36 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 p-2">
                <Image
                  src={collaborator.imageUrl}
                  alt={collaborator.companyName || "Collaborator image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={false}
                />
              </div>
            </motion.div>
          ) : (
            <div className="text-slate-300 flex flex-col items-center gap-2">
              <Building2 size={40} />
              {collaborator.companyName && (
                <span className="text-xs font-semibold text-center text-slate-400">
                  {collaborator.companyName}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  if (collaborator.website) {
    return (
      <a
        href={collaborator.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
