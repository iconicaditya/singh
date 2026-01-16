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

export default function AdminProjectsPage() {
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
    <div className="p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Project <span className="text-blue-600">Management</span></h1>
          <p className="mt-2 text-slate-500 font-medium">Create and manage environmental research projects.</p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all shadow-xl active:scale-95"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Layout className="text-slate-300" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500 font-medium">Get started by creating your first research project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((proj) => (
            <div key={proj.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col">
              <div className="aspect-video bg-slate-50 rounded-[2rem] mb-6 overflow-hidden border border-slate-100 relative">
                {proj.imageUrl ? <img src={proj.imageUrl} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-slate-200"><Layout size={48} /></div>}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/95 rounded-full text-[10px] font-bold uppercase text-blue-600 border border-white/50 shadow-sm">{proj.status}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{proj.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3 font-medium">{proj.description}</p>
              <div className="flex justify-end gap-2 pt-6 border-t border-slate-50 mt-auto">
                <button onClick={() => { setEditingProject(proj); setIsFormOpen(true); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(proj.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
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