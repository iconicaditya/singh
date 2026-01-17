"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  User, 
  Tag, 
  ChevronRight, 
  FileText,
  Target,
  Users,
  Info,
  Clock,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedResearch, setRelatedResearch] = useState<any[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const found = data.find((p: any) => p.id.toString() === params.id);
        
        if (found) {
          setProject(found);
          if (found.attachedResearchIds && Array.isArray(found.attachedResearchIds)) {
            const resRes = await fetch("/api/research");
            const resData = await resRes.json();
            const related = resData.filter((r: any) => 
              found.attachedResearchIds.includes(r.id.toString()) || 
              found.attachedResearchIds.includes(r.id)
            );
            setRelatedResearch(related);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Project Profile</p>
      </div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 text-slate-200">
        <Info size={40} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Project Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md font-medium">The research project you are looking for might have been moved or archived.</p>
      <Link href="/projects" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center gap-3">
        <ArrowLeft size={16} /> Back to Repository
      </Link>
    </div>
  );

  const statusColor = project.status?.toLowerCase() === 'completed' ? 'bg-emerald-500' : 'bg-blue-600';

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[70vh] flex items-end overflow-hidden bg-slate-950">
        {project.imageUrl ? (
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-950" />
        )}
        
        {/* Advanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-grid-white/[0.03] -z-0" />
        
        <div className="container mx-auto px-6 max-w-7xl relative pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-blue-600/20">
                {project.category}
              </span>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
                {project.status || "Ongoing"}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={14} className="text-blue-400" />
                {project.projectDate || "EST. 2026"}
              </div>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.9] drop-shadow-2xl">
              {project.title}
            </h1>

            {project.location && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 text-white/60 text-sm font-bold uppercase tracking-[0.2em]"
              >
                <div className="w-10 h-[1px] bg-blue-500" />
                <MapPin size={18} className="text-blue-500" />
                {project.location}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="container mx-auto px-6 max-w-7xl py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Column: Content */}
          <main className="lg:w-[65%] space-y-24">
            {/* Overview Section */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                  <Info size={24} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Project Overview</h2>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <div 
                  className="text-xl text-slate-600 leading-[1.8] font-medium rich-text-content first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left"
                  dangerouslySetInnerHTML={{ __html: project.aboutProject || project.description }}
                />
              </div>
            </section>

            {/* Objectives Section */}
            {project.projectObjectives && Array.isArray(project.projectObjectives) && project.projectObjectives.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <Target size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Key Objectives</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {project.projectObjectives.map((obj: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="group bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-start gap-6 transition-all hover:bg-white hover:shadow-2xl hover:border-emerald-200"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 opacity-50">Objective {idx + 1}</p>
                        <p className="text-lg font-bold text-slate-800 leading-tight italic">{obj.title || obj}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Research */}
            {relatedResearch.length > 0 && (
              <section className="pt-20 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <FileText size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Scientific Context</h2>
                </div>
                
                <div className="space-y-4">
                  {relatedResearch.map((res: any) => (
                    <Link 
                      key={res.id} 
                      href={`/research/${res.id}`}
                      className="group flex flex-col md:flex-row items-center justify-between p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
                      
                      <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <FileText size={32} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Technical Paper</p>
                          <h3 className="font-black text-slate-900 text-xl group-hover:text-blue-600 transition-colors uppercase italic leading-tight max-w-md">{res.title}</h3>
                        </div>
                      </div>
                      
                      <div className="mt-6 md:mt-0 flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-all relative z-10">
                        Access Findings
                        <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                          <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Right Column: Sidebar */}
          <aside className="lg:w-[35%] space-y-10">
            <div className="sticky top-32 space-y-10">
              {/* Meta Stats */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-950 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-10 border-b border-white/10 pb-4">Project Taxonomy</h4>
                
                <div className="space-y-10">
                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Clock size={18} />
                      </div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Duration</span>
                    </div>
                    <span className="text-white text-xs font-black tracking-widest uppercase">{project.projectDate || "Ongoing"}</span>
                  </div>

                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Tag size={18} />
                      </div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Category</span>
                    </div>
                    <span className="text-white text-xs font-black tracking-widest uppercase italic">{project.category}</span>
                  </div>

                  {project.tags && (
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.split(',').map((tag: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Research Team */}
              {project.teamMembers && Array.isArray(project.teamMembers) && project.teamMembers.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                      <Users size={18} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Principal Investigators</h4>
                  </div>
                  
                  <div className="space-y-4">
                    {project.teamMembers.map((member: any, idx: number) => (
                      <div key={idx} className="group flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black text-lg border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {member.name?.[0] || "T"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase italic group-hover:text-blue-600 transition-colors">{member.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Navigation Actions */}
              <div className="grid grid-cols-1 gap-4">
                <Link 
                  href="/projects"
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-[10px] font-black text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all uppercase tracking-[0.3em]"
                >
                  <ArrowLeft size={16} /> Repository Catalog
                </Link>
                {project.link && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black hover:bg-blue-700 transition-all uppercase tracking-[0.3em] shadow-xl shadow-blue-200"
                  >
                    External Documentation <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400;1,900&display=swap');
        
        .rich-text-content {
          font-family: 'Playfair Display', serif;
        }
        .rich-text-content p { margin-bottom: 2rem; }
        .rich-text-content ul { list-style-type: none; margin-left: 0; margin-bottom: 2rem; }
        .rich-text-content ul li { position: relative; padding-left: 2rem; margin-bottom: 1rem; }
        .rich-text-content ul li::before { 
          content: ''; 
          position: absolute; 
          left: 0; 
          top: 0.7em; 
          width: 0.8rem; 
          height: 2px; 
          background: #2563eb; 
        }
        .rich-text-content ol { list-style-type: decimal; margin-left: 2rem; margin-bottom: 2rem; }
        .rich-text-content a { color: #2563eb; font-weight: 900; text-decoration: underline; text-underline-offset: 4px; }
      `}</style>
    </div>
  );
}
