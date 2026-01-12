"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  User, 
  Share2, 
  Download, 
  ExternalLink,
  CheckCircle2,
  Clock,
  BookOpen
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// This would ideally come from a central data file
const researchPapers = [
  {
    id: 1,
    title: "Plastic lifecycle impacts",
    category: "WASTE MANAGEMENT",
    description: "Evaluating the environmental footprint of plastic products from production to disposal.",
    fullContent: "This comprehensive study examines the entire lifecycle of plastic products, from raw material extraction and manufacturing to consumption and end-of-life management. We utilize Life Cycle Assessment (LCA) methodologies to quantify greenhouse gas emissions, energy consumption, and environmental toxicity at each stage.",
    image: "/researchimages/research_1.jpg",
    tags: ["LCA", "Sustainability", "Environment"],
    date: "2024-03-15",
    author: "Dr. Sarah Chen",
    readTime: "12 min read",
    methodology: "Quantitative LCA analysis using Ecoinvent databases and field data from 50+ manufacturing facilities.",
    keyFindings: [
      "Production stage accounts for 60% of total carbon footprint.",
      "Recycling can reduce environmental impact by up to 45% compared to landfilling.",
      "Bio-based plastics show promise but have higher land-use impacts."
    ]
  },
  {
    id: 2,
    title: "Plastic-climate connections",
    category: "CLIMATE CHANGE",
    description: "Studying the intersection of plastic pollution and greenhouse gas emissions.",
    fullContent: "The nexus between plastic pollution and climate change is often overlooked. Our research highlights how plastic production contributes significantly to global carbon budgets and how environmental degradation from plastic waste impairs the ocean's ability to sequester carbon.",
    image: "/researchimages/research_2.jpg",
    tags: ["Carbon", "Policy", "Climate"],
    date: "2024-01-20",
    author: "Prof. Michael Roberts",
    readTime: "15 min read",
    methodology: "Integrated climate modelling combined with global plastic trade flow analysis.",
    keyFindings: [
      "Current plastic production trends could consume 15% of the remaining carbon budget for 1.5°C.",
      "Ocean plastic impairs phytoplankton growth, reducing carbon sequestration efficiency.",
      "Policy interventions targeting production are more effective than end-of-pipe solutions."
    ]
  },
  {
    id: 3,
    title: "Microplastics monitoring",
    category: "PLASTICS",
    description: "Advanced techniques for detecting and tracking microplastics in urban water systems.",
    fullContent: "Microplastic contamination in urban water cycles poses significant challenges for water treatment and public health. This study presents a novel sensor-based monitoring framework that allows for real-time detection and characterization of microplastic particles in complex wastewater matrices.",
    image: "/researchimages/research_3.jpg",
    tags: ["Technology", "Monitoring", "Water"],
    date: "2023-11-05",
    author: "Dr. Elena Rodriguez",
    readTime: "10 min read",
    methodology: "Development of spectroscopic sensors and machine learning algorithms for particle identification.",
    keyFindings: [
      "Standard filtration methods miss up to 30% of smaller microplastic particles.",
      "Real-time monitoring can identify pollution hotspots in municipal systems within hours.",
      "Seasonal variations significantly impact microplastic concentrations in storm runoff."
    ]
  }
];

export default function ResearchDetail() {
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const paper = researchPapers.find(p => p.id === id) || researchPapers[0];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      {/* Header Image */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={paper.image}
            alt={paper.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-[#020617]/60 to-[#020617]" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link 
              href="/research"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold mb-8 transition-colors group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              BACK TO RESEARCH
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                {paper.category}
              </span>
              <div className="flex gap-2">
                {paper.tags.map(tag => (
                  <span key={tag} className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-gray-300">
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
              {paper.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                {paper.date}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                {paper.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                {paper.readTime}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-[#020617]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="prose prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="text-blue-500" />
                  Abstract & Overview
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-10 border-l-4 border-blue-600 pl-8 py-2">
                  {paper.description}
                </p>
                <div className="text-gray-400 text-lg leading-relaxed space-y-6 mb-16">
                  {paper.fullContent}
                </div>

                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <ExternalLink className="text-blue-500" />
                  Methodology
                </h2>
                <div className="bg-slate-900/50 rounded-3xl p-8 border border-white/5 mb-16">
                  <p className="text-gray-300 text-lg italic leading-relaxed">
                    "{paper.methodology}"
                  </p>
                </div>

                <h2 className="text-3xl font-bold mb-8">Key Findings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  {paper.keyFindings.map((finding, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all flex gap-4"
                    >
                      <CheckCircle2 className="text-blue-500 shrink-0 mt-1" />
                      <p className="text-gray-300 font-medium">{finding}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Actions Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-blue-600 rounded-[2rem] p-8 shadow-2xl shadow-blue-600/20"
                >
                  <h3 className="text-2xl font-black mb-6">Resources</h3>
                  <div className="space-y-4">
                    <button className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
                      <Download size={20} />
                      DOWNLOAD PDF
                    </button>
                    <button className="w-full bg-blue-500/20 backdrop-blur-md text-white border border-white/20 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500/30 transition-colors">
                      <Share2 size={20} />
                      SHARE RESEARCH
                    </button>
                  </div>
                </motion.div>

                {/* Newsletter/CTA */}
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5">
                  <h3 className="text-xl font-bold mb-4">Stay Informed</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Get the latest research findings and sustainability insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button className="w-full bg-blue-600 font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      SUBSCRIBE
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
