"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [startCol, setStartCol] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [trackX, setTrackX] = useState(0);
  const colRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const columnsPerView = 4;
  const rowsPerView = 2;
  const itemsPerView = columnsPerView * rowsPerView; // 8 items visible
  const incomingCols = 1; // render one extra column so it slides in from the right
  const gapPx = 24; // tailwind gap-6 = 1.5rem = 24px

  // Duplicate collaborators for seamless loop
  const duplicatedCollaborators = useMemo(
    () => [...collaborators, ...collaborators, ...collaborators],
    [collaborators],
  );
  
  // Group collaborators into columns (each column has 2 items: top and bottom)
  const columns: [Collaborator, Collaborator][] = useMemo(() => {
    const cols: [Collaborator, Collaborator][] = [];
    for (let i = 0; i < duplicatedCollaborators.length; i += 2) {
      const top = duplicatedCollaborators[i];
      const bottom = duplicatedCollaborators[i + 1] || duplicatedCollaborators[0];
      if (top && bottom) cols.push([top, bottom]);
    }
    return cols;
  }, [duplicatedCollaborators]);

  const maxStart = Math.max(0, columns.length - (columnsPerView + incomingCols));

  const getShiftPx = () => {
    const colWidth = colRef.current?.offsetWidth ?? 0;
    return colWidth + gapPx;
  };

  const slideNext = () => {
    if (isAnimating || columns.length === 0) return;
    const shift = getShiftPx();
    if (!shift) return;
    setIsAnimating(true);
    setTrackX(-shift);
  };

  const slidePrev = () => {
    if (isAnimating || columns.length === 0) return;
    const shift = getShiftPx();
    if (!shift) return;
    // For prev, we pre-decrement start, render, then slide from -shift back to 0
    setIsAnimating(true);
    setStartCol((prev) => (prev <= 0 ? maxStart : prev - 1));
    setTrackX(-shift);
    requestAnimationFrame(() => setTrackX(0));
  };

  // Auto-advance: wait 3s, then slide; repeat
  useEffect(() => {
    if (collaborators.length === 0 || columns.length === 0 || isPaused) return;
    if (isAnimating) return;

    const t = setTimeout(() => {
      slideNext();
    }, 3000);

    return () => clearTimeout(t);
  }, [collaborators.length, columns.length, isPaused, isAnimating]);

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

  // Render 4 visible columns + 1 incoming column for live sliding
  const windowColumns = columns.slice(startCol, startCol + columnsPerView + incomingCols);

  return (
    <section id="collaborators" className="scroll-mt-32 py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-2">
            {t("OUR_COLLABORATORS")} <span className="text-blue-600">{t("COLLABORATORS")}</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            {t("COLLABORATORS_DESCRIPTION")}
          </p>
        </motion.div>

        {/* Grid Container with Live Horizontal Sliding */}
        <div className="relative overflow-hidden mb-8" ref={containerRef}>
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <motion.div
              animate={{ x: trackX }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                // If we slid next (trackX negative), advance start and snap back to 0 without visual jump
                if (trackX < 0) {
                  setStartCol((prev) => (prev >= maxStart ? 0 : prev + 1));
                  setTrackX(0);
                }
                setIsAnimating(false);
              }}
              className="flex gap-6"
            >
              {windowColumns.map((column, colIndex) => (
                <div
                  // set ref only on first visible column to measure width
                  ref={colIndex === 0 ? colRef : undefined}
                  key={`col-${startCol}-${colIndex}`}
                  className="shrink-0 flex flex-col gap-6 w-[280px] md:w-[300px]"
                >
                  <CollaboratorCard collaborator={column[0]} />
                  <CollaboratorCard collaborator={column[1]} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={() => {
              setIsPaused(true);
              slidePrev();
              setTimeout(() => setIsPaused(false), 3500);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          </motion.button>
          
          <motion.button
            onClick={() => {
              setIsPaused(true);
              slideNext();
              setTimeout(() => setIsPaused(false), 3500);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 hover:text-blue-600" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function CollaboratorCard({ collaborator }: { collaborator: Collaborator }) {
  const cardContent = (
    <motion.div 
      className="relative h-[180px] w-full"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
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
        className="relative bg-white rounded-lg h-full w-full flex items-center justify-center p-8 border border-gray-200"
        whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
        transition={{ duration: 0.3 }}
        style={{
          zIndex: 1,
        }}
      >
        {/* Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {collaborator.logoUrl ? (
            <motion.div 
              className="relative w-full h-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={collaborator.logoUrl}
                alt={collaborator.companyName || "Collaborator logo"}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </motion.div>
          ) : collaborator.imageUrl ? (
            <motion.div 
              className="relative w-full h-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={collaborator.imageUrl}
                alt={collaborator.companyName || "Collaborator image"}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
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
