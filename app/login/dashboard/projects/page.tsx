"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layout,
  Loader2,
  FilterX
} from "lucide-react";
import ProjectForm from "@/components/projects/ProjectForm";

export default function DashboardProjectsPage() {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "completed">("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
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

  const filtered = projectsList.filter((project) => {
    const titleMatches = (project.title || "").toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedStatus = (project.status || "").toLowerCase();
    const statusMatches = statusFilter === "all" ? true : normalizedStatus === statusFilter;

    const projectDateString = project.startDate || project.createdAt;
    const projectDate = projectDateString ? new Date(projectDateString) : null;
    const isProjectDateValid = projectDate ? !Number.isNaN(projectDate.getTime()) : false;

    const fromDate = startDateFilter ? new Date(startDateFilter) : null;
    const toDate = endDateFilter ? new Date(endDateFilter) : null;

    const fromMatches = fromDate && isProjectDateValid ? projectDate! >= fromDate : true;
    const toMatches = toDate && isProjectDateValid ? projectDate! <= toDate : true;

    const dateMatches = fromDate || toDate
      ? isProjectDateValid && fromMatches && toMatches
      : true;

    return titleMatches && statusMatches && dateMatches;
  });

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDateFilter("");
    setEndDateFilter("");
  };

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 md:mb-8">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "ongoing" | "completed")}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm"
        >
          <option value="all">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm"
          placeholder="Start date"
        />

        <input
          type="date"
          value={endDateFilter}
          onChange={(e) => setEndDateFilter(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm"
          placeholder="End date"
        />

        <button
          type="button"
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold text-slate-600"
        >
          <FilterX size={16} /> Clear Filters
        </button>
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
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {filtered.map((proj, index) => (
            <div
              key={proj.id}
              className={`flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 ${index !== filtered.length - 1 ? "border-b border-slate-100" : ""}`}
            >
              <div className="w-full md:w-28 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                {proj.imageUrl ? (
                  <img src={proj.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-200"><Layout size={24} /></div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 truncate">{proj.title}</h3>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                    {proj.status || "ongoing"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{proj.description || "No summary"}</p>
              </div>

              <div className="flex items-center justify-end gap-2 md:ml-4">
                <button
                  onClick={() => { setEditingProject(proj); setIsFormOpen(true); }}
                  className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
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