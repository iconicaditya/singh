"use client";

import { X, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo2, Redo2, Palette, ChevronDown, Search, User, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResearchFormProps {
  onClose: () => void;
  initialData?: any;
}

export default function ResearchForm({ onClose, initialData }: ResearchFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "RESEARCH",
    newCategory: "",
    year: initialData?.year || "2026",
    tags: initialData?.tags || "",
    titleImage: initialData?.titleImage || "",
  });

  const [authors, setAuthors] = useState<any[]>(initialData?.authors || [{ name: "", image: "" }]);
  const [contentSections, setContentSections] = useState<any[]>(
    initialData?.contentSections || [{ id: crypto.randomUUID(), title: "", content: "", image: "" }]
  );
  const [relatedPublications, setRelatedPublications] = useState<any[]>(initialData?.relatedPublications || []);
  const [publicationSearch, setPublicationSearch] = useState("");
  const [showPubSearch, setShowPubSearch] = useState(false);
  const [availablePublications, setAvailablePublications] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories] = useState<string[]>(["RESEARCH", "PUBLICATION", "CASE STUDY", "WASTE MANAGEMENT", "CLIMATE CHANGE"]);

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const res = await fetch('/api/research');
        if (res.ok) {
          const data = await res.json();
          setAvailablePublications(data.filter((p: any) => p.category === "PUBLICATION"));
        }
      } catch (err) {
        console.error("Failed to fetch publications", err);
      }
    };
    fetchPubs();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'title' | 'author' | 'section', index?: number, sectionId?: string) => {
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
        if (type === 'title') {
          setFormData(prev => ({ ...prev, titleImage: data.secure_url }));
        } else if (type === 'author' && index !== undefined) {
          const newAuthors = [...authors];
          newAuthors[index] = { ...newAuthors[index], image: data.secure_url };
          setAuthors(newAuthors);
        } else if (type === 'section' && sectionId) {
          setContentSections(prev => prev.map(s => s.id === sectionId ? { ...s, image: data.secure_url } : s));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  const handleContentChange = (id: string, e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContentSections(prev => prev.map(s => s.id === id ? { ...s, content: newContent } : s));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalData = {
        ...formData,
        authors: authors.filter(a => a.name.trim()),
        contentSections: contentSections.filter(s => s.title || s.content || s.image),
        relatedPublications
      };
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (response.ok) onClose();
    } catch (error) {
      alert("Error saving research");
    }
  };

  return (
    <div className="bg-white min-h-[90vh] font-sans flex flex-col">
      {/* Form Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Research</h1>
          <p className="text-sm text-slate-400">Manage details for the research card and viewer.</p>
        </div>
        <button type="button" onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-4xl space-y-12">
          {/* Section 1: Basic Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
              <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
            </div>
            
            <p className="text-slate-300 italic text-sm">write paragraph here........</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-blue-500 focus:ring-0 text-sm transition-all text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Category</label>
                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/30 focus:bg-white appearance-none text-sm focus:border-blue-500 focus:ring-0 transition-all text-slate-900"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="New category name"
                      value={formData.newCategory}
                      onChange={e => setFormData({...formData, newCategory: e.target.value})}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/30 focus:bg-white text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                    />
                    <button 
                      type="button"
                      className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Year</label>
                <input 
                  type="text" 
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/30 focus:bg-white text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. LCA, Sustainability"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/30 focus:bg-white text-sm focus:border-blue-500 focus:ring-0 text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Title Image</label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-20 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                  {formData.titleImage ? (
                    <img src={formData.titleImage} className="w-full h-full object-cover" />
                  ) : (
                    <Plus size={24} className="text-slate-300" />
                  )}
                  {isUploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}
                </div>
              </div>
            </div>
          </section>

          {/* Rest of sections hidden or styled similarly to maintain layout focus */}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-gray-100 bg-white sticky bottom-0 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-8 py-2.5 rounded-lg text-xs font-bold text-slate-500 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" onClick={handleSave} className="px-8 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-600/30 active:scale-95 transition-all">Save Research</button>
      </div>
    </div>
  );
}
