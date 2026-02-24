"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Loader2, ChevronDown, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { compressImageToMaxBytes } from "@/lib/imageUploadCompression";

interface PublicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const DEFAULT_PUBLICATION_TYPES = [
  "Journal",
  "Conference",
  "Thesis",
  "Report",
  "Book Chapter",
  "Book",
  "Workshop Paper",
  "Technical Report"
];

export default function PublicationForm({ isOpen, onClose, onSuccess, initialData }: PublicationFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || "");
  const [pdfIsUrl, setPdfIsUrl] = useState(!!initialData?.pdfUrl?.startsWith("http"));
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [publicationTypes, setPublicationTypes] = useState<string[]>(DEFAULT_PUBLICATION_TYPES);
  const [showAddType, setShowAddType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [selectedType, setSelectedType] = useState(initialData?.publicationType || "");
  const [selectedYear, setSelectedYear] = useState(initialData?.year || new Date().getFullYear().toString());

  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Sync form state when initialData changes
  useEffect(() => {
    if (initialData && isOpen) {
      setCoverImageUrl(initialData.coverImageUrl || "");
      setPdfUrl(initialData.pdfUrl || "");
      setPdfIsUrl(!!initialData.pdfUrl?.startsWith("http"));
      setSelectedType(initialData.publicationType || "");
      setSelectedYear(initialData.year || new Date().getFullYear().toString());
    } else {
      // Reset form when creating new
      setCoverImageUrl("");
      setPdfUrl("");
      setPdfIsUrl(false);
      setSelectedType("");
      setSelectedYear(new Date().getFullYear().toString());
    }
  }, [initialData, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileToUpload = await compressImageToMaxBytes(file, 300 * 1024);
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setCoverImageUrl(data.secure_url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload?folder=publications', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setPdfUrl(data.secure_url);
        setPdfIsUrl(true);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPublicationType = () => {
    if (newTypeName.trim() && !publicationTypes.includes(newTypeName.trim())) {
      const newType = newTypeName.trim();
      setPublicationTypes([...publicationTypes, newType]);
      setSelectedType(newType);
      setNewTypeName("");
      setShowAddType(false);
      setIsTypeDropdownOpen(false);
    }
  };

  const handleRemovePublicationType = (typeToRemove: string) => {
    setPublicationTypes(publicationTypes.filter(t => t !== typeToRemove));
    if (selectedType === typeToRemove) {
      setSelectedType("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!coverImageUrl) {
      alert("Please upload a cover image before saving.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      ...data,
      coverImageUrl,
      pdfUrl,
      publicationType: selectedType,
      year: selectedYear,
      id: initialData?.id
    };

    try {
      const method = initialData ? "PUT" : "POST";
      const res = await fetch("/api/publications", {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 md:p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-slate-50 shrink-0">
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

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 overflow-y-auto">
          {/* First Row - Title and Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Title *</label>
              <input
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="Publication title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Publication Type *</label>
              <div className="flex gap-2 items-start">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    className="w-full px-5 py-3 md:py-4 bg-white border-2 border-slate-200 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 flex items-center justify-between hover:border-slate-300"
                  >
                    <span>{selectedType || "Select category"}</span>
                    <motion.div
                      animate={{ rotate: isTypeDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} className="text-slate-400" />
                    </motion.div>
                  </button>

                  {/* Dropdown List */}
                  <AnimatePresence>
                    {isTypeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 top-full mt-2 w-full bg-white border-2 border-slate-200 rounded-xl md:rounded-2xl shadow-lg overflow-hidden"
                      >
                        {publicationTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setSelectedType(type);
                              setIsTypeDropdownOpen(false);
                            }}
                            className={`w-full px-5 py-3 text-left font-bold text-sm transition-all flex items-center justify-between group ${
                              selectedType === type
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span>{type}</span>
                            {!DEFAULT_PUBLICATION_TYPES.includes(type) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemovePublicationType(type);
                                }}
                                className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Add Button Outside - Separate */}
                <button
                  type="button"
                  onClick={() => setShowAddType(!showAddType)}
                  className="p-3 md:p-4 bg-white border-2 border-blue-300 rounded-xl md:rounded-2xl text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center flex-shrink-0"
                  title="Add custom publication type"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Add Type Form - Below the dropdown */}
              <AnimatePresence>
                {showAddType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 mt-2"
                  >
                    <input
                      type="text"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddPublicationType()}
                      placeholder="Enter new type..."
                      className="flex-1 px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddPublicationType}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all flex-shrink-0"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddType(false);
                        setNewTypeName("");
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300 transition-all flex-shrink-0"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Second Row - Authors and Year */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Authors *</label>
              <input
                name="authors"
                defaultValue={initialData?.authors}
                required
                className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="e.g. John Doe, Jane Smith, Alex Johnson"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Year *</label>
              <input
                type="text"
                name="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="e.g. 2024 or 2023-2024"
                required
              />
            </div>
          </div>

          {/* Cover Image and Journal/Conference Name */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Cover Image</label>
              <div 
                onClick={() => coverImageInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl p-4 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group h-32 overflow-hidden"
              >
                {coverImageUrl ? (
                  <div className="relative w-full h-full">
                    <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="text-white" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {isUploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 text-center">Upload cover image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={coverImageInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/jpeg,image/png,image/webp"
                />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Journal/Conference Name</label>
              <input
                name="journalConferenceName"
                defaultValue={initialData?.journalConferenceName}
                className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="e.g. Nature Climate Change, IEEE Conference 2024"
              />
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Abstract *</label>
            <textarea
              name="abstract"
              defaultValue={initialData?.abstract}
              required
              rows={5}
              className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium resize-none"
              placeholder="Detailed abstract/summary of the publication..."
            />
          </div>

          {/* Keywords and DOI/URL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Keywords</label>
              <input
                name="keywords"
                defaultValue={initialData?.keywords}
                className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="e.g. climate change, sustainability, environment"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">DOI / URL</label>
              <input
                name="doiUrl"
                defaultValue={initialData?.doiUrl}
                className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="e.g. https://doi.org/... or https://..."
              />
            </div>
          </div>

          {/* PDF Upload */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Add Publication Document *</label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => {
                  setPdfIsUrl(false);
                  setPdfUrl("");
                }}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  !pdfIsUrl ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setPdfIsUrl(true);
                  setPdfUrl("");
                }}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  pdfIsUrl ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                🔗 Paste URL
              </button>
            </div>
            {pdfIsUrl ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                  placeholder="e.g. https://example.com/document.pdf"
                />
                {pdfUrl && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <FileText className="text-green-600" size={18} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-green-900 truncate">PDF URL Added</p>
                      <p className="text-[10px] text-green-600 truncate">{pdfUrl}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
              >
                {pdfUrl && pdfUrl.includes('/') ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 w-full overflow-hidden">
                    <FileText className="text-green-600 shrink-0" size={24} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-green-900 truncate">PDF Uploaded Successfully</p>
                      <p className="text-[10px] text-green-600 font-medium truncate">{pdfUrl.split('/').pop()}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mb-3">
                      {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">Click to upload PDF</p>
                    <p className="text-xs text-slate-400">Accepted format: PDF only</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={pdfInputRef} 
                  onChange={handlePdfFileUpload} 
                  className="hidden" 
                  accept=".pdf,application/pdf"
                  required
                />
              </div>
            )}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 px-6 md:px-8 py-3 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all mt-4 sm:mt-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedType || !pdfUrl}
              className="order-1 sm:order-2 flex-1 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl md:rounded-2xl font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-0"
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
