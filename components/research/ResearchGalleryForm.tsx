"use client";

import { useState } from "react";
import { X, Plus, Trash2, Image as ImageIcon, User, Layout, Link as LinkIcon } from "lucide-react";

interface ResearchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function ResearchGalleryForm({ isOpen, onClose, onSuccess, initialData }: ResearchFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState(initialData || {
    title: "",
    category: "",
    year: new Date().getFullYear().toString(),
    tags: "",
    titleImage: "",
    authors: [{ name: "", image: "" }],
    contentSections: [{ title: "", content: "", image: "" }],
    relatedPublications: []
  });

  if (!isOpen) return null;

  const addAuthor = () => setFormData({ ...formData, authors: [...formData.authors, { name: "", image: "" }] });
  const removeAuthor = (index: number) => {
    const newAuthors = formData.authors.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  const addSection = () => setFormData({ ...formData, contentSections: [...formData.contentSections, { title: "", content: "", image: "" }] });
  const removeSection = (index: number) => {
    const newSections = formData.contentSections.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, contentSections: newSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = initialData ? "PUT" : "POST";
      const res = await fetch("/api/research", {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md text-black">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[92vh] overflow-y-auto p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">
              {initialData ? "Update" : "Create"} <span className="text-blue-600">Research Focus</span>
            </h2>
            <p className="text-slate-500 font-medium">Define a new research milestone for the SinghLab gallery.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Research Title</label>
              <input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold"
                placeholder="e.g. Advancing Protein Synthesis..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Focus Category</label>
              <input
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold"
                placeholder="e.g. Molecular Biology"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Title Image URL</label>
              <input
                value={formData.titleImage}
                onChange={e => setFormData({ ...formData, titleImage: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold"
                placeholder="Cloudinary URL..."
              />
            </div>
          </div>

          {/* Authors Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <User size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">Research Team</span>
              </div>
              <button type="button" onClick={addAuthor} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                + Add Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.authors.map((author: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
                  <div className="flex-1 space-y-3">
                    <input
                      placeholder="Name"
                      value={author.name}
                      onChange={e => {
                        const newAuthors = [...formData.authors];
                        newAuthors[idx].name = e.target.value;
                        setFormData({ ...formData, authors: newAuthors });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                    />
                    <input
                      placeholder="Photo URL"
                      value={author.image}
                      onChange={e => {
                        const newAuthors = [...formData.authors];
                        newAuthors[idx].image = e.target.value;
                        setFormData({ ...formData, authors: newAuthors });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs"
                    />
                  </div>
                  <button type="button" onClick={() => removeAuthor(idx)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <Layout size={18} />
                <span className="text-[10px] font-black tracking-widest uppercase">Research Story (Sections)</span>
              </div>
              <button type="button" onClick={addSection} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                + Add Content Section
              </button>
            </div>
            <div className="space-y-4">
              {formData.contentSections.map((section: any, idx: number) => (
                <div key={idx} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 relative">
                  <button type="button" onClick={() => removeSection(idx)} className="absolute top-6 right-6 text-red-400 hover:text-red-600">
                    <Trash2 size={20} />
                  </button>
                  <input
                    placeholder="Section Title (e.g. Introduction)"
                    value={section.title}
                    onChange={e => {
                      const newSects = [...formData.contentSections];
                      newSects[idx].title = e.target.value;
                      setFormData({ ...formData, contentSections: newSects });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-6 py-3 font-bold"
                  />
                  <textarea
                    placeholder="Section Content..."
                    value={section.content}
                    onChange={e => {
                      const newSects = [...formData.contentSections];
                      newSects[idx].content = e.target.value;
                      setFormData({ ...formData, contentSections: newSects });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-6 py-4 text-sm min-h-[100px]"
                  />
                  <input
                    placeholder="Section Image URL (Optional)"
                    value={section.image}
                    onChange={e => {
                      const newSects = [...formData.contentSections];
                      newSects[idx].image = e.target.value;
                      setFormData({ ...formData, contentSections: newSects });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-6 py-3 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex justify-end gap-6 items-center">
            <button type="button" onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Publish to Gallery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}