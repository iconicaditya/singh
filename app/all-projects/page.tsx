"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 16;

export default function AllProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-12 font-medium group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4">
            Our <span className="text-blue-600">Full Portfolio</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A comprehensive look at our commitment to a sustainable and resilient future.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold uppercase tracking-widest">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {visibleProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group"
              >
                <div className="relative h-48 overflow-hidden shrink-0">
                  <Image
                    src={project.imageUrl || "/projectimages/project_1.jpg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-blue-600 shadow-sm uppercase">
                      {project.tags?.split(',')[0] || "RESEARCH"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-black text-[#1e293b] mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className={`text-[10px] font-bold ${project.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
                      {project.status}
                    </span>
                    <Link href={`/all-projects/${project.id}`} className="flex items-center gap-1 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors">
                      VIEW PROJECT <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black transition-all ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110"
                    : "bg-white text-gray-400 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-6 h-12 rounded-2xl bg-white border border-gray-100 font-black text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
