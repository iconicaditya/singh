"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  User, 
  Layout, 
  Link as LinkIcon,
  PlusCircle,
  ChevronDown,
  Upload,
  Calendar,
  Tag as TagIcon
} from "lucide-react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface ResearchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    [{ 'font': [] }],
    [{ 'size': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'clean']
  ],
};

export default function ResearchGalleryForm({ isOpen, onClose, onSuccess, initialData }: ResearchFormProps) {
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(["RESEARCH", "PUBLICATION", "PROJECT"]);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "RESEARCH",
    year: new Date().getFullYear().toString(),
    tags: "",
    titleImage: "",
    authors: [{ name: "", image: "" }],
    contentSections: [{ title: "", content: "", image: "" }],
    relatedPublications: [] as any[]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        authors: initialData.authors || [{ name: "", image: "" }],
        contentSections: initialData.contentSections || [{ title: "", content: "", image: "" }],
        relatedPublications: initialData.relatedPublications || []
      });
    } else {
      setFormData({
        title: "",
        category: "RESEARCH",
        year: new Date().getFullYear().toString(),
        tags: "",
        titleImage: "",
        authors: [{ name: "", image: "" }],
        contentSections: [{ title: "", content: "", image: "" }],
        relatedPublications: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (file: File, type: 'title' | 'section' | 'author', index?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        if (type === 'title') {
          setFormData(prev => ({ ...prev, titleImage: data.url }));
        } else if (type === 'section' && index !== undefined) {
          const newSects = [...formData.contentSections];
          newSects[index].image = data.url;
          setFormData(prev => ({ ...prev, contentSections: newSects }));
        } else if (type === 'author' && index !== undefined) {
          const newAuthors = [...formData.authors];
          newAuthors[index].image = data.url;
          setFormData(prev => ({ ...prev, authors: newAuthors }));
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const addAuthor = () => setFormData({ ...formData, authors: [...formData.authors, { name: "", image: "" }] });
  const removeAuthor = (index: number) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  const addSection = () => setFormData({ ...formData, contentSections: [...formData.contentSections, { title: "", content: "", image: "" }] });
  const removeSection = (index: number) => {
    const newSections = formData.contentSections.filter((_, i) => i !== index);
    setFormData({ ...formData, contentSections: newSections });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setFormData({ ...formData, category: newCategory });
      setNewCategory("");
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm text-slate-900">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add New Research</h2>
            <p className="text-slate-500 text-sm">Manage details for the research card and viewer.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Section 1: Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
              <h3 className="text-lg font-bold">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Research Title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <div className="flex gap-2">
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <input
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="New category name"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                  TAGS (COMMA SEPARATED)
                </label>
                <div className="relative">
                  <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. LCA, Sustainability"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Title Image</label>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                  {formData.titleImage ? (
                    <img src={formData.titleImage} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="text-slate-400" />
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                      <Upload size={16} />
                      Choose Image
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'title')}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">No file chosen</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Paper Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Paper Details</h3>
            
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Authors</label>
              <div className="space-y-3">
                {formData.authors.map((author: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden border border-slate-200">
                      {author.image ? <img src={author.image} className="w-full h-full object-cover" /> : <User size={20} />}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        placeholder="Author Name"
                        value={author.name}
                        onChange={e => {
                          const newAuthors = [...formData.authors];
                          newAuthors[idx].name = e.target.value;
                          setFormData({ ...formData, authors: newAuthors });
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                      {formData.authors.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeAuthor(idx)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <label className="cursor-pointer p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-200">
                      <ImageIcon size={18} />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'author', idx)}
                      />
                    </label>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addAuthor}
                  className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:text-blue-700 transition-colors pl-1"
                >
                  <Plus size={16} />
                  Add Author
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 2: Research Contents */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
              <h3 className="text-lg font-bold">Research Contents</h3>
            </div>

            <div className="space-y-10">
              {formData.contentSections.map((section: any, idx: number) => (
                <div key={idx} className="space-y-6 group relative">
                  {formData.contentSections.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSection(idx)}
                      className="absolute -right-4 top-0 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  
                  <div className="space-y-4">
                    <input
                      placeholder="Title eg:- Introduction"
                      value={section.title}
                      onChange={e => {
                        const newSects = [...formData.contentSections];
                        newSects[idx].title = e.target.value;
                        setFormData({ ...formData, contentSections: newSects });
                      }}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                    />

                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      <ReactQuill
                        theme="snow"
                        value={section.content}
                        onChange={(val) => {
                          const newSects = [...formData.contentSections];
                          newSects[idx].content = val;
                          setFormData({ ...formData, contentSections: newSects });
                        }}
                        modules={QUILL_MODULES}
                        placeholder="Write your research content here..."
                        className="h-64 mb-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Paragraph Image (Optional)</label>
                    <div className="flex items-start gap-6">
                      <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                        {section.image ? (
                          <img src={section.image} className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={24} className="text-slate-400" />
                        )}
                      </div>
                      <label className="cursor-pointer px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                        <Upload size={18} />
                        Upload Image
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'section', idx)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button" 
                onClick={addSection}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <Plus size={20} />
                Add Content Section
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section 3: Related Publications */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                <h3 className="text-lg font-bold">Related Publications</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">(Optional)</span>
            </div>
            
            <button 
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <PlusCircle size={18} />
              Add Publication
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-3 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Research"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
