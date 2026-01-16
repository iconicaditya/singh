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
      {/* Hero Header */}
      <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden bg-slate-900">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <Rocket size={80} className="text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-20 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/projects"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white font-black text-[10px] tracking-widest mb-10 transition-colors group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              BACK TO EXPLORE
            </Link>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-blue-600 px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase text-white shadow-xl shadow-blue-600/20">
                {project.category}
              </span>
              <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                project.status.toLowerCase() === 'completed' 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              }`}>
                {project.status}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 leading-[0.95] tracking-tighter max-w-5xl uppercase italic">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3 text-white/60">
                <Calendar size={18} className="text-blue-500" />
                <span className="text-xs font-black tracking-widest uppercase">{project.projectDate || "Ongoing"}</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <MapPin size={18} className="text-blue-500" />
                <span className="text-xs font-black tracking-widest uppercase">{project.location || "Singhabad Lab"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-24">
              
              {/* About Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                    <FileText size={22} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">About Project</h2>
                </div>
                <div 
                  className="prose prose-xl prose-slate max-w-none font-medium text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.aboutProject || project.description }}
                />
              </motion.div>

              {/* Objectives Section */}
              {project.projectObjectives && project.projectObjectives.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg text-white">
                      <Target size={22} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Key Objectives</h2>
                  </div>
                  <ul className="grid grid-cols-1 gap-4">
                    {project.projectObjectives.map((obj: string, i: number) => (
                      <li key={i} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-start group hover:border-blue-200 transition-colors">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">
                          {i + 1}
                        </span>
                        <p className="text-slate-700 font-bold leading-snug">{obj}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Linked Research Section */}
              {project.status.toLowerCase() === 'completed' && attachedResearch.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white">
                      <CheckCircle2 size={22} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Linked Research</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {attachedResearch.map((res) => (
                      <Link 
                        key={res.id}
                        href={`/research/${res.id}`}
                        className="p-8 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-xl transition-all group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase mb-2 block">
                              {res.category} • {res.year}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {res.title}
                            </h3>
                          </div>
                          <div className="flex-shrink-0 text-slate-400 group-hover:text-emerald-500 transition-all group-hover:translate-x-1">
                            <ExternalLink size={24} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <aside className="lg:col-span-4 space-y-12">
              
              {/* Team Section */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Users className="text-blue-600" size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight italic">Project Team</h3>
                </div>
                <div className="space-y-6">
                  {project.teamMembers && project.teamMembers.length > 0 ? project.teamMembers.map((member: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1">{member.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-400 text-sm font-bold">Research Team Members TBA</p>
                  )}
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Tag className="text-blue-500" size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tight italic">Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags ? project.tags.split(',').map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                      #{tag.trim()}
                    </span>
                  )) : (
                    <span className="text-white/40 text-xs italic">No tags assigned</span>
                  )}
                </div>
              </motion.div>

              {/* Share/External Link */}
              <div className="space-y-4 pt-6">
                {project.link && (
                  <a 
                    href={project.link}
                    target="_blank"
                    className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/30 text-xs tracking-widest uppercase"
                  >
                    <Globe size={20} />
                    Project Portal
                  </a>
                )}
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Project link copied!");
                  }}
                  className="w-full bg-white text-slate-900 border-2 border-slate-900 font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98] text-xs tracking-widest uppercase"
                >
                  <Share2 size={20} />
                  Share Research
                </button>
              </div>

            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}