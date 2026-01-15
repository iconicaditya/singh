"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Loader2,
  Rocket,
  Layout,
  Globe,
  Share2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          const found = data.find((p: any) => p.id.toString() === params.id);
          if (found) {
            setProject(found);
          } else {
            setError("Project not found.");
          }
        }
      } catch (err) {
        setError("An error occurred while loading the project.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">{error || "Project Not Found"}</h2>
        <Link href="/projects" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
          <ArrowLeft size={20} /> RETURN TO PROJECTS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500/30">
      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
              <Rocket size={64} className="text-slate-200" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              href="/projects"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold mb-8 transition-colors group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              BACK TO PROJECTS
            </Link>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-lg">
                {project.status}
              </span>
              {project.tags && project.tags.split(',').map((tag: string) => (
                <span key={tag} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/20 uppercase tracking-widest">
                  #{tag.trim()}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter max-w-4xl">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                    <Layout className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Overview</h2>
                </div>

                <div className="text-slate-600 text-xl leading-relaxed font-medium">
                  {project.description}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12">
                  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Started At</p>
                      <p className="text-lg font-bold text-slate-900">
                        {new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Globe className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Impact Scope</p>
                      <p className="text-lg font-bold text-slate-900">Global / Regional</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <aside className="lg:col-span-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group sticky top-24"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-10 text-white tracking-tight leading-none italic uppercase text-center">Resources</h3>
                  <div className="space-y-4">
                    {project.link && (
                      <a 
                        href={project.link}
                        target="_blank"
                        className="w-full bg-blue-600 text-white font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 text-xs tracking-widest uppercase"
                      >
                        <ExternalLink size={22} />
                        Live Demo
                      </a>
                    )}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Project link copied!");
                      }}
                      className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-black py-6 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-[0.98] text-xs tracking-widest uppercase"
                    >
                      <Share2 size={22} />
                      Share Project
                    </button>
                  </div>
                </div>
                <div className="absolute -right-10 -top-10 w-56 h-56 bg-blue-600/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-[1.5s]" />
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}