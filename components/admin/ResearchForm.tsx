"use client";

import { X, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo2, Redo2, Palette, ChevronDown, Search, User, FileText } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const Parchment = typeof window !== 'undefined' ? (require('react-quill-new').Quill).import('parchment') : null;

if (Parchment && typeof window !== 'undefined') {
  const fontSizeArr = [
    '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '54px', '60px'
  ];
  const Size = (require('react-quill-new').Quill).import('attributors/style/size');
  Size.whitelist = fontSizeArr;
  (require('react-quill-new').Quill).register(Size, true);

  const Font = (require('react-quill-new').Quill).import('attributors/style/font');
  Font.whitelist = [
    'arial', 'helvetica', 'times-new-roman', 'georgia', 'verdana', 
    'tahoma', 'courier-new', 'trebuchet-ms', 'calibri', 'roboto'
  ];
  (require('react-quill-new').Quill).register(Font, true);
}

const professionalColors = [
  '#000000', '#475569', '#64748b', '#94a3b8', '#dc2626', 
  '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#db2777'
];

const modules = {
  toolbar: {
    container: [
      ['undo', 'redo'],
      [{ 'font': [
        'arial', 'helvetica', 'times-new-roman', 'georgia', 'verdana', 
        'tahoma', 'courier-new', 'trebuchet-ms', 'calibri', 'roboto'
      ] }, 
      { 'size': [
        '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px', '54px', '60px'
      ] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': professionalColors }, { 'background': professionalColors }],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  },
  history: {
    delay: 1000,
    maxStack: 500,
    userOnly: true
  }
};

const formats = [
  'font', 'size',
  'bold', 'italic', 'underline',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link'
];

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

  const handleContentChange = (id: string, content: string) => {
    setContentSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
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
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900">Add New Research</h1>
          <p className="text-sm text-slate-500 mt-1">Manage details for the research card and viewer.</p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Basic Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
              <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Category</label>
                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 appearance-none text-sm focus:border-blue-500 focus:ring-0 transition-all bg-white text-slate-900"
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
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                    />
                    <button 
                      type="button"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Year</label>
                <input 
                  type="text" 
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. LCA, Sustainability"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-100 bg-slate-50/50 text-sm focus:border-blue-500 focus:ring-0 text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Title Image</label>
              <div className="flex items-start gap-4">
                <div className="w-28 h-28 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                  {formData.titleImage ? (
                    <img src={formData.titleImage} className="w-full h-full object-cover" />
                  ) : (
                    <Plus size={24} className="text-slate-300" />
                  )}
                  {isUploading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}
                </div>
                <div className="space-y-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[11px] font-bold text-slate-600 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Plus size={14} /> Choose Image
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'title')} />
                  </label>
                  <p className="text-[10px] text-slate-400">No file chosen</p>
                </div>
              </div>
            </div>
          </section>

          {/* Paper Details */}
          <section className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Paper Details</h2>
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Authors</label>
              {authors.map((author, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      type="text" 
                      placeholder="Author Name"
                      value={author.name}
                      onChange={e => {
                        const newA = [...authors];
                        newA[index].name = e.target.value;
                        setAuthors(newA);
                      }}
                      className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                    />
                  </div>
                  {authors.length > 1 && (
                    <button type="button" onClick={() => setAuthors(authors.filter((_, i) => i !== index))} className="text-slate-200 hover:text-rose-500">
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setAuthors([...authors, { name: "", image: "" }])} className="text-blue-600 text-xs font-bold flex items-center gap-1.5 px-1">
                <Plus size={14} /> Add Author
              </button>
            </div>
          </section>

          {/* Section 2: Research Contents */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
              <h2 className="text-lg font-bold text-slate-900">Research Contents</h2>
            </div>

            {contentSections.map((section, index) => (
              <div key={section.id} className="space-y-4 border border-gray-100 rounded-xl p-6 relative">
                <button 
                  type="button" 
                  onClick={() => setContentSections(contentSections.filter(s => s.id !== section.id))}
                  className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Section Title (e.g. Introduction)</label>
                  <input 
                    type="text" 
                    placeholder="Section Title (e.g. Introduction)"
                    value={section.title}
                    onChange={e => {
                      const newS = [...contentSections];
                      newS[index].title = e.target.value;
                      setContentSections(newS);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-100 text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                  />
                </div>

                <div className="bg-white ql-custom-container border border-gray-200 rounded-lg overflow-hidden relative z-10" dir="ltr">
                  <ReactQuill
                    theme="snow"
                    value={section.content || ""}
                    onChange={(content) => handleContentChange(section.id, content)}
                    modules={modules}
                    formats={formats}
                    placeholder=""
                    className="min-h-[300px]"
                  />
                  <style dangerouslySetInnerHTML={{ __html: `
                    .ql-custom-container .ql-editor {
                      min-height: 300px;
                      text-align: left;
                      direction: ltr !important;
                      font-size: 14px;
                      line-height: 1.6;
                      padding: 24px;
                    }
                    .ql-custom-container .ql-container.ql-snow {
                      border: none;
                    }
                    .ql-custom-container .ql-toolbar.ql-snow {
                      border: none;
                      border-bottom: 1px solid #f1f5f9;
                      background: #fff;
                      padding: 8px 12px;
                      display: flex;
                      align-items: center;
                      gap: 4px;
                    }
                    .ql-toolbar.ql-snow .ql-formats {
                      margin-right: 12px;
                      padding-right: 12px;
                      border-right: 1px solid #f1f5f9;
                      display: flex;
                      align-items: center;
                    }
                    .ql-toolbar.ql-snow .ql-formats:last-child {
                      border-right: none;
                    }
                    
                    /* Dropdown Styling */
                    .ql-snow .ql-picker {
                      height: 32px;
                      border: 1px solid #e2e8f0;
                      border-radius: 6px;
                      background: #fff;
                    }
                    .ql-snow .ql-picker.ql-font {
                      width: 120px;
                    }
                    .ql-snow .ql-picker.ql-size {
                      width: 80px;
                    }
                    .ql-snow .ql-picker-label {
                      padding-left: 12px !important;
                      display: flex;
                      align-items: center;
                      font-size: 13px;
                      color: #64748b;
                    }

                    /* Icons Styling */
                    .ql-snow.ql-toolbar button {
                      width: 28px;
                      height: 28px;
                      color: #64748b;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      position: relative;
                    }
                    .ql-snow.ql-toolbar button:hover, .ql-snow.ql-toolbar button.ql-active {
                      color: #2563eb;
                    }
                    
                    /* Custom icons for toolbar to match screenshot */
                    .ql-snow.ql-toolbar .ql-undo::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 7v6h6'/%3E%3Cpath d='M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-redo::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 7v6h-6'/%3E%3Cpath d='M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-color .ql-stroke { stroke: none; }
                    .ql-snow.ql-toolbar .ql-color::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='13.5' cy='6.5' r='.5' fill='currentColor'/%3E%3Ccircle cx='17.5' cy='10.5' r='.5' fill='currentColor'/%3E%3Ccircle cx='8.5' cy='7.5' r='.5' fill='currentColor'/%3E%3Ccircle cx='6.5' cy='12.5' r='.5' fill='currentColor'/%3E%3Cpath d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.5 1.5-1.3 0-.4-.1-.8-.4-1.1-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8z'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-background .ql-stroke { stroke: none; }
                    .ql-snow.ql-toolbar .ql-background::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m19 11-8-8-7 7 8 8z'/%3E%3Cpath d='m14.7 12.7 5 5'/%3E%3Cpath d='m5 22 1.5-1.5'/%3E%3Cpath d='M15 22 9 9'/%3E%3Cpath d='m22 22-1.5-1.5'/%3E%3Cpath d='M18 22l-1.5-1.5'/%3E%3Cpath d='M7 22l-1.5-1.5'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-list[value="ordered"]::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='10' y1='6' x2='21' y2='6'/%3E%3Cline x1='10' y1='12' x2='21' y2='12'/%3E%3Cline x1='10' y1='18' x2='21' y2='18'/%3E%3Cpath d='M4 6h1v4'/%3E%3Cpath d='M4 10h2'/%3E%3Cpath d='M6 18H4c0-1 2-2 2-3s-1-1.5-2-1'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-list[value="bullet"]::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='8' y1='6' x2='21' y2='6'/%3E%3Cline x1='8' y1='12' x2='21' y2='12'/%3E%3Cline x1='8' y1='18' x2='21' y2='18'/%3E%3Cline x1='3' y1='6' x2='3.01' y2='6'/%3E%3Cline x1='3' y1='12' x2='3.01' y2='12'/%3E%3Cline x1='3' y1='18' x2='3.01' y2='18'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-align[value="center"]::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='10' x2='6' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='18' y1='18' x2='6' y2='18'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-align[value="right"]::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='21' y1='10' x2='10' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='21' y1='18' x2='14' y2='18'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-align[value="justify"]::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='21' y1='10' x2='3' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='21' y1='18' x2='3' y2='18'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar .ql-align:not([value])::before {
                      content: "";
                      width: 18px;
                      height: 18px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='17' y1='10' x2='3' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='14' y1='18' x2='3' y2='18'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                      display: block;
                    }
                    .ql-snow.ql-toolbar button svg { display: none; }
                    
                    /* Toolbar separators and styling */
                    .ql-toolbar.ql-snow .ql-formats {
                      border-right: 1px solid #e2e8f0;
                      margin-right: 8px;
                      padding-right: 8px;
                    }
                    .ql-toolbar.ql-snow .ql-formats:last-child {
                      border-right: none;
                    }
                    .ql-snow .ql-picker-label::after {
                      content: "";
                      width: 12px;
                      height: 12px;
                      margin-left: 4px;
                      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                      background-size: contain;
                      background-repeat: no-repeat;
                    }
                    .ql-snow .ql-picker-label svg { display: none !important; }

                    
                    /* Custom Fonts */
                    .ql-font-arial { font-family: 'Arial', sans-serif; }
                    .ql-font-helvetica { font-family: 'Helvetica', sans-serif; }
                    .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
                    .ql-font-georgia { font-family: 'Georgia', serif; }
                    .ql-font-verdana { font-family: 'Verdana', sans-serif; }
                    .ql-font-tahoma { font-family: 'Tahoma', sans-serif; }
                    .ql-font-courier-new { font-family: 'Courier New', monospace; }
                    .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', sans-serif; }
                    .ql-font-calibri { font-family: 'Calibri', sans-serif; }
                    .ql-font-roboto { font-family: 'Roboto', sans-serif; }
                    
                    /* Size labels in dropdown */
                    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
                    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
                      content: attr(data-value) !important;
                    }

                    /* Font labels in dropdown */
                    .ql-snow .ql-picker.ql-font .ql-picker-label::before {
                      content: 'Font' !important;
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
                      content: attr(data-value) !important;
                    }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before { content: 'Arial' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before { content: 'Helvetica' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before { content: 'Times New Roman' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before { content: 'Georgia' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before { content: 'Verdana' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="tahoma"]::before { content: 'Tahoma' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before { content: 'Courier New' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="trebuchet-ms"]::before { content: 'Trebuchet MS' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="calibri"]::before { content: 'Calibri' !important; }
                    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: 'Roboto' !important; }
                  ` }} />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Paragraph Image (Optional)</label>
                  <div className="flex items-start gap-4">
                    <div className="w-28 h-20 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                      {section.image ? (
                        <img src={section.image} className="w-full h-full object-cover" />
                      ) : (
                        <Plus size={24} className="text-slate-300" />
                      )}
                    </div>
                    <label className="inline-flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg text-xs font-bold text-slate-600 cursor-pointer hover:bg-gray-50 transition-colors">
                      <ImageIcon size={14} /> Upload Image
                      <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'section', undefined, section.id)} />
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={() => setContentSections([...contentSections, { id: crypto.randomUUID(), title: "", content: "", image: "" }])} className="w-full py-8 border-2 border-dashed border-gray-100 rounded-xl text-sm font-bold text-slate-500 flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-blue-200 transition-all">
              <Plus size={20} /> Add Content Section
            </button>
          </section>

          {/* Section: Related Publications */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">4</div>
                <h2 className="text-lg font-bold text-slate-900">Related Publications</h2>
              </div>
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">(Optional)</span>
            </div>

            <button 
              type="button" 
              onClick={() => setShowPubSearch(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-gray-50"
            >
              <Plus size={14} /> Add Publication
            </button>

            {/* Related Publications List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPublications.map(pub => (
                <div key={pub.id} className="p-4 bg-blue-50/50 rounded-xl border border-blue-50 flex justify-between items-center">
                  <div className="flex-1 truncate pr-4">
                    <p className="text-xs font-bold text-blue-900 truncate">{pub.title}</p>
                    <p className="text-[10px] text-blue-400 uppercase font-black">{pub.category}</p>
                  </div>
                  <button type="button" onClick={() => setRelatedPublications(relatedPublications.filter(r => r.id !== pub.id))} className="text-blue-300 hover:text-rose-500">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-10 py-2.5 rounded-lg text-xs font-bold text-slate-500 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" onClick={handleSave} className="px-10 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold active:scale-95 transition-all">Save Research</button>
          </div>
        </div>
      </div>
    </div>
  );
}
