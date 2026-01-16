"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Image as ImageIcon, User, Layout, Upload, Search, CheckCircle, Save, ArrowRight } from "lucide-react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

export default function ProjectForm({ isOpen, onClose, onSuccess, initialData }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [researchRecords, setResearchRecords] = useState<any[]>([]);
  const [researchSearch, setResearchSearch] = useState("");
  const [categories, setCategories] = useState<string[]>(["ENVIRONMENT", "SUSTAINABILITY", "WASTE MANAGEMENT"]);
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "ENVIRONMENT",
    anotherCategory: "",
    tags: "",
    teamMembers: [{ name: "", role: "" }],
    location: "",
    status: "ongoing",
    imageUrl: "",
    aboutProject: "",
    projectObjectives: "",
    attachedResearchIds: [] as number[],
    description: "", // Short description for list
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        teamMembers: initialData.teamMembers || [{ name: "", role: "" }],
        attachedResearchIds: initialData.attachedResearchIds || [],
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const res = await fetch("/api/research");
        const data = await res.json();
        setResearchRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) fetchResearch();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const data = await res.json();
      if (data.url) setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const addTeamMember = () => setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, { name: "", role: "" }] }));
  const removeTeamMember = (idx: number) => setFormData(prev => ({ ...prev, teamMembers: prev.teamMembers.filter((_, i) => i !== idx) }));

  const toggleResearch = (id: number) => {
    setFormData(prev => ({
      ...prev,
      attachedResearchIds: prev.attachedResearchIds.includes(id)
        ? prev.attachedResearchIds.filter(rid => rid !== id)
        : [...prev.attachedResearchIds, id]
    }));
  };

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    try {
      const method = initialData ? "PUT" : "POST";
      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialData ? { ...formData, id: initialData.id } : formData),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col text-slate-900">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold">Add New Project</h2>
            <p className="text-slate-500 text-sm">Design a professional project profile for the lab admin.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-12">
          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">1</span>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Project Title *</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Enter project title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Another Category (Optional)</label>
                <input
                  value={formData.anotherCategory}
                  onChange={e => setFormData({ ...formData, anotherCategory: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="Secondary category"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Tags (Comma Separated)</label>
                <input
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. LCA, Waste Management"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Location</label>
                <input
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="Project site or city"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold">Project Status *</label>
              <div className="flex gap-6">
                {["ongoing", "completed"].map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === s}
                      onChange={() => setFormData({ ...formData, status: s })}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="capitalize text-sm font-medium group-hover:text-blue-600 transition-colors">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold">Team Members</label>
              <div className="space-y-3">
                {formData.teamMembers.map((member, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      placeholder="Name"
                      value={member.name}
                      onChange={e => {
                        const newTeam = [...formData.teamMembers];
                        newTeam[idx].name = e.target.value;
                        setFormData({ ...formData, teamMembers: newTeam });
                      }}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                    <input
                      placeholder="Role"
                      value={member.role}
                      onChange={e => {
                        const newTeam = [...formData.teamMembers];
                        newTeam[idx].role = e.target.value;
                        setFormData({ ...formData, teamMembers: newTeam });
                      }}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                    <button type="button" onClick={() => removeTeamMember(idx)} className="p-2 text-slate-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addTeamMember} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                  <Plus size={16} /> Add Member
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 2: Media Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">2</span>
              Media Section
            </h3>
            <div className="flex items-start gap-6">
              <div className="w-48 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <Upload size={24} className="text-slate-300" />
                )}
              </div>
              <label className="cursor-pointer px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                <Upload size={18} />
                Upload Title Image
                <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 3: Project Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">3</span>
              Project Details
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">About Project</label>
              <div className="border border-slate-200 rounded-2xl overflow-hidden min-h-[300px]">
                <ReactQuill
                  theme="snow"
                  value={formData.aboutProject}
                  onChange={(v) => setFormData({ ...formData, aboutProject: v })}
                  modules={QUILL_MODULES}
                  placeholder="Detailed description of the project..."
                  className="h-64 mb-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Project Objectives</label>
              <textarea
                value={formData.projectObjectives}
                onChange={e => setFormData({ ...formData, projectObjectives: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-[120px]"
                placeholder="Bullet points or key objectives..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Short Description (for List View) *</label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-[100px]"
                placeholder="Brief overview for the project card..."
              />
            </div>
          </div>

          {/* Conditional Section: Attach Research */}
          {formData.status === "completed" && (
            <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="h-px bg-slate-100" />
              <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                <Layout size={20} />
                Attach Research
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={researchSearch}
                    onChange={e => setResearchSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    placeholder="Search research records..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {researchRecords
                    .filter(r => r.title.toLowerCase().includes(researchSearch.toLowerCase()))
                    .map(r => {
                      const isSelected = formData.attachedResearchIds.includes(r.id);
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => toggleResearch(r.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                            isSelected ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-sm font-bold line-clamp-1">{r.title}</span>
                          {isSelected && <CheckCircle size={18} />}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-10 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Save size={18} /> Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              Publish Project <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}