"use client";

import { X, Plus, Trash2, Loader2, Upload, FileText } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectFormProps {
  onClose: () => void;
  initialData?: any;
}

export default function ProjectForm({ onClose, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "General",
    tags: initialData?.tags || "",
    location: initialData?.location || "",
    description: initialData?.description || "",
    status: initialData?.status || "ongoing",
    imageUrl: initialData?.imageUrl || "",
    aboutProject: initialData?.aboutProject || "",
    projectDate: initialData?.projectDate || new Date().toISOString().split('T')[0],
    link: initialData?.link || "",
  });

  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/projects';
      const method = initialData?.id ? 'PUT' : 'POST';
      const body = initialData?.id ? { ...formData, id: initialData.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {initialData ? "Edit" : "Add"} <span className="text-blue-600">Project</span>
            </h2>
            <p className="text-slate-50 text-sm font-medium mt-1">Manage project details and progress.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</label>
              <input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium"
                placeholder="Project title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
              <input
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium"
                placeholder="e.g. Conservation"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</label>
              <input
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium"
                placeholder="e.g. Nairobi, Kenya"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Upload size={24} />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={20} />
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-600 transition-all">
                {isUploading ? "Uploading..." : "Upload Image"}
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium resize-none"
              placeholder="Brief overview..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
            >
              {initialData ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
