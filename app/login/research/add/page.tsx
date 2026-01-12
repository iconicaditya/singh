"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Plus, 
  User, 
  Type, 
  List, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Undo2, 
  Redo2,
  Trash2,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';

interface Section {
  id: string;
  title: string;
  content: string;
  image?: File | null;
  imagePreview?: string;
}

export default function AddResearchForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('RESEARCH');
  const [newCategory, setNewCategory] = useState('');
  const [year, setYear] = useState('2026');
  const [tags, setTags] = useState('');
  const [titleImage, setTitleImage] = useState<File | null>(null);
  const [titleImagePreview, setTitleImagePreview] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>(['']);
  
  const [sections, setSections] = useState<Section[]>([
    { id: '1', title: '', content: '' }
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'title' | string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'title') {
          setTitleImage(file);
          setTitleImagePreview(reader.result as string);
        } else {
          setSections(prev => prev.map(s => 
            s.id === type ? { ...s, image: file, imagePreview: reader.result as string } : s
          ));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addAuthor = () => setAuthors([...authors, '']);
  const removeAuthor = (index: number) => setAuthors(authors.filter((_, i) => i !== index));
  const updateAuthor = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const addSection = () => {
    setSections([...sections, { id: Math.random().toString(36).substr(2, 9), title: '', content: '' }]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, field: keyof Section, value: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-start">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-50">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Add New Research</h1>
            <p className="text-sm text-slate-500">Manage details for the research card and viewer.</p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-12">
          {/* Section 1: Basic Information */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                  placeholder="Research paper title..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm pr-10"
                    >
                      <option>RESEARCH</option>
                      <option>CASE STUDY</option>
                      <option>WHITEPAPER</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <input 
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow px-4 py-3 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none"
                  />
                  <button className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors uppercase tracking-wider">
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Year</label>
                <input 
                  type="text" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. LCA, Sustainability"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Title Image</label>
              <div className="flex gap-4 items-start">
                <div className="w-40 h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 transition-colors relative overflow-hidden group">
                  {titleImagePreview ? (
                    <Image src={titleImagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="text-slate-400" />
                      <span className="text-xs text-slate-400 font-medium text-center px-4">Click or drag to upload</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    onChange={(e) => handleImageUpload(e, 'title')}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors relative overflow-hidden">
                      <Upload size={14} />
                      Choose Image
                      <input 
                        type="file" 
                        onChange={(e) => handleImageUpload(e, 'title')}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*"
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">No file chosen</p>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-100" />

          {/* Paper Details: Authors */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Paper Details</h3>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Authors</label>
              <div className="space-y-3">
                {authors.map((author, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-grow">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={author}
                        onChange={(e) => updateAuthor(index, e.target.value)}
                        placeholder="Author Name"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                    {authors.length > 1 && (
                      <button 
                        onClick={() => removeAuthor(index)}
                        className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                onClick={addAuthor}
                className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:text-blue-700"
              >
                <Plus size={14} /> Add Author
              </button>
            </div>
          </section>

          <div className="h-px bg-slate-100" />

          {/* Section 2: Research Contents */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-lg font-bold text-slate-900">Research Contents</h2>
            </div>

            <AnimatePresence>
              {sections.map((section, index) => (
                <motion.div 
                  key={section.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 p-6 border border-slate-100 rounded-2xl bg-slate-50/50 relative group"
                >
                  <button 
                    onClick={() => removeSection(section.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="space-y-4">
                    <input 
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      placeholder="Title eg:- Introduction"
                      className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                    />

                    {/* Rich Text Toolbar Mock */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500"><Undo2 size={16} /></button>
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500"><Redo2 size={16} /></button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 cursor-pointer">
                          Font <ChevronDown size={14} />
                        </div>
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 cursor-pointer">
                          Size <ChevronDown size={14} />
                        </div>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-700 font-bold"><Bold size={16} /></button>
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-700"><Italic size={16} /></button>
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-700 underline"><Underline size={16} /></button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500"><AlignLeft size={16} /></button>
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500"><AlignCenter size={16} /></button>
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500"><AlignRight size={16} /></button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-500"><LinkIcon size={16} /></button>
                      </div>
                      <textarea 
                        value={section.content}
                        onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                        placeholder="write paragraph here........"
                        className="w-full h-40 p-6 outline-none text-slate-600 text-sm resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Paragraph Image (Optional)</label>
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors relative overflow-hidden">
                          {section.imagePreview ? (
                            <Image src={section.imagePreview} alt="Preview" fill className="object-cover" />
                          ) : (
                            <Upload size={20} className="text-slate-300" />
                          )}
                          <input 
                            type="file" 
                            onChange={(e) => handleImageUpload(e, section.id)}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept="image/*"
                          />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-700 hover:bg-slate-50 transition-colors relative overflow-hidden">
                          Upload Image
                          <input 
                            type="file" 
                            onChange={(e) => handleImageUpload(e, section.id)}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            accept="image/*"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button 
              onClick={addSection}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all font-bold text-xs"
            >
              <Plus size={16} /> Add Content Section
            </button>
          </section>

          <div className="h-px bg-slate-100" />

          {/* Related Publications Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Related Publications</h3>
              <span className="text-[10px] text-slate-400 font-medium italic">(Optional)</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Plus size={14} /> Add Publication
            </button>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50">
          <button className="px-6 py-2.5 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 hover:bg-white transition-colors">
            Cancel
          </button>
          <button className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            Save Research
          </button>
        </div>
      </motion.div>
    </div>
  );
}
