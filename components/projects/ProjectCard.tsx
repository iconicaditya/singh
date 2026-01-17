"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Tag } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    category: string;
    description: string;
    imageUrl?: string;
    location?: string;
    status: string;
    tags?: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all h-[500px]"
    >
      {/* Image Container */}
      <div className="relative h-full w-full overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Content - Always Visible */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="mb-4">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full">
              {project.category}
            </span>
          </div>
          
          <h3 className="text-2xl font-black text-white mb-2 uppercase italic leading-tight group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          
          {project.location && (
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
              <MapPin size={14} className="text-blue-500" />
              {project.location}
            </div>
          )}

          {/* Hover Details */}
          <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
            <p className="text-slate-300 text-sm font-medium mb-6 line-clamp-3 italic">
              {project.description}
            </p>
            
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-2 text-white font-black text-xs tracking-widest uppercase hover:text-blue-400 transition-colors"
            >
              View Details <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
