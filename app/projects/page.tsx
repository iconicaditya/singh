"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, Search, Filter, X } from "lucide-react";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  status: string;
  category?: string;
}

export default function ProjectsPage() {
  const ITEMS_PER_PAGE = 18;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <main className="min-h-screen bg-white py-10 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Search and Filter Section */}
        <motion.div 
          className="mb-12 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Search Bar */}
          <div className="relative mb-5 sm:mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={18} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filters:</span>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors duration-300 text-sm font-medium text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors duration-300 text-sm font-medium text-gray-700"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            )}

            {/* Clear Filters */}
            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300 text-sm font-medium"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}

            {/* Results Count */}
            <span className="w-full sm:w-auto sm:ml-auto text-sm text-gray-600 font-medium">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                whileHover={{ 
                  y: -8, 
                  transition: { duration: 0.3, ease: "easeOut" } 
                }}
                className="bg-white overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 group h-full"
              >
                <Link href={`/projects/${project.id}`} target="_blank" rel="noopener noreferrer">
                  <div className="relative">
                    {/* Project Image */}
                    <div className="relative h-52 sm:h-60 lg:h-72 overflow-hidden">
                      {project.imageUrl ? (
                        <motion.img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                      )}
                    </div>

                    {/* Status Badge - Top Right */}
                    <motion.div 
                      className="absolute top-4 right-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                    >
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold uppercase">
                        {project.status}
                      </span>
                    </motion.div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 lg:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 underline decoration-2 underline-offset-4 decoration-black group-hover:decoration-4 transition-all duration-300 break-words">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 break-words">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-md text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-500 mb-4">
              {projects.length === 0 
                ? "Check back later for updates."
                : "Try adjusting your search or filters."}
            </p>
            {projects.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
