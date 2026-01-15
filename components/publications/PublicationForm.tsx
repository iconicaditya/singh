"use client";

import { useState } from "react";
import { X, Upload, Link as LinkIcon, FileText, Image as ImageIcon } from "lucide-react";

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

  const uploadToCloudinary = async (file: File, resourceType: "image" | "raw") => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default"); // Use your preset or we'll assume default
    
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

      if (imageFile) imageUrl = await uploadToCloudinary(imageFile, "image");
      if (pdfFile) pdfUrl = await uploadToCloudinary(pdfFile, "raw");

      const method = initialData ? "PUT" : "POST";
      const res = await fetch("/api/publications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl, pdfUrl }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-black">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {initialData ? "Edit Publication" : "Add Publication"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
              <input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                placeholder="Paper title..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Journal/Publisher</label>
              <input
                value={formData.journal}
                onChange={e => setFormData({ ...formData, journal: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Nature, Science"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
              <input
                required
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Authors (comma separated)</label>
              <input
                required
                value={formData.authors}
                onChange={e => setFormData({ ...formData, authors: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                placeholder="Author 1, Author 2..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                placeholder="Brief description of the publication..."
              />
            </div>

            {/* Media Uploads */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-4 hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <ImageIcon size={20} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Upload Image</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </label>
                <div className="text-center font-bold">OR</div>
                <input
                  placeholder="Image URL..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              {imageFile && <p className="text-xs text-blue-600 font-bold">Selected: {imageFile.name}</p>}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">PDF File</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-4 hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <FileText size={20} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Upload PDF</span>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                </label>
                <div className="text-center font-bold">OR</div>
                <input
                  placeholder="External Link..."
                  value={formData.pdfUrl}
                  onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              {pdfFile && <p className="text-xs text-blue-600 font-bold">Selected: {pdfFile.name}</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Publication"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}