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
              <div key={section.id} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Title eg:- Introduction"
                  value={section.title}
                  onChange={e => {
                    const newS = [...contentSections];
                    newS[index].title = e.target.value;
                    setContentSections(newS);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-0 text-slate-900"
                />

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-white border-b border-gray-100 px-3 py-2 flex items-center gap-1">
                    <button type="button" onClick={() => execCommand('undo')} className="p-1.5 text-slate-400 hover:text-slate-600"><Undo2 size={14} /></button>
                    <button type="button" onClick={() => execCommand('redo')} className="p-1.5 text-slate-400 hover:text-slate-600"><Redo2 size={14} /></button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    
                    <button type="button" className="px-3 py-1 text-[11px] font-bold text-slate-600 border border-gray-100 rounded flex items-center gap-2">Font <ChevronDown size={10} /></button>
                    <button type="button" className="px-3 py-1 text-[11px] font-bold text-slate-600 border border-gray-100 rounded flex items-center gap-2">Size <ChevronDown size={10} /></button>
                    
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    
                    <button type="button" onClick={() => execCommand('bold')} className="p-1.5 text-slate-600 hover:text-black"><Bold size={14} /></button>
                    <button type="button" onClick={() => execCommand('italic')} className="p-1.5 text-slate-600 hover:text-black"><Italic size={14} /></button>
                    <button type="button" onClick={() => execCommand('underline')} className="p-1.5 text-slate-600 hover:text-black"><Underline size={14} /></button>
                    
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    
                    <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600"><Palette size={14} /><ChevronDown size={8} className="inline ml-0.5" /></button>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600"><Palette size={14} className="text-rose-400" /><ChevronDown size={8} className="inline ml-0.5" /></button>
                    
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    
                    <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 text-slate-600 hover:text-black"><List size={14} /></button>
                    <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 text-slate-600 hover:text-black"><ListOrdered size={14} /></button>
                    <button type="button" onClick={() => execCommand('justifyFull')} className="p-1.5 text-slate-600 hover:text-black"><AlignLeft size={14} /></button>
                    
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    
                    <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 text-slate-400 hover:text-slate-600"><AlignLeft size={14} /></button>
                    <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 text-slate-400 hover:text-slate-600"><AlignCenter size={14} /></button>
                    <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 text-slate-400 hover:text-slate-600"><AlignRight size={14} /></button>
                    <button type="button" onClick={() => execCommand('justifyFull')} className="p-1.5 text-slate-400 hover:text-slate-600"><AlignLeft size={14} className="scale-x-[-1]" /></button>
                    
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    
                    <button type="button" onClick={() => { const url = prompt("Link:"); if(url) execCommand('createLink', url); }} className="p-1.5 text-slate-600 hover:text-black"><LinkIcon size={14} /></button>
                    <button type="button" className="p-1.5 text-rose-500 ml-auto"><Trash2 size={14} /></button>
                  </div>
                  <div 
                    contentEditable 
                    onInput={e => handleContentChange(section.id, e)}
                    className="p-6 min-h-[300px] outline-none text-slate-900 text-sm leading-relaxed relative"
                    dangerouslySetInnerHTML={{ __html: section.content || "" }}
                  />
                  {!section.content && (
                    <div className="absolute left-6 top-[108px] pointer-events-none text-slate-300 italic text-sm">
                      write paragraph here........
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Paragraph Image (Optional)</label>
                  <div className="flex items-start gap-4">
                    <div className="w-28 h-20 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative">
                      {section.image ? (
                        <img src={section.image} className="w-full h-full object-cover" />
                      ) : (
                        <Plus size={24} className="text-slate-300" />
                      )}
                    </div>
                    <label className="inline-flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg text-[11px] font-bold text-slate-600 cursor-pointer hover:bg-gray-50 transition-colors">
                      Upload Image
                      <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'section', undefined, section.id)} />
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={() => setContentSections([...contentSections, { id: crypto.randomUUID(), title: "", content: "", image: "" }])} className="w-full py-2.5 border border-gray-200 rounded-lg text-[11px] font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-gray-50">
              <Plus size={14} /> Add Content Section
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
