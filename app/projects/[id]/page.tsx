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
  Share2,
  Users,
  Target,
  FileText,
  MapPin,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [attachedResearch, setAttachedResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          const found = data.find((p: any) => p.id.toString() === params.id);
          if (found) {
            setProject(found);
            
            // If completed and has research IDs, fetch them
            if (found.status.toLowerCase() === 'completed' && found.attachedResearchIds?.length > 0) {
              const resResponse = await fetch('/api/research');
              if (resResponse.ok) {
                const resData = await resResponse.json();
                const matched = resData.filter((r: any) => found.attachedResearchIds.includes(r.id.toString()));
                setAttachedResearch(matched);
              }
            }
          } else {
            setError("Project not found.");
          }
        }
      } catch (err) {
        setError("An error occurred while loading project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Loading Project Assets</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
          <FileText size={40} className="text-red-500" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Project Not Found</h2>
        <p className="text-slate-500 max-w-md mb-10 font-medium">The project you are looking for might have been moved or archived.</p>
        <Link href="/projects" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
          <ArrowLeft size={18} /> BACK TO PROJECTS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500/30">
      {/* Page Header */}
      <section className="relative pt-40 pb-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Link 
              href="/projects"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-[10px] tracking-widest uppercase mb-12 transition-all group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Return to Research Projects
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase border border-blue-100">
                {project.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase border ${
                project.status?.toLowerCase() === 'completed' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {project.status}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-10 leading-tight tracking-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-10 py-10 border-y border-slate-100 mb-12">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</p>
                <p className="text-sm font-bold text-slate-900">{project.projectDate || "Ongoing"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                <p className="text-sm font-bold text-slate-900">{project.location || "Global Research Network"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Banner */}
      {project.imageUrl && (
        <section className="container mx-auto px-6 max-w-7xl -mt-12 mb-24">
          <div className="relative h-[60vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
            <Image src={project.imageUrl} alt={project.title} fill className="object-cover" priority />
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="pb-32 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Left: Main Content */}
            <div className="lg:col-span-8 space-y-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-8">Executive Summary</h3>
                <div 
                  className="prose prose-lg prose-slate max-w-none font-medium text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.aboutProject || project.description }}
                />
              </motion.div>

              {project.projectObjectives && project.projectObjectives.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-10">Strategic Objectives</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {project.projectObjectives.map((obj: string, i: number) => (
                      <div key={i} className="flex gap-6 p-8 bg-slate-50 rounded-3xl border border-slate-100 items-start group hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all">
                        <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white text-blue-600 flex items-center justify-center text-sm font-black shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-colors">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-slate-800 text-lg font-bold leading-snug">{obj}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {project.status?.toLowerCase() === 'completed' && attachedResearch.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-10">Scientific Output</h3>
                  <div className="space-y-4">
                    {attachedResearch.map((res) => (
                      <Link 
                        key={res.id}
                        href={`/research/${res.id}`}
                        className="flex items-center justify-between p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-xl transition-all group"
                      >
                        <div className="space-y-2">
                          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{res.category} • {res.year}</p>
                          <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{res.title}</h4>
                        </div>
                        <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Meta Info */}
            <aside className="lg:col-span-4 space-y-16">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Research Team</h3>
                  <div className="space-y-4">
                    {project.teamMembers && project.teamMembers.length > 0 ? project.teamMembers.map((member: any, i: number) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs border border-slate-200 shadow-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{member.name}</p>
                          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-60">{member.role}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs font-bold text-slate-400 uppercase italic tracking-wider">Team roster under review</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.split(',').map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      className="w-full h-16 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl text-[10px] tracking-widest uppercase"
                    >
                      Scientific Portal <ExternalLink size={16} />
                    </a>
                  )}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Project reference copied!");
                    }}
                    className="w-full h-16 bg-white text-slate-900 border-2 border-slate-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98] text-[10px] tracking-widest uppercase"
                  >
                    Cite Project <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}