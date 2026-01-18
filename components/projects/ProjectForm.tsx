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

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'align',
  'list', 'bullet',
  'link'
];

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
    description: "", // Short description used in cards
    attachedResearchIds: [] as number[]
  });

  const [availableResearch, setAvailableResearch] = useState<any[]>([]);
  const [researchSearch, setResearchSearch] = useState("");
  const [isResearchLoading, setIsResearchLoading] = useState(false);

  useEffect(() => {
    if (formData.status === 'completed' && availableResearch.length === 0) {
      const fetchResearch = async () => {
        setIsResearchLoading(true);
        try {
          const res = await fetch("/api/research");
          const data = await res.json();
          setAvailableResearch(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch research:", err);
        } finally {
          setIsResearchLoading(false);
        }
      };
      fetchResearch();
    }
  }, [formData.status]);

  const toggleResearchSelection = (id: number) => {
    setFormData(prev => {
      const currentIds = prev.attachedResearchIds || [];
      const newIds = currentIds.includes(id)
        ? []
        : [id];
      return { ...prev, attachedResearchIds: newIds };
    });
  };

  const filteredResearch = availableResearch.filter(r => 
    r.title.toLowerCase().includes(researchSearch.toLowerCase()) ||
    r.category.toLowerCase().includes(researchSearch.toLowerCase())
  );

  const [categories, setCategories] = useState(CATEGORIES);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim().toUpperCase())) {
      const cat = newCategory.trim().toUpperCase();
      setCategories(prev => [...prev, cat]);
      setFormData(prev => ({ ...prev, category: cat }));
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = (e: React.MouseEvent, catToDelete: string) => {
    e.stopPropagation();
    setCategories(prev => prev.filter(c => c !== catToDelete));
    if (formData.category === catToDelete) {
      setFormData(prev => ({ ...prev, category: categories[0] || "" }));
    }
  };

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
        description: initialData.description || "",
        attachedResearchIds: Array.isArray(initialData.attachedResearchIds) ? initialData.attachedResearchIds : []
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
        description: "",
        attachedResearchIds: []
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
      const res = await fetch('/api/upload?folder=projects', {
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
      
      // Validate mandatory fields
      if (!formData.title || !formData.description || !formData.aboutProject || !formData.imageUrl || !formData.location || !formData.tags || formData.teamMembers.length === 0 || formData.projectObjectives.length === 0) {
        alert("Please fill in all mandatory fields, including Image, Tags, Location, Team Members, and Objectives.");
        setIsSubmitting(false);
        return;
      }

      const submissionData = {
        ...formData,
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
                    <label className="text-xs font-bold text-slate-700 ml-1">Category *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div 
                          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                          className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-900 flex justify-between items-center cursor-pointer transition-all"
                        >
                          <span>{formData.category}</span>
                          <ChevronDown className={`text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} size={20} />
                        </div>
                        
                        <AnimatePresence>
                          {isCategoryOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                            >
                              <div className="p-2 border-b border-slate-50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Select category</p>
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {categories.map(cat => (
                                  <div 
                                    key={cat}
                                    onClick={() => {
                                      setFormData({ ...formData, category: cat });
                                      setIsCategoryOpen(false);
                                    }}
                                    className={`px-5 py-3 flex justify-between items-center cursor-pointer transition-all hover:bg-blue-50/50 group ${formData.category === cat ? 'bg-blue-50' : ''}`}
                                  >
                                    <span className={`text-sm font-bold ${formData.category === cat ? 'text-blue-600' : 'text-slate-600'}`}>{cat}</span>
                                    <button 
                                      onClick={(e) => handleDeleteCategory(e, cat)}
                                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setIsAddingCategory(!isAddingCategory)}
                          className="h-full px-5 bg-white border border-slate-200 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center shadow-sm"
                        >
                          <Plus size={24} />
                        </button>
                        <AnimatePresence>
                          {isAddingCategory && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, x: 10 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.9, x: 10 }}
                              className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50"
                            >
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Add New Category</p>
                              <input 
                                autoFocus
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold text-sm mb-3"
                                placeholder="Category name..."
                              />
                              <div className="flex gap-2">
                                <button 
                                  type="button"
                                  onClick={() => setIsAddingCategory(false)}
                                  className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest"
                                >
                                  Cancel
                                </button>
                                <button 
                                  type="button"
                                  onClick={handleAddCategory}
                                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-200"
                                >
                                  Add
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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
                    <label className="text-xs font-bold text-slate-700 ml-1">Tags (Comma Separated) *</label>
                    <div className="relative">
                      <input
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        required
                        className="w-full px-5 py-4 pl-12 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                        placeholder="e.g. LCA, Waste Management"
                      />
                      <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Location *</label>
                    <div className="relative">
                      <input
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        required
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

                {/* Research Selection for Completed Projects */}
                <AnimatePresence>
                  {formData.status === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Link Related Research (Select Only One)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={researchSearch}
                            onChange={(e) => setResearchSearch(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                            placeholder="Search research by title or category..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {isResearchLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="animate-spin text-blue-600" size={20} />
                          </div>
                        ) : filteredResearch.length > 0 ? (
                          filteredResearch.map((res) => (
                            <div
                              key={res.id}
                              onClick={() => toggleResearchSelection(res.id)}
                              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                (formData.attachedResearchIds || []).includes(res.id)
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-white border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div>
                                <div className="text-sm font-bold text-slate-900">{res.title}</div>
                                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{res.category}</div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                (formData.attachedResearchIds || []).includes(res.id)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-slate-200'
                              }`}>
                                {(formData.attachedResearchIds || []).includes(res.id) && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-slate-400 text-sm font-medium">
                            No research found matching your search.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Team Members */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Team Members *</h3>
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
                <h3 className="text-lg font-black text-slate-900">Media Section *</h3>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div 
                  onClick={() => {
                    const input = document.getElementById('project-image-upload');
                    if (input) (input as HTMLInputElement).click();
                  }}
                  className="w-full md:w-48 h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <p className="text-white text-[10px] font-black uppercase tracking-widest p-2">Change Image</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      <Upload size={24} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Upload Image</p>
                    </div>
                  )}
                  <input 
                    id="project-image-upload"
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <Loader2 className="animate-spin text-blue-600" size={24} />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Detailed Description */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                <h3 className="text-lg font-black text-slate-900">Detailed Description *</h3>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.aboutProject}
                  onChange={value => setFormData({ ...formData, aboutProject: value })}
                  modules={modules}
                  formats={formats}
                  className="h-64 mb-12"
                />
              </div>
            </section>

            {/* 4. Project Objectives */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                <h3 className="text-lg font-black text-slate-900">Project Objectives *</h3>
              </div>

              <div className="space-y-4">
                {formData.projectObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <input
                        value={objective}
                        onChange={e => updateObjective(index, e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-500 outline-none font-semibold text-sm transition-all"
                        placeholder={`Objective ${index + 1}`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-colors"
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

            {/* Short Description (Admin Internal) */}
            <section className="space-y-4">
              <label className="text-xs font-bold text-slate-700 ml-1">Card Summary *</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-semibold text-slate-900 transition-all placeholder:text-slate-400 h-24"
                placeholder="Short summary for project cards..."
              />
            </section>

            {/* Footer Actions */}
            <div className="pt-8 border-t border-slate-100 flex justify-end gap-4 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData?.id ? "Update Project" : "Publish Project"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
