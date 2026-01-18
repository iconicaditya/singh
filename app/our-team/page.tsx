import Header from "@/components/header";
import { db } from "@/lib/db";
import { team } from "@/lib/db/schema";
import { Linkedin, Twitter, Globe, User } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export default async function TeamPage() {
  const teamMembers = await db.select().from(team).orderBy(team.createdAt) as TeamMember[];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Our <span className="text-blue-600">Expert Team</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Meet the dedicated researchers and professionals driving innovation in environmental science and sustainability at our lab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div 
                key={member.id}
                className="group bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50 relative mb-6">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <User size={64} />
                    </div>
                  )}
                  
                  {/* Social Overlay */}
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <div className="flex gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl w-full justify-center translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      {member.socialLinks?.linkedin && (
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                          <Linkedin size={20} strokeWidth={2.5} />
                        </a>
                      )}
                      {member.socialLinks?.twitter && (
                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                          <Twitter size={20} strokeWidth={2.5} />
                        </a>
                      )}
                      {member.socialLinks?.website && (
                        <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-500 transition-colors">
                          <Globe size={20} strokeWidth={2.5} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 text-center">
                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
              <User size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold tracking-tight">Our team members will be listed here soon.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}