"use client";

import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface GalleryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function GalleryForm({ isOpen, onClose, onSuccess, initialData }: GalleryFormProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const url = initialData ? `/api/gallery?id=${initialData.id}` : "/api/gallery";
      const method = initialData ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {initialData ? "Edit" : "Add"} <span className="text-blue-600">Gallery Item</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage visual research documentation.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Title</label>
              <input
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="Item title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
              <select
                name="category"
                defaultValue={initialData?.category || "PLASTIC WASTE"}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium appearance-none"
              >
                <option value="PLASTIC WASTE">PLASTIC WASTE</option>
                <option value="RECYCLING">RECYCLING</option>
                <option value="LANDFILL MGMT">LANDFILL MGMT</option>
                <option value="ORGANIC WASTE">ORGANIC WASTE</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Image URL</label>
            <div className="relative">
              <input
                name="imageUrl"
                defaultValue={initialData?.imageUrl}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium pl-12"
                placeholder="https://..."
              />
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              rows={4}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium resize-none"
              placeholder="Detailed description..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
            >
              <Upload size={18} /> {initialData ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
