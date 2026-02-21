"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string;
    status: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
    >
      <Link href={`/projects/${project.id}`}>
        <div className="relative">
          {/* Project Image */}
          <div className="relative h-72 overflow-hidden">
            {project.imageUrl ? (
              <motion.img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
            )}
          </div>

          {/* Status Badge - Top Right */}
          <div className="absolute top-4 right-4">
            <motion.span 
              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold uppercase"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {project.status}
            </motion.span>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 underline decoration-2 underline-offset-4 decoration-black">
              {project.title}
            </h3>
            {project.description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
