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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden">
        {project.imageUrl ? (
          <div className="absolute inset-0">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
              {project.category}
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
              {project.status}
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-2">
              <Calendar size={12} />
              {project.projectDate}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                {project.title}
              </h1>
              {project.location && (
                <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest">
                  <MapPin size={16} className="text-blue-400" />
                  {project.location}
                </div>
              )}
              {project.tags && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {project.tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="text-white/60 text-xs font-bold uppercase tracking-widest">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isCompleted && (
              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                <button 
                  onClick={handleViewResearch}
                  className="w-full md:w-64 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  View Research
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full md:w-64 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-sm tracking-wide hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-6 max-w-5xl py-20">
        <div className="space-y-20">
          {/* Overview */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase">Project Overview</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <div 
                className="text-lg text-slate-600 leading-relaxed rich-text-content"
                dangerouslySetInnerHTML={{ __html: project.aboutProject || project.description }}
              />
            </div>
          </section>

          {/* Key Objectives */}
          {project.projectObjectives && Array.isArray(project.projectObjectives) && project.projectObjectives.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Target size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase">Key Objectives</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {project.projectObjectives.map((obj: any, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-4 p-5 bg-[#F0F9F4] rounded-2xl border border-emerald-100"
                  >
                    <div className="shrink-0 text-emerald-600">
                      <CheckCircle2 size={24} />
                    </div>
                    <p className="text-slate-800 font-bold uppercase tracking-tight text-sm">
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
        .rich-text-content p { margin-bottom: 1.5rem; }
        .rich-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .rich-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}
