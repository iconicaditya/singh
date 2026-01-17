"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface PublicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function PublicationForm({ isOpen, onClose, onSuccess, initialData }: PublicationFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
  const [categories, setCategories] = useState<string[]>(["RESEARCH", "PUBLICATION", "PROJECT"]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "RESEARCH");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/publications");
        const data = await res.json();
        if (Array.isArray(data)) {
          const existingCategories = Array.from(new Set(data.map((item: any) => item.category))) as string[];
          setCategories(prev => Array.from(new Set([...prev, ...existingCategories])));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim().toUpperCase())) {
      const cat = newCategory.trim().toUpperCase();
      setCategories([...categories, cat]);
      setSelectedCategory(cat);
      setNewCategory("");
      setShowAddCategory(false);
      setIsCategoryDropdownOpen(false);
    }
  };

  const handleDeleteCategory = (e: React.MouseEvent, catToDelete: string) => {
    e.stopPropagation();
    setCategories(categories.filter(cat => cat !== catToDelete));
    if (selectedCategory === catToDelete) {
      setSelectedCategory(categories[0] || "");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setPdfUrl(data.secure_url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    data.pdfUrl = pdfUrl;
    data.category = selectedCategory;

    try {
      const url = initialData ? "/api/publications" : "/api/publications";
      const method = initialData ? "PUT" : "POST";
      
      const payload = initialData ? { ...data, id: initialData.id } : data;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
              {initialData ? "Edit" : "Add"} <span className="text-blue-600">Publication</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Manage scholarly works and research papers.</p>
          </div>
          <button onClick={onClose} type="button" className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-slate-200 shrink-0">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Title</label>
                <input
                  name="title"
                  defaultValue={initialData?.title}
                  required
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                  placeholder="Publication title..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 relative" ref={dropdownRef}>
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium flex items-center justify-between text-left"
                      >
                        <span className="truncate">{selectedCategory || "Select category"}</span>
                        <ChevronDown size={18} className={`transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isCategoryDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 bottom-full mb-2 w-full bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden py-2"
                          >
                            <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 mb-1">
                              Select category
                            </div>
                            {categories.map((cat) => (
                              <div
                                key={cat}
                                onClick={() => {
                                  setSelectedCategory(cat);
                                  setIsCategoryDropdownOpen(false);
                                }}
                                className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex items-center justify-between group ${
                                  selectedCategory === cat ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                <span className="truncate">{cat}</span>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteCategory(e, cat)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(!showAddCategory)}
                      className="p-3 md:p-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm flex items-center justify-center shrink-0"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAddCategory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 flex gap-2"
                      >
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="New category..."
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 text-sm font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                          Add
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Authors</label>
                  <input
                    name="authors"
                    defaultValue={initialData?.authors}
                    required
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                    placeholder="e.g. John Doe, Jane Smith"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Tags</label>
                <input
                  name="tags"
                  defaultValue={initialData?.tags}
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                  placeholder="e.g. environment, sustainability"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">PDF Document</label>
                <div className="flex flex-col gap-3">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    {pdfUrl ? (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 w-full overflow-hidden">
                        <FileText className="text-blue-600 shrink-0" size={24} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-blue-900 truncate">PDF Uploaded</p>
                          <p className="text-[10px] text-blue-400 font-medium truncate">{pdfUrl}</p>
                        </div>
                        <Upload className="text-blue-400 group-hover:text-blue-600 shrink-0" size={20} />
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        </div>
                        <p className="text-xs font-bold text-slate-600">Click to upload PDF</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept=".pdf"
                    />
                  </div>
                  <input
                    name="pdfUrl"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-[11px]"
                    placeholder="Or paste direct PDF URL..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Short Description</label>
                <textarea
                  name="description"
                  defaultValue={initialData?.description}
                  rows={4}
                  required
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium resize-none"
                  placeholder="Brief overview of the work..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 px-6 md:px-8 py-3 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !pdfUrl}
              className="order-1 sm:order-2 flex-[2] px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />} 
              {initialData ? "Update Publication" : "Create Publication"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}