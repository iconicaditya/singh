"use client";

import { X, Plus, Trash2, Bold, Italic, Underline, Link, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ResearchFormProps {
  onClose: () => void;
  initialData?: any;
}

export default function ResearchForm({ onClose, initialData }: ResearchFormProps) {
  const [authors, setAuthors] = useState(initialData?.authors || [""]);
  const [contentSections, setContentSections] = useState(initialData?.contentSections || [{ title: "", content: "" }]);

  const addAuthor = () => setAuthors([...authors, ""]);
  const removeAuthor = (index: number) => setAuthors(authors.filter((_: string, i: number) => i !== index));

  const addContentSection = () => setContentSections([...contentSections, { title: "", content: "" }]);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Add New Research</h2>
          <p className="text-xs text-slate-400 font-medium">Manage details for the research card and viewer.</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 max-w-5xl mx-auto space-y-12">
        {/* Section 1: Basic Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" placeholder="Research title" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
              <div className="flex gap-2">
                <select className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-bold text-black appearance-none">
                  <option>RESEARCH</option>
                </select>
                <input type="text" className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" placeholder="New category name" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20">Add</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" placeholder="2026" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags (Comma Separated)</label>
              <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" placeholder="e.g. LCA, Sustainability" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Title Image</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                <Plus size={32} />
              </div>
              <div className="space-y-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <ImageIcon size={14} /> Choose Image
                </button>
                <p className="text-[10px] text-slate-400">No file chosen</p>
              </div>
            </div>
          </div>
        </section>

        {/* Paper Details */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Paper Details</h3>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authors</label>
            {authors.map((author: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Plus size={16} />
                  </span>
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all text-sm font-semibold text-black" 
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => {
                      const newAuthors = [...authors];
                      newAuthors[index] = e.target.value;
                      setAuthors(newAuthors);
                    }}
                  />
                </div>
                {authors.length > 1 && (
                  <button onClick={() => removeAuthor(index)} className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addAuthor} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              <Plus size={14} /> Add Author
            </button>
          </div>
        </section>

        {/* Section 2: Research Contents */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Research Contents</h3>
          </div>

          <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
            <input 
              type="text" 
              className="w-full bg-transparent border-b border-slate-200 py-2 outline-none focus:border-blue-500 transition-all text-lg font-bold text-slate-800 placeholder:text-slate-300" 
              placeholder="Title eg:- Introduction"
            />

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-1 pr-2 border-r border-slate-200 mr-1">
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><Bold size={14} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><Italic size={14} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><Underline size={14} /></button>
                </div>
                <div className="flex items-center gap-1 pr-2 border-r border-slate-200 mr-1">
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><AlignLeft size={14} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><AlignCenter size={14} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><AlignRight size={14} /></button>
                </div>
                <div className="flex items-center gap-1 pr-2 border-r border-slate-200 mr-1">
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><List size={14} /></button>
                  <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><ListOrdered size={14} /></button>
                </div>
                <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400"><Link size={14} /></button>
                <button className="p-1.5 hover:bg-white rounded transition-all text-slate-400 ml-auto"><ImageIcon size={14} /></button>
              </div>
              <textarea 
                rows={10} 
                className="w-full p-6 outline-none text-sm font-medium text-slate-600 resize-none leading-relaxed" 
                placeholder="write paragraph here........"
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Paragraph Image (Optional)</label>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                  <Plus size={24} />
                </div>
                <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <button onClick={addContentSection} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all group">
            <Plus size={16} className="group-hover:scale-110 transition-transform" /> Add Content Section
          </button>
        </section>

        {/* Related Publications */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Related Publications</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">(Optional)</span>
          </div>
          <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
            <Plus size={14} /> Add Publication
          </button>
        </section>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-12 border-t border-slate-50">
          <button onClick={onClose} className="px-10 py-3.5 rounded-xl text-sm font-black text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
          <button className="px-12 py-3.5 rounded-xl text-sm font-black bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">Save Research</button>
        </div>
      </div>
    </div>
  );
}