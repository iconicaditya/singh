"use client";

import { X, Upload, Loader2, Save, Trash2, Linkedin, Twitter, Globe, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function TeamForm({ isOpen, onClose, onSuccess, initialData }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    imageUrl: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: ""
    }
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        role: initialData.role || "",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
        socialLinks: initialData.socialLinks || { linkedin: "", twitter: "", facebook: "", instagram: "" }
      });
    } else {
      setFormData({
        name: "",
        role: "",
        description: "",
        imageUrl: "",
        socialLinks: { linkedin: "", twitter: "", facebook: "", instagram: "" }
      });
    }
  }, [initialData, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const res = await fetch('/api/upload?folder=team', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.role || !formData.description || !formData.imageUrl) {
      alert("All fields including the profile image are mandatory.");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = '/api/team';
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
        alert(error.details || "Failed to save team member");
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
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{initialData ? 'Edit' : 'Add'} Team Member</h2>
              <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">Manage the research lab's team profiles.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:y-8">
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => document.getElementById('team-image-upload')?.click()}
                className="w-32 h-32 rounded-full border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-400 transition-all"
              >
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="text-slate-300 flex flex-col items-center gap-1">
                    <User size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Upload photo</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                  </div>
                )}
                <input id="team-image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Profile photo is mandatory</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Full Name *</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-semibold text-slate-900"
                  placeholder="e.g. Dr. John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Role / Designation *</label>
                <input
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-semibold text-slate-900"
                  placeholder="e.g. Principal Investigator"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">Short Description *</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-semibold text-slate-900 h-24"
                placeholder="Brief bio or research focus..."
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Social Media Links</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={formData.socialLinks.linkedin}
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-semibold text-slate-900"
                    placeholder="LinkedIn Profile URL"
                  />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={formData.socialLinks.twitter}
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-semibold text-slate-900"
                    placeholder="Twitter Profile URL"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <input
                    value={formData.socialLinks.facebook}
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-semibold text-slate-900"
                    placeholder="Facebook Profile URL"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  <input
                    value={formData.socialLinks.instagram}
                    onChange={e => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm font-semibold text-slate-900"
                    placeholder="Instagram Profile URL"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-end gap-3 md:gap-4 sticky bottom-0 bg-white pb-4">
              <button type="button" onClick={onClose} className="w-full md:w-auto px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors order-2 md:order-1">Cancel</button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50 order-1 md:order-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData?.id ? "Update Member" : "Add Member"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}