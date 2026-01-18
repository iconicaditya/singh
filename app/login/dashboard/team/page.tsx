"use client";

import { useState, useEffect } from "react";
import { Plus, User, Edit2, Trash2, Linkedin, Twitter, Loader2 } from "lucide-react";
import TeamForm from "@/components/admin/TeamForm";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      await fetch(`/api/team?id=${id}`, { method: "DELETE" });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const FacebookIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  );

  const InstagramIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  );

  return (
    <div className="p-0 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Our Team</h1>
          <p className="text-slate-500 font-medium mt-1">Manage the lab researchers and staff members.</p>
        </div>
        <button
          onClick={() => { setEditingMember(null); setIsFormOpen(true); }}
          className="w-full md:w-auto px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
        >
          <Plus size={20} />
          Add Team Member
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {members.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} className="w-full h-full object-cover" alt={member.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">{member.name}</h3>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-6">
                    {member.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-3">
                      {member.socialLinks?.linkedin && <Linkedin className="text-slate-300" size={16} />}
                      {member.socialLinks?.twitter && <Twitter className="text-slate-300" size={16} />}
                      {member.socialLinks?.facebook && <FacebookIcon className="text-slate-300" />}
                      {member.socialLinks?.instagram && <InstagramIcon className="text-slate-300" />}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingMember(member); setIsFormOpen(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
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

      <TeamForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchTeam}
        initialData={editingMember}
      />
    </div>
  );
}
