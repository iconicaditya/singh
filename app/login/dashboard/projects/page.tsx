"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layout,
  Loader2,
  BookOpen,
  Filter,
  MoreVertical,
  Calendar,
  Tag,
  Users,
  ChevronRight,
  List,
  Grid,
  FilterX
} from "lucide-react";
import ProjectForm from "@/components/projects/ProjectForm";

export default function DashboardProjectsPage() {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: 'no-store' });
      const data = await res.json();
      setProjectsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = projectsList.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-0 bg-transparent text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Project <span className="text-blue-600">Management</span></h1>
          <p className="mt-1 md:mt-2 text-slate-500 font-medium text-sm md:text-base">Create and manage environmental research projects.</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setIsFormOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-blue-600 transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} className="md:w-5 md:h-5" /> Add New Project
        </button>
      </div>

      <div className="relative mb-6 md:mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-5 py-3 md:py-4 bg-white border border-slate-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm text-sm md:text-base"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24 md:py-32"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 md:py-24 bg-white rounded-2xl md:rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Layout className="text-slate-300 md:w-8 md:h-8" size={28} />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">No projects found</h3>
          <p className="text-sm md:text-base text-slate-500 font-medium px-4">Get started by creating your first research project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((proj) => (
            <div key={proj.id} className="group bg-white p-5 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col">
              <div className="aspect-video bg-slate-50 rounded-xl md:rounded-[2rem] mb-4 md:mb-6 overflow-hidden border border-slate-100 relative">
                {proj.imageUrl ? <img src={proj.imageUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-slate-200"><Layout size={40} /></div>}
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white/95 rounded-full text-[8px] md:text-[10px] font-bold uppercase text-blue-600 border border-white/50 shadow-sm">{proj.status}</span>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{proj.title}</h3>
              <p className="text-slate-500 text-xs md:text-sm mb-4 md:mb-6 line-clamp-3 font-medium">{proj.description}</p>
              <div className="flex justify-end gap-2 pt-4 md:pt-6 border-t border-slate-50 mt-auto">
                <button onClick={() => { setEditingProject(proj); setIsFormOpen(true); }} className="p-2 md:p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg md:rounded-xl transition-all"><Edit2 size={16} className="md:w-4.5 md:h-4.5" /></button>
                <button onClick={() => handleDelete(proj.id)} className="p-2 md:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg md:rounded-xl transition-all"><Trash2 size={16} className="md:w-4.5 md:h-4.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchProjects}
        initialData={editingProject}
      />
    </div>
  );
}