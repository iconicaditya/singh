"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Users, 
  Share2, 
  FileText, 
  MapPin,
  CheckCircle2,
  Trophy,
  Target
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const projects = [
  {
    id: 1,
    title: "MARINE PLASTIC POLLUTION ANALYSIS",
    category: "RESEARCH",
    description: "Comprehensive study on the distribution and impact of microplastics in coastal waters, focusing on marine ecosystem health.",
    image: "/projectimages/project_1.jpg",
    status: "Ongoing...",
    year: "2024",
    location: "Pacific Coastal Region",
    team: "12 Research Scientists",
    impact: "Mapped 500+ microplastic accumulation zones",
    fullDescription: "Our team is conducting a multi-year analysis of plastic lifecycle impacts specifically within marine environments. By deploying autonomous sensors and conducting deep-sea sampling, we are building a first-of-its-kind database that correlates plastic density with biodiversity loss in reef ecosystems.",
    objectives: [
      "Identify primary entry points of terrestrial plastic into marine systems",
      "Quantify ingestion rates among keystone marine species",
      "Develop predictive models for plastic migration patterns"
    ]
  },
  {
    id: 2,
    title: "COMMUNITY RECYCLING WORKSHOP",
    category: "COMMUNITY",
    description: "Empowering local communities with sustainable waste management practices through interactive workshops and resource sharing.",
    image: "/projectimages/project_2.jpg",
    status: "Completed",
    year: "2023",
    location: "Global Virtual / Local Hubs",
    team: "50+ Community Leads",
    impact: "Educated over 5,000 community members",
    fullDescription: "This project bridged the gap between academic research and community action. We developed a curriculum that translates complex circular economy principles into actionable steps for households, leading to a measurable reduction in municipal solid waste in participating regions.",
    objectives: [
      "Standardize community-led sorting processes",
      "Create a digital marketplace for recyclable materials",
      "Establish sustainable funding models for local recycling hubs"
    ]
  }
];

export default function ProjectDetail() {
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const project = projects.find(p => p.id === id) || projects[0];

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600/10">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-slate-900">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <Link 
              href="/all-projects"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold mb-8 transition-colors group uppercase tracking-widest text-xs"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              All Projects
            </Link>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="bg-blue-600 px-6 py-2 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-600/30">
                {project.category}
              </span>
              <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black tracking-widest text-white uppercase border border-white/20">
                {project.status}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1] tracking-tighter uppercase">
              {project.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Year</p>
                <p className="text-white font-bold">{project.year}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Location</p>
                <p className="text-white font-bold">{project.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Team</p>
                <p className="text-white font-bold">{project.team}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Client</p>
                <p className="text-white font-bold">Scientific Lab</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                    <Target className="text-blue-600" />
                    PROJECT OVERVIEW
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    {project.fullDescription}
                  </p>
                </div>

                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-slate-900">Key Objectives</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {project.objectives.map((obj, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <CheckCircle2 className="text-blue-600 shrink-0 mt-1" />
                        <p className="text-slate-700 font-bold">{obj}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-blue-600 rounded-[3rem] text-white">
                  <div className="flex items-center gap-6 mb-4">
                    <Trophy className="w-12 h-12" />
                    <h3 className="text-3xl font-black">MAJOR IMPACT</h3>
                  </div>
                  <p className="text-2xl font-bold opacity-90 leading-relaxed italic">
                    "{project.impact}"
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <aside className="sticky top-24 space-y-10">
                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-8 shadow-2xl shadow-slate-900/20">
                  <h4 className="text-xl font-black tracking-widest">DOCUMENTS</h4>
                  <div className="space-y-4">
                    <button className="w-full bg-white text-slate-900 px-6 py-4 rounded-2xl font-black flex items-center justify-between group hover:bg-blue-500 hover:text-white transition-all">
                      Project Brief <FileText size={18} />
                    </button>
                    <button className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black flex items-center justify-between hover:bg-white/10 transition-all">
                      Impact Report <Share2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] space-y-6">
                  <h4 className="text-xl font-black text-slate-900">NEED DETAILS?</h4>
                  <p className="text-slate-500 text-sm font-medium">
                    Our team is available to provide more detailed information about our methodologies and findings.
                  </p>
                  <Link 
                    href="/#contact" 
                    className="block text-center w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
                  >
                    CONTACT TEAM
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
