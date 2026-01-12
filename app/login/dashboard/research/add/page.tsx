"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Upload, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Palette, 
  Link as LinkIcon, 
  ChevronDown,
  Search,
  User,
  X,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddResearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    year: new Date().getFullYear().toString(),
    summary: "",
    titleImage: "",
    abstract: "",
    doi: "",
    journal: "",
  });
  const [sections, setSections] = useState([{ id: 1, title: "", content: "", image: "" }]);
  const [authors, setAuthors] = useState([""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: "", content: "", image: "" }]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleSectionChange = (id: number, field: string, value: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Please enter a research title.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        authors: authors.filter(a => a.trim() !== ""),
        sections: sections.map(({ title, content, image }) => ({ title, content, image })),
      };

      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/login/dashboard/research");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add research");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-20 px-4 md:px-0">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Add New Research</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage details for the research card and viewer.</p>
        </div>

        <div className="space-y-12">
          {/* 1. Basic Information */}
          <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-50 shadow-sm relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none appearance-none pr-12"
                    >
                      <option value="">Select Category</option>
                      <option value="SUSTAINABLE DEVELOPMENT">Sustainable Development</option>
                      <option value="ENVIRONMENTAL SCIENCE">Environmental Science</option>
                      <option value="SOCIAL IMPACT">Social Impact</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Year</label>
                <input 
                  type="text" 
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2026"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Summary Description *</label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formData.summary.split(/\s+/).filter(Boolean).length}/30 words</span>
                </div>
                <textarea 
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief summary (max 30 words)..." 
                  className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* 2. Advance Information */}
          <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-50 shadow-sm relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-slate-800">Advance Information</h2>
            </div>

            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Abstract</label>
                <textarea 
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  placeholder="Detailed abstract..." 
                  className="w-full h-40 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-6">
                <label className="text-sm font-bold text-slate-700">Contents</label>
                
                {sections.map((section, index) => (
                  <div key={section.id} className="relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm group">
                    <button 
                      onClick={() => removeSection(section.id)}
                      className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <input 
                      type="text" 
                      value={section.title}
                      onChange={(e) => handleSectionChange(section.id, "title", e.target.value)}
                      placeholder="Section Title (e.g. Introduction)" 
                      className="w-full px-6 py-5 border-b border-slate-100 text-sm font-bold text-slate-700 focus:outline-none bg-white"
                    />

                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-1">
                       {/* Toolbar placeholders */}
                       <div className="flex items-center gap-1 text-slate-400 p-1">
                         <AlignLeft size={16} />
                         <AlignCenter size={16} />
                         <AlignRight size={16} />
                         <AlignJustify size={16} />
                         <div className="w-px h-4 bg-slate-200 mx-2" />
                         <Palette size={16} />
                         <LinkIcon size={16} />
                       </div>
                    </div>

                    <textarea 
                      value={section.content}
                      onChange={(e) => handleSectionChange(section.id, "content", e.target.value)}
                      placeholder="Enter section content..."
                      className="w-full h-48 px-6 py-6 bg-white outline-none text-sm text-slate-500 resize-none"
                    />
                  </div>
                ))}

                <button 
                  onClick={addSection}
                  className="w-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all font-bold"
                >
                  <Plus size={20} />
                  Add Content Section
                </button>
              </div>
            </div>
          </section>

          {/* 3. Paper Details & Authors */}
          <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-50 shadow-sm relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
              <h2 className="text-xl font-bold text-slate-800">Paper Details & Authors</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Authors</label>
                <div className="space-y-3">
                  {authors.map((author, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                        <User size={20} />
                      </div>
                      <input 
                        type="text" 
                        value={author}
                        onChange={(e) => handleAuthorChange(index, e.target.value)}
                        placeholder="Author Name" 
                        className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                      />
                      {authors.length > 1 && (
                        <button onClick={() => removeAuthor(index)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={addAuthor}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all font-bold text-sm"
                >
                  <Plus size={18} />
                  Add Author
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">DOI</label>
                  <input 
                    type="text" 
                    name="doi"
                    value={formData.doi}
                    onChange={handleInputChange}
                    placeholder="10.1021/..." 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Journal</label>
                  <input 
                    type="text" 
                    name="journal"
                    value={formData.journal}
                    onChange={handleInputChange}
                    placeholder="e.g. Env. Sci. & Tech." 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-16 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4">
           <button 
             onClick={() => router.push("/login/dashboard/research")}
             disabled={loading}
             className="w-full sm:w-auto px-10 py-4 text-slate-600 font-black hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-50"
           >
             Cancel
           </button>
           <button 
             onClick={handleSubmit}
             disabled={loading}
             className="w-full sm:w-auto px-12 py-4 bg-[#2563eb] text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:translate-y-0"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : null}
             Publish Research
           </button>
        </div>
      </div>
    </AdminLayout>
  );
}
