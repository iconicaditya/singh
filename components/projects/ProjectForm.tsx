"use client";

import { X, Plus, Trash2, Loader2, Upload, Calendar, MapPin, Tag, ChevronDown, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-50 animate-pulse rounded-xl border border-slate-200" />
});
import 'react-quill-new/dist/quill.snow.css';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

const CATEGORIES = ["ENVIRONMENT", "SUSTAINABILITY", "WARE MANAGEMENT", "CONSERVATION", "RENEWABLE ENERGY"];

export default function ProjectForm({ isOpen, onClose, onSuccess, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "ENVIRONMENT",
    projectDate: new Date().toISOString().split('T')[0],
    tags: "",
    location: "",
    status: "ongoing",
    teamMembers: [] as { name: string; role: string }[],
    imageUrl: "",
    aboutProject: "",
    projectObjectives: [] as string[],
    description: "" // Short description used in cards
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "ENVIRONMENT",
        projectDate: initialData.projectDate || new Date().toISOString().split('T')[0],
        tags: initialData.tags || "",
        location: initialData.location || "",
        status: initialData.status || "ongoing",
        teamMembers: Array.isArray(initialData.teamMembers) ? initialData.teamMembers : [],
        imageUrl: initialData.imageUrl || "",
        aboutProject: initialData.aboutProject || "",
        projectObjectives: Array.isArray(initialData.projectObjectives) ? initialData.projectObjectives : [],
        description: initialData.description || ""
      });
    } else {
      setFormData({
        title: "",
        category: "ENVIRONMENT",
        projectDate: new Date().toISOString().split('T')[0],
        tags: "",
        location: "",
        status: "ongoing",
        teamMembers: [],
        imageUrl: "",
        aboutProject: "",
        projectObjectives: [],
        description: ""
      });
    }
  }, [initialData, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: "", role: "" }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: 'name' | 'role', value: string) => {
    const newMembers = [...formData.teamMembers];
    newMembers[index][field] = value;
    setFormData(prev => ({ ...prev, teamMembers: newMembers }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      projectObjectives: [...prev.projectObjectives, ""]
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projectObjectives: prev.projectObjectives.filter((_, i) => i !== index)
    }));
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.projectObjectives];
    newObjectives[index] = value;
    setFormData(prev => ({ ...prev, projectObjectives: newObjectives }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = '/api/projects';
      const method = initialData?.id ? 'PUT' : 'POST';
      
      // Auto-generate short description if empty
      const submissionData = {
        ...formData,
        description: formData.description || (formData.aboutProject.replace(/<[^>]*>/g, '').substring(0, 150) + '...'),
        id: initialData?.id
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        const error = await res.json();
        alert(error.details || "Failed to save project");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving the project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 relative flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-md z-10 rounded-t-3xl">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Project</h2>
              <p className="text-slate-500 text-sm mt-1 font-medium">Design a professional project profile for the lab admin.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-thin scrollbar-thumb-slate-200">
            
            {/* 1. Basic Information */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                <h3 className="text-lg font-black text-slate-900">Basic Information</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Project Title *</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                    placeholder="Enter project title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-slate-700">Category *</label>
                      <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-wider hover:underline">+ ADD CATEGORY</button>
                    </div>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 appearance-none transition-all"
                      >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {CATEGORIES.slice(0, 3).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, category: cat }))}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all border ${
                            formData.category === cat 
                              ? "bg-blue-600 border-blue-600 text-white" 
                              : "bg-white border-slate-200 text-slate-400 hover:border-blue-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Project Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.projectDate}
                        onChange={e => setFormData({ ...formData, projectDate: e.target.value })}
                        required
                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 appearance-none transition-all"
                      />
                      <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Tags (Comma Separated)</label>
                    <div className="relative">
                      <input
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-5 py-4 pl-12 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                        placeholder="e.g. LCA, Waste Management"
                      />
                      <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Location</label>
                    <div className="relative">
                      <input
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-5 py-4 pl-12 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                        placeholder="Project site or city"
                      />
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 ml-1">Project Status *</label>
                  <div className="flex gap-8 px-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="status"
                          checked={formData.status === 'ongoing'}
                          onChange={() => setFormData({ ...formData, status: 'ongoing' })}
                          className="w-5 h-5 border-2 border-slate-200 rounded-full appearance-none checked:border-blue-600 transition-all cursor-pointer"
                        />
                        {formData.status === 'ongoing' && <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Ongoing</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="status"
                          checked={formData.status === 'completed'}
                          onChange={() => setFormData({ ...formData, status: 'completed' })}
                          className="w-5 h-5 border-2 border-slate-200 rounded-full appearance-none checked:border-blue-600 transition-all cursor-pointer"
                        />
                        {formData.status === 'completed' && <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Completed</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Team Members */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Team Members</h3>
              </div>

              <div className="space-y-4">
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                      <input
                        value={member.name}
                        onChange={e => updateTeamMember(index, 'name', e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-500 outline-none font-semibold text-sm transition-all"
                        placeholder="Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                      <input
                        value={member.role}
                        onChange={e => updateTeamMember(index, 'role', e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-500 outline-none font-semibold text-sm transition-all"
                        placeholder="Role"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="p-3.5 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="flex items-center gap-2 text-blue-600 font-black text-[10px] tracking-widest uppercase hover:underline py-2"
                >
                  <Plus size={16} /> Add Member
                </button>
              </div>
            </section>

            {/* 2. Media Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                <h3 className="text-lg font-black text-slate-900">Media Section</h3>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-48 h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <label className="cursor-pointer text-white text-[10px] font-black uppercase tracking-widest p-2">Change
                           <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                         </label>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      <Upload size={24} />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <Loader2 className="animate-spin text-blue-600" size={24} />
                    </div>
                  )}
                </div>
                
                <label className="cursor-pointer bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-3">
                  <Upload size={16} className="text-slate-400" />
                  {isUploading ? "Uploading..." : "Upload Title Image"}
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </section>

            {/* About Project */}
            <section className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">About Project</h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.aboutProject}
                  onChange={(val) => setFormData({ ...formData, aboutProject: val })}
                  placeholder="Detailed description of the project..."
                  className="h-64"
                />
              </div>
              <style jsx global>{`
                .quill { display: flex; flex-direction: column; }
                .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #f1f5f9; padding: 12px; background: #fafafa; }
                .ql-container.ql-snow { border: none; flex: 1; font-family: inherit; font-size: 14px; }
                .ql-editor { min-height: 200px; padding: 20px; color: #1e293b; }
                .ql-editor.ql-blank::before { color: #94a3b8; font-style: normal; font-weight: 500; }
              `}</style>
            </section>

            {/* Project Objectives */}
            <section className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Project Objectives</h3>
              <div className="space-y-4">
                {formData.projectObjectives.map((objective, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <textarea
                        value={objective}
                        onChange={e => updateObjective(index, e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-500 outline-none font-semibold text-sm transition-all resize-none"
                        placeholder={`Objective ${index + 1}`}
                        rows={1}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addObjective}
                  className="flex items-center gap-2 text-blue-600 font-black text-[10px] tracking-widest uppercase hover:underline py-2"
                >
                  <Plus size={16} /> Add Objective
                </button>
              </div>
            </section>

            {/* Footer Buttons */}
            <div className="flex gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4 z-10 border-t border-slate-50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-200 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || isSubmitting}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {initialData ? "Update Project" : "Create Project"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
