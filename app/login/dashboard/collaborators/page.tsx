"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, Edit2, Trash2, Loader2, Globe } from "lucide-react";
import CollaboratorForm from "@/components/admin/CollaboratorForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<any>(null);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/collaborators");
      const data = await res.json();
      setCollaborators(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this collaborator?")) return;
    try {
      await fetch(`/api/collaborators?id=${id}`, { method: "DELETE" });
      fetchCollaborators();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-0 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Collaborators</h1>
          <p className="text-slate-500 font-medium mt-1">Manage partner companies and collaborators.</p>
        </div>
        <button
          onClick={() => { setEditingCollaborator(null); setIsFormOpen(true); }}
          className="w-full md:w-auto px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          <Plus size={20} />
          Add Collaborator
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : collaborators.length === 0 ? (
        <div className="text-center py-24">
          <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-400 font-semibold">No collaborators added yet</p>
          <p className="text-slate-300 text-sm mt-1">Click "Add Collaborator" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {collaborators.map((collaborator) => (
              <motion.div
                key={collaborator.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-full h-32 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
                      {collaborator.logoUrl ? (
                        <img src={collaborator.logoUrl} className="max-w-full max-h-full object-contain p-4" alt={collaborator.companyName || "Collaborator logo"} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Building2 size={32} />
                        </div>
                      )}
                    </div>
                    <div className="text-center w-full">
                      {collaborator.companyName && (
                        <h3 className="font-black text-slate-900 text-lg">{collaborator.companyName}</h3>
                      )}
                      {collaborator.website && (
                        <a 
                          href={collaborator.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2"
                        >
                          <Globe size={12} />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>

                  {collaborator.imageUrl && (
                    <div className="mb-6">
                      <img src={collaborator.imageUrl} className="w-full h-32 object-cover rounded-xl" alt={collaborator.companyName || "Collaborator image"} />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="text-xs text-slate-400 font-medium">
                      Added {new Date(collaborator.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingCollaborator(collaborator); setIsFormOpen(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(collaborator.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <CollaboratorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCollaborators}
        initialData={editingCollaborator}
      />
    </div>
  );
}
