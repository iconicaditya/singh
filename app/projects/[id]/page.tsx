"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  Tag, 
  FileText,
  Target,
  CheckCircle2,
  Share2
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
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
          if (found.attachedResearchIds && Array.isArray(found.attachedResearchIds) && found.attachedResearchIds.length > 0) {
            const resRes = await fetch("/api/research");
            const resData = await resRes.json();
            const related = resData.filter((r: any) => 
              found.attachedResearchIds.includes(r.id.toString()) || 
              found.attachedResearchIds.includes(r.id) ||
              found.attachedResearchIds.includes(Number(r.id))
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
      <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase">Project Not Found</h2>
      <Link href="/projects" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center gap-3">
        <ArrowLeft size={16} /> Back to Repository
      </Link>
    </div>
  );

  const isCompleted = project.status?.toLowerCase() === 'completed';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleViewResearch = () => {
    if (relatedResearch.length > 0) {
      router.push(`/research/${relatedResearch[0].id}`);
    } else {
      router.push('/research');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-end overflow-hidden pb-12 md:pb-16">
        {project.imageUrl ? (
          <div className="absolute inset-0">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            {/* Dark transparency layer as per image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-950" />
        )}
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
            <div className="flex-1 w-full lg:max-w-4xl">
              {/* Category, Status, Date Pills */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
                <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-md">
                  {project.category}
                </span>
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-md">
                  {project.status}
                </span>
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-md flex items-center gap-2">
                  <Calendar size={12} className="shrink-0" />
                  {project.projectDate}
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-black text-white uppercase tracking-tighter mb-6 leading-[0.85] break-words">
                {project.title}
              </h1>

              <div className="space-y-4">
                {project.location && (
                  <div className="flex items-center gap-2 text-white/80 text-sm md:text-base font-bold uppercase tracking-[0.2em]">
                    <MapPin size={18} className="text-blue-500 shrink-0" />
                    <span>{project.location}</span>
                  </div>
                )}
                {project.tags && (
                  <div className="flex flex-wrap gap-4">
                    {project.tags.split(',').map((tag: string, i: number) => (
                      <span key={i} className="text-white text-xs md:text-sm font-black uppercase tracking-widest opacity-90">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isCompleted && (
              <div className="flex flex-col gap-3 shrink-0 w-full lg:w-72 mb-2">
                <button 
                  onClick={handleViewResearch}
                  className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40 active:scale-[0.98]"
                >
                  View Research
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full px-8 py-4 bg-white text-slate-900 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border border-transparent shadow-xl active:scale-[0.98]"
                >
                  <Share2 size={20} className="shrink-0" /> Share
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24">
        <div className="max-w-5xl">
          <div className="space-y-16 md:space-y-24">
            {/* Overview */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <FileText size={28} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Project Overview</h2>
              </div>
              <div className="prose prose-slate max-w-none">
                <div 
                  className="text-lg md:text-xl text-slate-600 leading-relaxed md:leading-loose rich-text-content overflow-hidden break-words"
                  dangerouslySetInnerHTML={{ __html: project.aboutProject || project.description }}
                />
              </div>
            </section>

          {/* Key Objectives */}
          {project.projectObjectives && Array.isArray(project.projectObjectives) && project.projectObjectives.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="p-2 md:p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <Target size={20} className="md:w-6 md:h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Key Objectives</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {project.projectObjectives.map((obj: any, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-4 p-4 md:p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-all"
                  >
                    <div className="shrink-0 text-emerald-600 mt-0.5">
                      <CheckCircle2 size={20} className="md:w-6 md:h-6" />
                    </div>
                    <p className="text-slate-800 font-bold uppercase tracking-tight text-xs md:text-sm leading-snug">
                      {obj.title || obj}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <style jsx global>{`
        .rich-text-content p { margin-bottom: 1.25rem; }
        .rich-text-content ul { list-style-type: disc; margin-left: 1.25rem; margin-bottom: 1.25rem; }
        .rich-text-content ol { list-style-type: decimal; margin-left: 1.25rem; margin-bottom: 1.25rem; }
        @media (min-width: 768px) {
          .rich-text-content p { margin-bottom: 1.5rem; }
          .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
          .rich-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
