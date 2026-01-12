'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Beaker, X } from 'lucide-react';

const mockResearch = [
  {
    id: 1,
    title: "Integrating Environmental, Social, and Economic Dimensions for Sustainable...",
    description: "This research investigates integrated urban sustainability...",
    category: "SUSTAINABLE DEVELOPMENT",
    journal: "Sustainable Cities and Society",
    doi: "10.1000/sustainability.2026.006",
    authors: ["Mr. Nabin Rokaya", "Er. Aaditya Cdy"],
    date: "2026"
  }
];

export default function AdminResearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [researchData, setResearchData] = useState(mockResearch);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this research topic?')) {
      setResearchData(researchData.filter(item => item.id !== id));
    }
  };

  const filteredResearch = researchData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1e293b]">Research</h1>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 font-bold text-lg">
            A
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500 font-medium">Administrator</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-blue-600 bg-blue-50 p-3 rounded-xl">
              <Beaker size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Research Topics</h2>
              <p className="text-slate-500 mt-1">Manage research papers and projects</p>
            </div>
          </div>
          
          <div className="flex flex-1 lg:justify-end items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search research..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Plus size={20} />
              Add Research
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-left border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Title</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Journal & DOI</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Authors</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredResearch.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="max-w-md">
                      <p className="text-[15px] font-bold text-slate-800 leading-snug mb-1.5">{item.title}</p>
                      <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex px-3 py-1.5 rounded-lg bg-blue-50 text-[11px] font-extrabold text-[#2563eb] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm">
                      <p className="text-slate-600 font-medium mb-1">{item.journal}</p>
                      <p className="text-xs text-slate-400 font-mono tracking-tight">{item.doi}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {item.authors.map((author, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200/50">
                          {author}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-semibold text-slate-600">
                    {item.date}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredResearch.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">
                    No research topics found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Add New Research</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <p className="text-slate-500 mb-6">This form would allow adding new research topics to the list.</p>
              <div className="space-y-4">
                <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-3/4" />
                <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-[#2563eb] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  Save Research
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
