"use client";

import { X, Plus, Trash2, Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Save, RotateCcw, ChevronDown, Type, Search, User, FileText } from "lucide-react";
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
  const [categories, setCategories] = useState<string[]>(["RESEARCH", "PUBLICATION", "CASE STUDY", "WASTE MANAGEMENT", "CLIMATE CHANGE"]);

  useEffect(() => {
    // Fetch available publications for selection
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

  const addAuthor = () => setAuthors([...authors, { name: "", image: "" }]);
  const removeAuthor = (index: number) => setAuthors(authors.filter((_, i) => i !== index));

  const addContentSection = () => {
    const newId = crypto.randomUUID();
    setContentSections([...contentSections, { id: newId, title: "", content: "", image: "" }]);
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

      if (response.ok) {
        onClose();
      } else {
        throw new Error("Failed to save research");
      }
    } catch (error) {
      alert("Error saving research");
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white min-h-screen pb-20 rounded-[2.5rem] overflow-y-auto max-h-[90vh]">
      <div className="flex items-center justify-between p-6 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-20">
        <div>
          <h2 className="text-xl font-black text-[#1a2233]">Professional Research Manager</h2>
          <p className="text-sm text-slate-400">Configure authors, content, and publications.</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 max-w-5xl mx-auto space-y-12">
        {/* Basic Info */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-[#1a2233] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</div>
            Header & Meta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" placeholder="Research Title" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500"
            />
            <select 
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
              {formData.titleImage ? <img src={formData.titleImage} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
            </div>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
              Upload Header Image
              <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'title')} />
            </label>
          </div>
        </section>

        {/* Authors */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-[#1a2233] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</div>
            Authors with Images
          </h3>
          <div className="space-y-4">
            {authors.map((author, index) => (
              <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  {author.image ? <img src={author.image} className="w-full h-full object-cover" /> : <User className="m-auto text-slate-400" />}
                  <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Plus size={16} className="text-white" />
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'author', index)} />
                  </label>
                </div>
                <input 
                  type="text" placeholder="Author Name" 
                  value={author.name} onChange={e => {
                    const newAuthors = [...authors];
                    newAuthors[index].name = e.target.value;
                    setAuthors(newAuthors);
                  }}
                  className="flex-1 bg-transparent outline-none font-bold"
                />
                <button type="button" onClick={() => removeAuthor(index)} className="text-rose-500"><Trash2 size={18} /></button>
              </div>
            ))}
            <button type="button" onClick={addAuthor} className="text-blue-600 text-sm font-bold flex items-center gap-2"><Plus size={16} /> Add Author</button>
          </div>
        </section>

        {/* Content Sections */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-[#1a2233] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">3</div>
            Professional Content Sections
          </h3>
          <div className="space-y-10">
            {contentSections.map((section, index) => (
              <div key={section.id} className="p-6 border border-slate-100 rounded-3xl space-y-4 relative">
                <div className="flex justify-between">
                  <input 
                    type="text" placeholder="Section Heading" 
                    value={section.title} onChange={e => {
                      const newS = [...contentSections];
                      newS[index].title = e.target.value;
                      setContentSections(newS);
                    }}
                    className="text-lg font-black outline-none w-full"
                  />
                  <button type="button" onClick={() => setContentSections(contentSections.filter(s => s.id !== section.id))} className="text-slate-300 hover:text-rose-500"><X size={20} /></button>
                </div>
                
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-2 flex gap-1 border-b border-slate-100 flex-wrap">
                    <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded"><Bold size={16} /></button>
                    <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded"><Italic size={16} /></button>
                    <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-white rounded"><Underline size={16} /></button>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded"><List size={16} /></button>
                    <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white rounded"><AlignLeft size={16} /></button>
                    <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-white rounded"><AlignCenter size={16} /></button>
                    <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-white rounded"><AlignRight size={16} /></button>
                  </div>
                  <div 
                    contentEditable 
                    onInput={e => handleContentChange(section.id, e)}
                    className="p-6 min-h-[200px] outline-none text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {section.image ? <img src={section.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
                  </div>
                  <label className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-200 transition-all">
                    Upload Section Image
                    <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'section', undefined, section.id)} />
                  </label>
                </div>
              </div>
            ))}
            <button type="button" onClick={addContentSection} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all">+ Add Detailed Section</button>
          </div>
        </section>

        {/* Publications Search */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-[#1a2233] flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">4</div>
            Related Publications
          </h3>
          
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" placeholder="Search publications to link..." 
                  value={publicationSearch} onChange={e => {
                    setPublicationSearch(e.target.value);
                    setShowPubSearch(true);
                  }}
                  onFocus={() => setShowPubSearch(true)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <AnimatePresence>
              {showPubSearch && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-30 max-h-60 overflow-y-auto p-2"
                >
                  {availablePublications
                    .filter(p => p.title.toLowerCase().includes(publicationSearch.toLowerCase()))
                    .map(pub => (
                      <button 
                        key={pub.id} type="button"
                        onClick={() => {
                          if (!relatedPublications.find(r => r.id === pub.id)) {
                            setRelatedPublications([...relatedPublications, pub]);
                          }
                          setShowPubSearch(false);
                          setPublicationSearch("");
                        }}
                        className="w-full text-left p-3 hover:bg-blue-50 rounded-xl flex items-center gap-3 transition-colors"
                      >
                        <FileText size={18} className="text-blue-500" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">{pub.title}</p>
                          <p className="text-[10px] text-slate-400">{pub.year} • {pub.authors}</p>
                        </div>
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPublications.map(pub => (
              <div key={pub.id} className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm font-bold text-blue-900 line-clamp-1">{pub.title}</p>
                  <p className="text-[10px] text-blue-400 font-bold uppercase">{pub.category}</p>
                </div>
                <button type="button" onClick={() => setRelatedPublications(relatedPublications.filter(r => r.id !== pub.id))} className="text-blue-400 hover:text-rose-500"><X size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-10 border-t border-slate-50">
          <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Save Research</button>
        </div>
      </div>
    </form>
  );
}
