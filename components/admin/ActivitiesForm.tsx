"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Plus, Trash2, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ContentSection {
  title: string;
  content: string;
  image: string;
}

interface ActivitiesFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ["RESEARCH", "EVENT", "WORKSHOP", "PUBLICATION"];

export default function ActivitiesForm({ onClose, onSuccess }: ActivitiesFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("RESEARCH");
  const [newCategory, setNewCategory] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tags, setTags] = useState("");
  const [titleImage, setTitleImage] = useState("");
  const [isUploadingTitle, setIsUploadingTitle] = useState(false);
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { title: "", content: "", image: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, type: 'title' | number) => {
    if (type === 'title') setIsUploadingTitle(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "research_preset"); // Ensure this preset exists in Cloudinary

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (type === 'title') {
        setTitleImage(data.secure_url);
      } else {
        const newSections = [...contentSections];
        newSections[type].image = data.secure_url;
        setContentSections(newSections);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      if (type === 'title') setIsUploadingTitle(false);
    }
  };

  const addContentSection = () => {
    setContentSections([...contentSections, { title: "", content: "", image: "" }]);
  };

  const removeContentSection = (index: number) => {
    if (contentSections.length > 1) {
      const newSections = contentSections.filter((_, i) => i !== index);
      setContentSections(newSections);
    }
  };

  const updateSection = (index: number, field: keyof ContentSection, value: string) => {
    const newSections = [...contentSections];
    newSections[index][field] = value;
    setContentSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category: newCategory || category,
          year,
          tags,
          titleImage,
          contentSections,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert("Failed to save activity");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={24} className="text-slate-400" />
        </button>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          {/* Section 1: Basic Information */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</span>
              <h2 className="text-2xl font-bold text-slate-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  placeholder="Enter title of Activities"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white pr-10"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="New category name"
                    className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button type="button" className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">Add</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Year</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Tags (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. LCA, Sustainability"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Title Image</label>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden relative">
                  {titleImage ? (
                    <img src={titleImage} className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="text-slate-300" size={32} />
                  )}
                  {isUploadingTitle && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload size={18} className="text-slate-600" />
                    <span className="text-sm font-bold text-slate-700">Choose Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'title')}
                    />
                  </label>
                  <p className="text-xs text-slate-400">No file chosen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contents */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</span>
              <h2 className="text-2xl font-bold text-slate-800">Contents</h2>
            </div>

            {contentSections.map((section, idx) => (
              <div key={idx} className="space-y-6 p-6 border border-slate-100 rounded-2xl bg-slate-50/30 relative">
                {idx > 0 && (
                  <button 
                    type="button"
                    onClick={() => removeContentSection(idx)}
                    className="absolute -right-2 -top-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <input
                  type="text"
                  placeholder="Title eg- Introduction"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  value={section.title}
                  onChange={(e) => updateSection(idx, 'title', e.target.value)}
                />

                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden min-h-[300px]">
                  <ReactQuill
                    theme="snow"
                    value={section.content}
                    onChange={(val) => updateSection(idx, 'content', val)}
                    className="h-[250px]"
                  />
                </div>

                <div className="space-y-3 pt-4">
                  <label className="text-sm font-semibold text-slate-700">Paragraph Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                      {section.image ? (
                        <img src={section.image} className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="text-slate-300" size={20} />
                      )}
                    </div>
                    <label className="px-6 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700">
                      Upload Image
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], idx)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addContentSection}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2 font-bold text-sm bg-white"
            >
              <Plus size={18} /> Add Content Section
            </button>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Add activities"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
