"use client";

import { motion } from "framer-motion";
import { FolderKanban, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectsPreview() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );

  if (projects.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-blue-100"
          >
            <FolderKanban size={14} /> ACTIVE INITIATIVES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase"
          >
            Our Featured <span className="text-blue-600">Projects</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-2xl group active:scale-95"
          >
            EXPLORE ALL PROJECTS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
