"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, MapPin, ArrowLeft, ArrowRight, Loader2, Calendar, User, Tag, ChevronRight, FileText } from "lucide-react";
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
          // Fetch research to match related IDs
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
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Project Not Found</h2>
      <Link href="/projects" className="text-blue-600 font-bold hover:underline">Back to Projects</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-end overflow-hidden bg-slate-900">
        {project.imageUrl && (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 max-w-7xl relative pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                {project.category}
              </span>
              <div className="flex items-center text-white/90 text-[10px] font-bold uppercase tracking-widest">
                <Calendar size={12} className="mr-2 text-blue-400" />
                {project.projectDate || "Ongoing"}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase italic leading-tight">
              {project.title}
            </h1>

            {project.location && (
              <div className="flex items-center gap-2 text-white/70 text-sm font-bold uppercase tracking-widest">
                <MapPin size={16} className="text-blue-500" />
                {project.location}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-6 max-w-7xl py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <main className="lg:w-2/3">
            <div className="prose prose-slate max-w-none mb-20">
              <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase italic">About Project</h2>
              <div 
                className="text-lg text-slate-600 leading-relaxed italic rich-text-content"
                dangerouslySetInnerHTML={{ __html: project.aboutProject || project.description }}
              />
            </div>

            <style jsx global>{`
              .rich-text-content p { margin-bottom: 1.5rem; }
              .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
              .rich-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
            `}</style>

            {project.projectObjectives && Array.isArray(project.projectObjectives) && project.projectObjectives.length > 0 && (
              <div className="mb-20">
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase italic">Objectives</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.projectObjectives.map((obj: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <p className="font-bold text-slate-700 italic">{obj.title || obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Research Integration */}
            {relatedResearch.length > 0 && (
              <div className="mt-20 pt-20 border-t border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-10 uppercase italic">Related Research</h2>
                <div className="space-y-6">
                  {relatedResearch.map((res: any) => (
                    <Link 
                      key={res.id} 
                      href={`/research/${res.id}`}
                      className="group flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all shadow-sm">
                          <FileText size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Scholarly Paper</p>
                          <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors uppercase italic">{res.title}</h3>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                        <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Status Details</h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Status</span>
                    <span className="px-4 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Year</span>
                    <span className="text-white text-xs font-black tracking-widest uppercase">{project.projectDate || "2026"}</span>
                  </div>
                </div>
              </div>

              {project.teamMembers && Array.isArray(project.teamMembers) && project.teamMembers.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Team Members</h4>
                  <div className="space-y-4">
                    {project.teamMembers.map((member: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                          {member.name?.[0] || "T"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase italic">{member.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link 
                href="/projects"
                className="flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest py-4 border border-slate-100 rounded-2xl"
              >
                <ArrowLeft size={14} /> Back to Repository
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
