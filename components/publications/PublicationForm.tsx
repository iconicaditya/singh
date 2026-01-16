"use client";

import { useState } from "react";
import { X, Upload, Link as LinkIcon, FileText, Image as ImageIcon, Type, Globe } from "lucide-react";

interface PublicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function PublicationForm({ isOpen, onClose, onSuccess, initialData }: PublicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    title: "",
    journal: "",
    authors: "",
    description: "",
    year: new Date().getFullYear().toString(),
    type: "Journal",
    doi: "",
    link: "",
    imageUrl: "",
    pdfUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: data }
    );
    const result = await response.json();
    return result.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      let pdfUrl = formData.pdfUrl;

      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);
      if (pdfFile) pdfUrl = await uploadToCloudinary(pdfFile);

      const method = initialData ? "PUT" : "POST";
      const body = initialData ? { ...formData, id: initialData.id, imageUrl, pdfUrl } : { ...formData, imageUrl, pdfUrl };
      
      const res = await fetch("/api/publications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error saving publication:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md text-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[92vh] overflow-y-auto p-10 shadow-2xl relative"
      >
        <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
              {initialData ? "Update" : "Register"} <span className="text-blue-600">Publication</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Fill in all academic details for the database.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Core Info Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Type size={18} />
              <span className="text-[10px] font-black tracking-widest uppercase">Bibliographic Information</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Paper Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="The impact of AI on molecular biology..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Journal / Conference</label>
                <input
                  value={formData.journal}
                  onChange={e => setFormData({ ...formData, journal: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="e.g. Nature Communication"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Publication Year</label>
                <input
                  required
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                  placeholder="2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Author List (Order as published)</label>
                <input
                  required
                  value={formData.authors}
                  onChange={e => setFormData({ ...formData, authors: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="John Doe, Jane Smith, A. Singh*"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Publication Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 cursor-pointer appearance-none"
                >
                  <option value="Journal">Journal Article</option>
                  <option value="Conference">Conference Paper</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Review">Review Article</option>
                  <option value="Preprint">Preprint / ArXiv</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">DOI (Optional)</label>
                <input
                  value={formData.doi}
                  onChange={e => setFormData({ ...formData, doi: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="10.1038/s41586..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Abstract / Brief Summary</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 min-h-[120px] resize-none"
                  placeholder="Summarize the key findings of this work..."
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Globe size={18} />
              <span className="text-[10px] font-black tracking-widest uppercase">Media & Resources</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Group */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title Image (Thumbnail)</label>
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer group">
                    <div className="flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-2xl py-6 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                      <ImageIcon size={20} className="text-slate-400 group-hover:text-blue-600" />
                      <span className="text-xs font-black tracking-widest uppercase text-slate-600 group-hover:text-blue-600">
                        {imageFile ? "Image Ready" : "Upload File"}
                      </span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <div className="text-center text-[10px] font-black text-slate-300">OR PROVIDE URL</div>
                  <input
                    placeholder="https://images.cloudinary.com/..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* PDF/Link Group */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Document (PDF/Link)</label>
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer group">
                    <div className="flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-2xl py-6 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all">
                      <FileText size={20} className="text-slate-400 group-hover:text-blue-600" />
                      <span className="text-xs font-black tracking-widest uppercase text-slate-600 group-hover:text-blue-600">
                        {pdfFile ? "PDF Ready" : "Upload PDF"}
                      </span>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                  </label>
                  <div className="text-center text-[10px] font-black text-slate-300">OR PROVIDE LINK</div>
                  <input
                    placeholder="https://doi.org/..."
                    value={formData.pdfUrl}
                    onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex justify-end gap-6 items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-black tracking-widest uppercase text-slate-400 hover:text-slate-900 transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-5 bg-slate-900 text-white rounded-3xl text-xs font-black tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Finalize & Save"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";