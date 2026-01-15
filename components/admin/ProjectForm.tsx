"use client";

import { X, Save, Plus } from "lucide-react";
import { useState } from "react";

interface ProjectFormProps {
  onClose: () => void;
  initialData?: any;
}

export default function ProjectForm({ onClose, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "Ongoing",
    tags: initialData?.tags || "",
    link: initialData?.link || "",
    imageUrl: initialData?.imageUrl || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        alert("Please fill in Title and Description");
        return;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      onClose();
    } catch (error) {
      console.error("Save Error:", error);
      alert(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-[2rem] p-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-[#1a2233]">Add New Project</h2>
        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a2233] uppercase">Title</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold" 
            placeholder="Project Title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a2233] uppercase">Status</label>
          <select 
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-bold"
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Planned">Planned</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a2233] uppercase">Tags</label>
          <input 
            type="text" 
            value={formData.tags}
            onChange={e => setFormData({...formData, tags: e.target.value})}
            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold" 
            placeholder="e.g. Research, Community"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1a2233] uppercase">External Link</label>
          <input 
            type="text" 
            value={formData.link}
            onChange={e => setFormData({...formData, link: e.target.value})}
            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold" 
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-[#1a2233] uppercase">Description</label>
        <textarea 
          rows={4}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold resize-none" 
          placeholder="Detailed project description..."
        />
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-slate-50">
        <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-10 py-3 rounded-xl text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}
