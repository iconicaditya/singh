"use client";

import React, { useState } from "react";
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
  User,
  X,
  Loader2,
  FileText,
  Settings,
  Users as UsersIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
    setTimeout(() => {
      setLoading(false);
      router.push("/login/dashboard/research");
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const inputStyles = "w-full px-5 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all duration-300 shadow-sm";
  const labelStyles = "text-sm font-bold text-slate-900 flex items-center gap-2 mb-2";

  return (
    <AdminLayout>
      <motion.div 
        className="max-w-5xl mx-auto pb-20 px-4 md:px-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mb-10 text-center md:text-left">
          <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-slate-950 tracking-tight">Add New Research</motion.h1>
          <motion.p variants={itemVariants} className="text-slate-600 mt-3 font-medium text-lg">Manage details for the research card and viewer with professional precision.</motion.p>
        </div>

        <div className="space-y-12">
          {/* 1. Basic Information */}
          <motion.section 
            variants={itemVariants}
            className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 group-hover:w-3 transition-all duration-500"></div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-sm">1</div>
              <h2 className="text-2xl font-bold text-slate-950">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-2">
                <label className={labelStyles}><FileText size={16} className="text-blue-600" /> Research Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Impact of Climate Change on Urban Ecosystems" 
                  className={inputStyles}
                />
              </div>

              <div className="space-y-2">
                <label className={labelStyles}><Settings size={16} className="text-blue-600" /> Category</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`${inputStyles} appearance-none pr-12`}
                    >
                      <option value="">Select Category</option>
                      <option value="SUSTAINABLE DEVELOPMENT">Sustainable Development</option>
                      <option value="ENVIRONMENTAL SCIENCE">Environmental Science</option>
                      <option value="SOCIAL IMPACT">Social Impact</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelStyles}>Publication Year</label>
                <input 
                  type="text" 
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2026"
                  className={inputStyles}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className={labelStyles}>Summary Description *</label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">
                    {formData.summary.split(/\s+/).filter(Boolean).length}/30 words
                  </span>
                </div>
                <textarea 
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief summary for list view (max 30 words)..." 
                  className={`${inputStyles} h-32 resize-none`}
                />
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className={labelStyles}><Upload size={16} className="text-blue-600" /> Cover Image</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="w-full sm:w-48 h-32 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-2 bg-slate-50 hover:bg-white hover:border-blue-400 transition-all duration-300"
                  >
                    <Upload size={24} />
                    <span className="text-xs font-bold">Preview Area</span>
                  </motion.div>
                  <button className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all duration-300 shadow-xl active:scale-95">
                    <Plus size={20} />
                    Choose High-Res Image
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 2. Advance Information */}
          <motion.section 
            variants={itemVariants}
            className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600 group-hover:w-3 transition-all duration-500"></div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-sm">2</div>
              <h2 className="text-2xl font-bold text-slate-950">Advanced Content</h2>
            </div>

            <div className="space-y-10">
              <div className="space-y-2">
                <label className={labelStyles}>Detailed Abstract</label>
                <textarea 
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  placeholder="Enter the full technical abstract here..." 
                  className={`${inputStyles} h-48 resize-none`}
                />
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <label className={labelStyles}>Content Sections</label>
                  <p className="text-xs font-semibold text-slate-500">Add detailed subsections with titles and images</p>
                </div>
                
                <AnimatePresence>
                  {sections.map((section) => (
                    <motion.div 
                      key={section.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative bg-white border border-slate-300 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <button 
                        onClick={() => removeSection(section.id)}
                        className="absolute top-6 right-6 p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 z-10 shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <input 
                        type="text" 
                        value={section.title}
                        onChange={(e) => handleSectionChange(section.id, "title", e.target.value)}
                        placeholder="Section Heading (e.g. Methodology)" 
                        className="w-full px-8 py-6 border-b border-slate-200 text-base font-bold text-slate-950 focus:outline-none bg-slate-50/50"
                      />

                      <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2">
                         <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                           <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><AlignLeft size={18} /></button>
                           <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><AlignCenter size={18} /></button>
                           <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><AlignRight size={18} /></button>
                         </div>
                         <div className="w-px h-6 bg-slate-300 mx-2" />
                         <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><Palette size={18} /></button>
                         <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><LinkIcon size={18} /></button>
                      </div>

                      <textarea 
                        value={section.content}
                        onChange={(e) => handleSectionChange(section.id, "content", e.target.value)}
                        placeholder="Start writing section content..."
                        className="w-full h-56 px-8 py-8 bg-white outline-none text-base text-slate-800 leading-relaxed resize-none placeholder:text-slate-400"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={addSection}
                  className="w-full py-10 border-2 border-dashed border-slate-300 rounded-[2rem] flex items-center justify-center gap-3 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 font-extrabold text-lg"
                >
                  <Plus size={24} />
                  Add New Content Subsection
                </motion.button>
              </div>
            </div>
          </motion.section>

          {/* 3. Research Team & Citations */}
          <motion.section 
            variants={itemVariants}
            className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-600 group-hover:w-3 transition-all duration-500"></div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg shadow-sm">3</div>
              <h2 className="text-2xl font-bold text-slate-950">Research Team & Citations</h2>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className={labelStyles}><UsersIcon size={16} className="text-orange-600" /> Contributing Authors</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {authors.map((author, index) => (
                    <motion.div 
                      key={index}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-focus-within:bg-orange-50 group-focus-within:text-orange-600 transition-colors duration-300">
                        <User size={20} />
                      </div>
                      <input 
                        type="text" 
                        value={author}
                        onChange={(e) => handleAuthorChange(index, e.target.value)}
                        placeholder="Author Full Name" 
                        className={inputStyles}
                      />
                      {authors.length > 1 && (
                        <button onClick={() => removeAuthor(index)} className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300">
                          <X size={18} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
                <button 
                  onClick={addAuthor}
                  className="w-full sm:w-auto px-8 py-3.5 border-2 border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-all duration-300 font-bold text-sm mt-4"
                >
                  <Plus size={18} />
                  Add Co-Author
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-100">
                <div className="space-y-2">
                  <label className={labelStyles}>Digital Object Identifier (DOI)</label>
                  <input 
                    type="text" 
                    name="doi"
                    value={formData.doi}
                    onChange={handleInputChange}
                    placeholder="e.g. 10.1021/acs.est.2c01234" 
                    className={inputStyles}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelStyles}>Journal / Publication Venue</label>
                  <input 
                    type="text" 
                    name="journal"
                    value={formData.journal}
                    onChange={handleInputChange}
                    placeholder="e.g. Nature Communications" 
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Footer Actions */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 bg-white/90 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-6 sticky bottom-10 z-20"
        >
           <button 
             onClick={() => router.push("/login/dashboard/research")}
             disabled={loading}
             className="w-full sm:w-auto px-10 py-5 text-slate-600 font-extrabold hover:text-slate-950 hover:bg-slate-100 rounded-[1.5rem] transition-all duration-300 disabled:opacity-50"
           >
             Discard Changes
           </button>
           <motion.button 
             whileHover={{ scale: 1.02, y: -2 }}
             whileTap={{ scale: 0.98 }}
             onClick={handleSubmit}
             disabled={loading}
             className="w-full sm:w-auto px-16 py-5 bg-blue-600 text-white font-black rounded-[1.5rem] shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 group"
           >
             {loading ? <Loader2 className="animate-spin" size={24} /> : null}
             {!loading && "Confirm & Publish"}
           </motion.button>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
