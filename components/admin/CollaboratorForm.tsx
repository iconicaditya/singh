"use client";

import { X, Loader2, Save, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { compressImageToMaxBytes } from "@/lib/imageUploadCompression";

interface CollaboratorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function CollaboratorForm({ isOpen, onClose, onSuccess, initialData }: CollaboratorFormProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    logoUrl: "",
    imageUrl: "",
    website: "",
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || "",
        logoUrl: initialData.logoUrl || "",
        imageUrl: initialData.imageUrl || "",
        website: initialData.website || "",
      });
    } else {
      setFormData({
        companyName: "",
        logoUrl: "",
        imageUrl: "",
        website: "",
      });
    }
  }, [initialData, isOpen]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);

    try {
      const fileToUpload = await compressImageToMaxBytes(file, 500 * 1024);
      const uploadFormData = new FormData();
      uploadFormData.append('file', fileToUpload);

      const res = await fetch('/api/upload?folder=collaborators', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, logoUrl: data.secure_url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = '/api/collaborators';
      const method = initialData?.id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialData?.id ? { ...formData, id: initialData.id } : formData),
      });

      if (res.ok) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        const error = await res.json();
        alert(error.details || "Failed to save collaborator");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]"
        >
          <div className="p-4 md:p-8 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-md z-10 rounded-t-3xl">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{initialData ? 'Edit' : 'Add'} Collaborator</h2>
              <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">Add company partners and collaborators.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Company Name (Optional)</label>
              <input
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-semibold text-slate-900"
                placeholder="e.g. Tech Corp Inc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Company Logo (Optional)</label>
              <div 
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="w-full h-48 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-400 transition-all"
              >
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} className="max-w-full max-h-full object-contain p-4" alt="Logo" />
                ) : (
                  <div className="text-slate-300 flex flex-col items-center gap-2">
                    <Building2 size={40} />
                    <span className="text-xs font-black uppercase tracking-widest">Upload Logo</span>
                  </div>
                )}
                {isUploadingLogo && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                  </div>
                )}
                <input id="logo-upload" type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Company Website (Optional)</label>
              <input
                type="url"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-semibold text-slate-900"
                placeholder="https://www.example.com"
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-1">If provided, logo will be clickable</p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-end gap-3 md:gap-4 sticky bottom-0 bg-white pb-4">
              <button type="button" onClick={onClose} className="w-full md:w-auto px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors order-2 md:order-1">Cancel</button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50 order-1 md:order-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData?.id ? "Update Collaborator" : "Add Collaborator"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
