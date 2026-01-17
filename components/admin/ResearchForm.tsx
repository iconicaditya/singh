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
  const [relatedPublications, setRelatedPublications] = useState<any[]>(initialData?.relatedPublications || []);
  const [publicationSearch, setPublicationSearch] = useState("");
  const [showPubSearch, setShowPubSearch] = useState(false);
  const [availablePublications, setAvailablePublications] = useState<any[]>([]);
  const [isLoadingPubs, setIsLoadingPubs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories] = useState<string[]>(["RESEARCH", "PUBLICATION", "CASE STUDY", "WASTE MANAGEMENT", "CLIMATE CHANGE"]);

  const fetchPubs = async () => {
    setIsLoadingPubs(true);
    try {
      const res = await fetch('/api/publications');
      if (res.ok) {
        const data = await res.json();
        setAvailablePublications(data);
      }
    } catch (err) {
      console.error("Failed to fetch publications", err);
    } finally {
      setIsLoadingPubs(false);
    }
  };

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
        relatedPublications
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

  const filteredPubs = availablePublications.filter(pub => 
    pub.title.toLowerCase().includes(publicationSearch.toLowerCase()) &&
    !relatedPublications.some(rp => rp.id === pub.id)
  );

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

          {/* Related Publications */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                <h2 className="text-lg font-bold text-slate-900">Related Publications</h2>
              </div>
              <button 
                type="button" 
                onClick={(e) => { 
                  console.log("Add Publication clicked");
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPubSearch(true); 
                  fetchPubs(); 
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer relative z-50"
              >
                <Plus size={14} /> Add Publication
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {relatedPublications.map(pub => (
                <div key={pub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-500" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{pub.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{pub.category}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setRelatedPublications(prev => prev.filter(p => p.id !== pub.id))}
                    className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {relatedPublications.length === 0 && (
                <p className="text-center py-6 text-sm text-slate-400 font-medium bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-100">No publications added yet.</p>
              )}
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

      {/* Publication Search Modal */}
      <AnimatePresence>
        {showPubSearch && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Add <span className="text-blue-600">Publication</span></h3>
                <button onClick={() => setShowPubSearch(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-6">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search publications..." value={publicationSearch} onChange={e => setPublicationSearch(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold" />
                </div>
                <div className="space-y-3">
                  {isLoadingPubs ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                  ) : filteredPubs.length === 0 ? (
                    <p className="text-center py-10 text-slate-400 font-medium">No available publications found.</p>
                  ) : (
                    filteredPubs.map(pub => (
                      <button key={pub.id} onClick={() => { setRelatedPublications([...relatedPublications, pub]); setShowPubSearch(false); }} className="w-full text-left p-5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-2xl transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 shadow-sm transition-all"><FileText size={24} /></div>
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">{pub.title}</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{pub.category} • {pub.year || '2026'}</p>
                          </div>
                        </div>
                        <Plus size={20} className="text-slate-200 group-hover:text-blue-600 transition-all" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
