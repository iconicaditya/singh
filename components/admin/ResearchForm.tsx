"use client";

import { X, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo2, Redo2, Palette, ChevronDown, Search, User, FileText, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const professionalColors = [
  '#000000', '#FFFFFF', '#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#808080', '#FFC0CB', '#000080', '#008080', '#800000', '#808000', '#00FFFF', '#FF00FF', '#A52A2A', '#D3D3D3', '#A9A9A9', '#708090', '#C0C0C0', '#FFD700', '#F5F5DC', '#FF7F50', '#40E0D0', '#4B0082', '#EE82EE', '#D2691E', '#4682B4', '#4169E1'
];

const modules = {
  toolbar: {
    container: [
      ['undo', 'redo'],
      [{ 'font': ['arial', 'helvetica', 'times-new-roman', 'georgia', 'verdana', 'tahoma', 'courier-new', 'trebuchet-ms', 'calibri', 'roboto'] }, { 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '54px', '60px'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': professionalColors }, { 'background': professionalColors }],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  },
  history: { delay: 1000, maxStack: 500, userOnly: true }
};

const formats = ['font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'list', 'indent', 'align', 'link', 'image', 'video'];

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
  const [isUploading, setIsUploading] = useState(false);
  const [categories] = useState<string[]>(["RESEARCH", "PUBLICATION", "CASE STUDY", "WASTE MANAGEMENT", "CLIMATE CHANGE"]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'title' | 'author' | 'section', index?: number, sectionId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
      const data = await res.json();
      if (data.secure_url) {
        if (type === 'title') setFormData(prev => ({ ...prev, titleImage: data.secure_url }));
        else if (type === 'author' && index !== undefined) {
          const newAuthors = [...authors];
          newAuthors[index] = { ...newAuthors[index], image: data.secure_url };
          setAuthors(newAuthors);
        } else if (type === 'section' && sectionId) {
          setContentSections(prev => prev.map(s => s.id === sectionId ? { ...s, image: data.secure_url } : s));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalData = {
        ...formData,
        authors: authors.filter(a => a.name.trim()),
        contentSections: contentSections.filter(s => s.title || s.content || s.image),
      };
      const response = await fetch('/api/research', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData?.id ? { ...finalData, id: initialData.id } : finalData),
      });
      if (response.ok) onClose();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans overflow-y-auto">
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{initialData ? 'Edit' : 'Add New'} Research</h1>
            <p className="text-sm text-slate-500 mt-1">Manage details for the research profile.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-12">
          {/* Section 1: Basic Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
              <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-500 outline-none">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Research Content Sections */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</div>
              <h2 className="text-lg font-bold text-slate-900">Research Contents</h2>
            </div>
            {contentSections.map((section, idx) => (
              <div key={section.id} className="p-6 bg-white border border-slate-100 rounded-2xl space-y-4 shadow-sm relative group">
                <button type="button" onClick={() => setContentSections(prev => prev.filter(s => s.id !== section.id))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                <input type="text" placeholder="Section Title" value={section.title} onChange={e => {
                  const newS = [...contentSections];
                  newS[idx].title = e.target.value;
                  setContentSections(newS);
                }} className="w-full text-lg font-bold border-none outline-none focus:ring-0 placeholder:text-slate-300" />
                <ReactQuill theme="snow" value={section.content} onChange={val => {
                  const newS = [...contentSections];
                  newS[idx].content = val;
                  setContentSections(newS);
                }} modules={modules} formats={formats} className="min-h-[200px]" />
              </div>
            ))}
            <button type="button" onClick={() => setContentSections([...contentSections, { id: crypto.randomUUID(), title: "", content: "", image: "" }])} className="w-full py-6 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-200 hover:text-blue-500 transition-all font-bold text-sm">
              <Plus size={20} /> Add Content Section
            </button>
          </section>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg hover:bg-blue-700 transition-all">Save Research</button>
          </div>
        </form>
      </div>
    </div>
  );
}
