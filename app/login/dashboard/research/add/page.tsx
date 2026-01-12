"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Plus, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  Palette, 
  Link as LinkIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered,
  X,
  ChevronDown,
  Search,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddResearchPage() {
  const router = useRouter();
  const [sections, setSections] = useState([{ id: 1, title: "", content: "" }]);
  const [authors, setAuthors] = useState([""]);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: "", content: "" }]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Add New Research</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage details for the research card and viewer.</p>
        </div>

        <div className="space-y-12">
          {/* 1. Basic Information */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Title</label>
                <input 
                  type="text" 
                  placeholder="Enter title" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none appearance-none pr-12 text-slate-400">
                      <option>Select Category</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                  <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-800 rounded-xl hover:bg-slate-50 transition-colors">
                    <Plus size={20} className="text-slate-800" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Year</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Summary Description *</label>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">0/30 words</span>
                </div>
                <textarea 
                  placeholder="Brief summary (max 30 words)..." 
                  className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Title Image</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-2 bg-slate-50/50">
                    <Upload size={24} />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 border-2 border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                    <Upload size={18} />
                    Choose Image
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Advance Information */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-slate-800">Advance Information</h2>
            </div>

            <div className="space-y-10">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Abstract</label>
                <textarea 
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
                      placeholder="Section Title (e.g. Introduction)" 
                      className="w-full px-6 py-5 border-b border-slate-100 text-sm font-bold text-slate-700 focus:outline-none bg-white"
                    />

                    {/* Rich Text Toolbar Mockup */}
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-1">
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><AlignLeft size={16} /></button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><AlignCenter size={16} /></button>
                      <div className="w-px h-6 bg-slate-200 mx-1"></div>
                      <div className="relative px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer min-w-[80px]">
                        Font <ChevronDown size={14} className="ml-auto" />
                      </div>
                      <div className="relative px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer min-w-[70px]">
                        Size <ChevronDown size={14} className="ml-auto" />
                      </div>
                      <div className="w-px h-6 bg-slate-200 mx-1"></div>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all font-bold">B</button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all italic">I</button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all underline">U</button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><Palette size={16} /></button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><LinkIcon size={16} /></button>
                      <div className="w-px h-6 bg-slate-200 mx-1"></div>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><AlignLeft size={16} /></button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><AlignCenter size={16} /></button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><AlignRight size={16} /></button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><AlignJustify size={16} /></button>
                      <div className="w-px h-6 bg-slate-200 mx-1"></div>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><List size={16} /></button>
                      <button className="p-2 text-slate-400 hover:bg-white rounded-lg transition-all"><ListOrdered size={16} /></button>
                    </div>

                    <div className="h-48 px-6 py-6 bg-white outline-none text-sm text-slate-500">
                      {/* Section content placeholder */}
                    </div>

                    <div className="p-6 bg-slate-50/30 space-y-4">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section Image (Optional)</label>
                       <div className="flex items-center gap-4">
                          <div className="w-20 h-20 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300 bg-white">
                            <Upload size={18} />
                          </div>
                          <button className="px-4 py-2 bg-white border-2 border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm">
                            Upload Image
                          </button>
                       </div>
                    </div>
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
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm relative">
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
                    placeholder="10.1021/..." 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Journal</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Env. Sci. & Tech." 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Related Publications */}
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">4</div>
              <h2 className="text-xl font-bold text-slate-800">Related Publications</h2>
            </div>

            <div className="space-y-6">
               <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Search and Add Publications..." 
                   className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-blue-400 transition-all outline-none font-medium text-slate-500"
                 />
               </div>
               
               <div className="h-20 bg-slate-50/50 rounded-2xl flex items-center justify-center border border-slate-100">
                  <p className="text-sm font-medium text-slate-400">No related publications added yet</p>
               </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-16 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-end gap-4">
           <button 
             onClick={() => router.push("/login/dashboard/research")}
             className="px-10 py-4 text-slate-600 font-black hover:bg-slate-50 rounded-2xl transition-all"
           >
             Cancel
           </button>
           <button 
             onClick={() => router.push("/login/dashboard/research")}
             className="px-12 py-4 bg-[#2563eb] text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
           >
             Publish Research
           </button>
        </div>
      </div>
    </AdminLayout>
  );
}
