"use client";

import { X, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Save, RotateCcw, ChevronDown, Type } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResearchFormProps {
  onClose: () => void;
  initialData?: any;
}

interface ContentSection {
  id: string;
  title: string;
  content: string;
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

  const [authors, setAuthors] = useState<string[]>(initialData?.authors || [""]);
  const [contentSections, setContentSections] = useState<ContentSection[]>(
    initialData?.contentSections || [{ id: crypto.randomUUID(), title: "", content: "" }]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>(["RESEARCH", "PUBLICATION", "CASE STUDY", "WASTE MANAGEMENT", "CLIMATE CHANGE"]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId?: string) => {
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
        if (sectionId) {
          setContentSections(prev => prev.map(s => s.id === sectionId ? { ...s, image: data.secure_url } : s));
        } else {
          setFormData(prev => ({ ...prev, titleImage: data.secure_url }));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCategory = (catToDelete: string) => {
    if (["RESEARCH", "PUBLICATION"].includes(catToDelete)) {
      alert("Core categories cannot be deleted");
      return;
    }
    setCategories(prev => prev.filter(c => c !== catToDelete));
    if (formData.category === catToDelete) {
      setFormData(prev => ({ ...prev, category: "RESEARCH" }));
    }
  };

  const addAuthor = () => setAuthors([...authors, ""]);
  const removeAuthor = (index: number) => setAuthors(authors.filter((_, i) => i !== index));

  const addContentSection = () => {
    const newId = crypto.randomUUID();
    setContentSections([...contentSections, { id: newId, title: "", content: "" }]);
  };

  const removeContentSection = (id: string) => {
    if (contentSections.length > 1) {
      setContentSections(contentSections.filter(s => s.id !== id));
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
      if (!formData.title?.trim() || !formData.category || !formData.year?.trim()) {
        alert("Please fill in all required fields (Title, Category, Year)");
        return;
      }

      if (authors.every(a => !a.trim())) {
        alert("Please add at least one author");
        return;
      }

      const finalData = {
        title: formData.title,
        category: formData.category,
        year: formData.year.toString().slice(0, 4),
        tags: formData.tags || "",
        titleImage: formData.titleImage || "", 
        authors: authors.filter(a => a && a.trim() !== ""),
        contentSections: contentSections.map(s => ({
          title: s.title || "",
          content: s.content || "",
          image: (s as any).image || "" 
        })).filter(s => s.title || s.content),
        relatedPublications: []
      };

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save research');
      }

      console.log("Research saved successfully!");
      onClose();
    } catch (error) {
      console.error("Save Error:", error);
      alert(error instanceof Error ? error.message : "Failed to save research");
    }
  };


  return (
    <form onSubmit={handleSave} className="bg-white min-h-screen pb-20 rounded-[2.5rem]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div>
          <h2 className="text-xl font-black text-[#1a2233] tracking-tight">Add New Research</h2>
          <p className="text-sm text-slate-400 font-medium">Manage details for the research card and viewer.</p>
        </div>
        <button 
          type="button"
          onClick={onClose} 
          className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-8 max-w-5xl mx-auto space-y-12">
        {/* Section 1: Basic Information */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
            <h3 className="text-lg font-black text-[#1a2233] tracking-tight">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1a2233]">Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1a2233]">Category</label>
              <div className="space-y-2">
                <div className="relative group">
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-bold text-black appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <button 
                    type="button"
                    onClick={() => deleteCategory(formData.category)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete current category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.newCategory}
                    onChange={e => setFormData({...formData, newCategory: e.target.value})}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" 
                    placeholder="New category name" 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (formData.newCategory.trim()) {
                        const newCat = formData.newCategory.trim().toUpperCase();
                        if (!categories.includes(newCat)) {
                          setCategories([...categories, newCat]);
                        }
                        setFormData({...formData, category: newCat, newCategory: ""});
                      }
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1a2233]">Year</label>
              <input 
                type="text" 
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" 
                placeholder="2026" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TAGS (COMMA SEPARATED)</label>
              <input 
                type="text" 
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" 
                placeholder="e.g. LCA, Sustainability" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1a2233]">Title Image</label>
            <div className="flex items-start gap-6">
              <div className="relative w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {(formData as any).titleImage ? (
                  <img src={(formData as any).titleImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Plus size={32} className="text-slate-300" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                  <ImageIcon size={14} /> Choose Image
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                </label>
                <p className="text-[10px] text-slate-400">
                  {(formData as any).titleImage ? "Image uploaded" : "No file chosen"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Paper Details */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-[#1a2233] tracking-tight">Paper Details</h3>
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#1a2233]">Authors</label>
            {authors.map((author, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Plus size={16} />
                  </span>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" 
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => {
                      const newAuthors = [...authors];
                      newAuthors[index] = e.target.value;
                      setAuthors(newAuthors);
                    }}
                  />
                  {authors.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeAuthor(index)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button 
              type="button"
              onClick={addAuthor} 
              className="text-blue-600 text-xs font-bold flex items-center gap-2"
            >
              <Plus size={14} /> Add Author
            </button>
          </div>
        </section>

        {/* Section 2: Research Contents */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
            <h3 className="text-lg font-black text-[#1a2233] tracking-tight">Research Contents</h3>
          </div>

          <div className="space-y-8">
            {contentSections.map((section, index) => (
              <div key={section.id} className="space-y-6">
                <input 
                  type="text" 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" 
                  placeholder="Title eg:- Introduction"
                  value={section.title}
                  onChange={e => {
                    const newSections = [...contentSections];
                    newSections[index].title = e.target.value;
                    setContentSections(newSections);
                  }}
                />

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  <div className="flex flex-wrap items-center gap-1 p-3 border-b border-slate-100 bg-slate-50/50">
                    <button type="button" className="p-2 hover:bg-white rounded text-slate-400"><RotateCcw size={14} /></button>
                    <button type="button" className="p-2 hover:bg-white rounded text-slate-400 mr-2"><RotateCcw size={14} className="scale-x-[-1]" /></button>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 mr-2">
                      Font <ChevronDown size={12} />
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 mr-4">
                      Size <ChevronDown size={12} />
                    </div>

                    <div className="flex items-center gap-1 pr-4 border-r border-slate-200 mr-4">
                      <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded text-slate-600 font-bold active:bg-slate-200">B</button>
                      <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded text-slate-600 italic font-serif active:bg-slate-200">I</button>
                      <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-white rounded text-slate-600 underline active:bg-slate-200">U</button>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 mr-2">
                      A <ChevronDown size={12} />
                    </div>
                    
                    <button type="button" onClick={() => execCommand('undo')} className="p-2 hover:bg-white rounded text-slate-400 mr-4 active:bg-slate-200"><RotateCcw size={14} /></button>

                    <div className="flex items-center gap-1 pr-4 border-r border-slate-200 mr-4">
                      <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded text-slate-600 active:bg-slate-200"><List size={14} /></button>
                      <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-white rounded text-slate-600 active:bg-slate-200"><ListOrdered size={14} /></button>
                      <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white rounded text-slate-600 active:bg-slate-200"><AlignLeft size={14} /></button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white rounded text-slate-400 active:bg-slate-200"><AlignLeft size={14} /></button>
                      <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-white rounded text-slate-400 active:bg-slate-200"><AlignCenter size={14} /></button>
                      <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-white rounded text-slate-400 active:bg-slate-200"><AlignRight size={14} /></button>
                      <button type="button" onClick={() => execCommand('justifyFull')} className="p-2 hover:bg-white rounded text-slate-400 active:bg-slate-200"><AlignLeft size={14} className="scale-x-[-1]" /></button>
                    </div>

                    <button type="button" onClick={() => {
                      const url = prompt("Enter URL:");
                      if(url) execCommand('createLink', url);
                    }} className="p-2 hover:bg-white rounded text-slate-600 ml-4"><LinkIcon size={16} /></button>
                    
                    <button type="button" className="p-2 hover:bg-white rounded text-slate-600"><Plus size={16} className="text-red-500" /></button>
                  </div>
                  <div 
                    contentEditable
                    onInput={(e) => handleContentChange(section.id, e)}
                    className="w-full p-6 min-h-[300px] outline-none text-sm font-medium text-slate-400 leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: section.content || "write paragraph here........" }}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-[#1a2233]">Paragraph Image (Optional)</label>
                  <div className="flex items-start gap-6">
                    <div className="relative w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                      {(section as any).image ? (
                        <img src={(section as any).image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Plus size={24} className="text-slate-300" />
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="pt-2">
                      <label className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-all inline-block">
                        Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, section.id)} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={addContentSection} 
            className="w-full py-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all mt-8"
          >
            <Plus size={16} /> Add Content Section
          </button>
        </section>

        {/* Related Publications */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
              <h3 className="text-lg font-black text-[#1a2233] tracking-tight">Related Publications</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">(Optional)</span>
          </div>
          <button type="button" className="text-blue-600 text-xs font-bold flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all">
            <Plus size={14} /> Add Publication
          </button>
        </section>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-12">
          <button 
            type="button"
            onClick={onClose} 
            className="px-10 py-3 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-12 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            Save Research
          </button>
        </div>
      </div>
    </form>
  );
}