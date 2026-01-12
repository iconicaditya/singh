"use client";

import { motion } from "framer-motion";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "MARINE PLASTIC POLLUTION ANALYSIS",
    category: "RESEARCH",
    description: "Comprehensive study on the distribution and impact of microplastics in coastal waters, focusing on marine ecosystem health.",
    status: "Ongoing...",
    image: "/projectimages/project_1.jpg",
    year: "2024"
  },
  {
    id: 2,
    title: "COMMUNITY RECYCLING WORKSHOP",
    category: "COMMUNITY",
    description: "Empowering local communities with sustainable waste management practices through interactive workshops and resource sharing.",
    status: "Completed",
    image: "/projectimages/project_2.jpg",
    year: "2023"
  },
  {
    id: 3,
    title: "CLIMATE DATA VISUALIZATION AI",
    category: "TECHNOLOGY",
    description: "Developing advanced AI models to visualize complex climate data patterns, helping policymakers make informed decisions.",
    status: "Ongoing...",
    image: "/projectimages/project_3.jpg",
    year: "2024"
  },
  {
    id: 4,
    title: "RENEWABLE ENERGY TRANSITION",
    category: "TECHNOLOGY",
    description: "Strategic plan for transitioning urban centers to 100% renewable energy sources within the next decade.",
    status: "Ongoing...",
    image: "/projectimages/project_4.jpg",
    year: "2024"
  },
  {
    id: 5,
    title: "URBAN GARDENING INITIATIVE",
    category: "COMMUNITY",
    description: "Establishing vertical gardens in high-density urban areas to improve air quality and provide local produce.",
    status: "Completed",
    image: "/projectimages/project_5.jpg",
    year: "2023"
  },
  {
    id: 6,
    title: "WATER PURIFICATION SYSTEMS",
    category: "RESEARCH",
    description: "Developing low-cost, high-efficiency water filtration systems for rural communities using local materials.",
    status: "Ongoing...",
    image: "/projectimages/project_1.jpg",
    year: "2024"
  },
  {
    id: 7,
    title: "WILDLIFE HABITAT RESTORATION",
    category: "RESEARCH",
    description: "Restoring critical wildlife corridors through reforestation and community-led conservation efforts.",
    status: "Completed",
    image: "/projectimages/project_2.jpg",
    year: "2023"
  },
  {
    id: 8,
    title: "SUSTAINABLE PACKAGING SOLUTIONS",
    category: "TECHNOLOGY",
    description: "Researching and developing biodegradable alternatives to single-use plastics in the manufacturing sector.",
    status: "Ongoing...",
    image: "/projectimages/project_3.jpg",
    year: "2024"
  },
  {
    id: 9,
    title: "ECO-FRIENDLY TRANSPORTATION",
    category: "COMMUNITY",
    description: "Promoting carbon-neutral transit options through infrastructure development and public awareness campaigns.",
    status: "Completed",
    image: "/projectimages/project_4.jpg",
    year: "2023"
  }
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-24 bg-gray-50/50" id="projects">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#1e293b] mb-6"
          >
            Our <span className="text-blue-600">Projects</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Explore our ongoing and past initiatives dedicated to environmental sustainability and community engagement.
          </motion.p>
        </div>

        {/* Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-40">
              <select 
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full appearance-none bg-gray-50 px-4 py-3 rounded-xl border-none text-sm font-bold text-gray-600 pr-10 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">CATEGORY: All</option>
                <option value="RESEARCH">RESEARCH</option>
                <option value="COMMUNITY">COMMUNITY</option>
                <option value="TECHNOLOGY">TECHNOLOGY</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            
            <div className="relative flex-1 md:w-32">
              <select className="w-full appearance-none bg-gray-50 px-4 py-3 rounded-xl border-none text-sm font-bold text-gray-600 pr-10 focus:ring-2 focus:ring-blue-500/20">
                <option>YEAR: All</option>
                <option>2024</option>
                <option>2023</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={project.image} 
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-blue-600 shadow-sm uppercase">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className={`text-xs font-bold ${project.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
                    {project.status}
                  </span>
                  <Link 
                    href={`/all-projects/${project.id}`} 
                    className="flex items-center gap-2 text-xs font-black text-gray-400 group-hover:text-blue-600 transition-colors"
                  >
                    VIEW PROJECT <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/all-projects"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-10 py-4 rounded-full font-black hover:bg-[#1d4ed8] transition-all shadow-xl shadow-blue-500/25 group"
          >
            VIEW ALL PROJECTS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
