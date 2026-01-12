"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  List,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

// Full dataset for research papers
const researchPapers = [
  {
    id: 1,
    title: "Plastic lifecycle impacts",
    category: "WASTE MANAGEMENT",
    description: "Evaluating the environmental footprint of plastic products from production to disposal.",
    paragraphs: [
      "This comprehensive study examines the entire lifecycle of plastic products, from raw material extraction and manufacturing to consumption and end-of-life management. We utilize Life Cycle Assessment (LCA) methodologies to quantify greenhouse gas emissions, energy consumption, and environmental toxicity at each stage. Our analysis reveals critical intervention points in the supply chain where sustainable practices can yield the highest environmental dividends.",
      "The study identifies that the polymer production phase is responsible for over 60% of the total greenhouse gas emissions across the lifecycle. By transitioning to renewable energy sources for manufacturing and increasing the secondary material content, the carbon footprint can be reduced significantly. Furthermore, we explore the impact of additive chemicals on recyclability, noting that certain flame retardants and plasticizers create substantial barriers to high-quality mechanical recycling."
    ],
    image: "/researchimages/research_1.jpg",
    tags: ["LCA", "Sustainability", "Environment"],
    date: "2024-03-15",
    author: "Dr. Sarah Chen",
    authorImage: "/ourteamimages/aaditya.png",
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
    paragraphs: [
      "The nexus between plastic pollution and climate change is often overlooked. Our research highlights how plastic production contributes significantly to global carbon budgets and how environmental degradation from plastic waste impairs the ocean's ability to sequester carbon. This study provides a quantitative framework for understanding these dual threats as an integrated global challenge.",
      "Our findings indicate that if current trends continue, emissions from the plastic lifecycle could account for 15% of the global carbon budget by 2050. The research also investigates the 'albedo effect' of plastic debris in polar regions, suggesting that microplastics on ice surfaces may accelerate melting rates. Additionally, the disruption of biological carbon pumps by microplastic ingestion in marine organisms is quantified for the first time in this report."
    ],
    image: "/researchimages/research_2.jpg",
    tags: ["Carbon", "Policy", "Climate"],
    date: "2024-01-20",
    author: "Prof. Michael Roberts",
    authorImage: "/ourteamimages/nabin.png",
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
    paragraphs: [
      "Microplastic contamination in urban water cycles poses significant challenges for water treatment and public health. This study presents a novel sensor-based monitoring framework that allows for real-time detection and characterization of microplastic particles in complex wastewater matrices. We demonstrate how automated systems can drastically reduce the cost and time required for standard laboratory analysis.",
      "The implementation of Raman spectroscopy combined with deep learning algorithms has allowed for the identification of polymer types with 98% accuracy. Our monitoring at three major metropolitan wastewater treatment plants showed that while 95% of particles are captured by tertiary treatment, the remaining 5% represents billions of particles released daily into aquatic environments. We also characterize the 'plastisphere'—the microbial communities that colonize these particles."
    ],
    image: "/researchimages/research_3.jpg",
    tags: ["Technology", "Monitoring", "Water"],
    date: "2023-11-05",
    author: "Dr. Elena Rodriguez",
    authorImage: "/ourteamimages/bibas.png",
    methodology: "Development of spectroscopic sensors and machine learning algorithms for particle identification.",
    keyFindings: [
      "Standard filtration methods miss up to 30% of smaller microplastic particles.",
      "Real-time monitoring can identify pollution hotspots in municipal systems within hours.",
      "Seasonal variations significantly impact microplastic concentrations in storm runoff."
    ]
  },
  {
    id: 4,
    title: "Composting & Biowaste processing",
    category: "WASTE MANAGEMENT",
    description: "Optimizing organic waste conversion for sustainable agricultural applications.",
    paragraphs: [
      "Investigating advanced composting technologies to maximize nutrient recovery from organic waste streams. This research focuses on industrial-scale biowaste processing and its integration into circular agricultural systems.",
      "The comparative study of thermophilic vs. mesophilic composting processes in urban environments reveals that optimized composting reduces methane emissions by 80% compared to landfilling. High-quality compost significantly improves soil carbon sequestration, making decentralized urban composting hubs viable at city-scale."
    ],
    image: "/researchimages/research_4.jpg",
    tags: ["Circular Economy", "Agriculture"],
    date: "2023-09-12",
    author: "Prof. Alan Smith",
    authorImage: "/ourteamimages/aaditya.png",
    methodology: "Comparative study of thermophilic vs. mesophilic composting processes in urban environments.",
    keyFindings: [
      "Optimized composting reduces methane emissions by 80% compared to landfilling.",
      "High-quality compost significantly improves soil carbon sequestration.",
      "Decentralized urban composting hubs are viable at city-scale."
    ]
  },
  {
    id: 5,
    title: "Municipal solid waste planning",
    category: "URBAN SYSTEMS",
    description: "Strategic frameworks for integrated waste management in rapidly growing cities.",
    paragraphs: [
      "Addressing the logistical and policy challenges of waste management in high-density urban areas. This paper proposes an integrated framework that combines technological infrastructure with social behavioral programs.",
      "Systems dynamics modeling applied to five case study cities with diverse socioeconomic backgrounds shows that integrated planning can reduce operational costs by up to 25%. Public participation is the single biggest predictor of recycling success, and smart-bin technology improves collection efficiency by 30%."
    ],
    image: "/researchimages/research_1.jpg",
    tags: ["Urban Planning", "Public Health"],
    date: "2023-07-28",
    author: "Dr. James Wilson",
    authorImage: "/ourteamimages/nabin.png",
    methodology: "Systems dynamics modeling applied to five case study cities with diverse socioeconomic backgrounds.",
    keyFindings: [
      "Integrated planning can reduce operational costs by up to 25%.",
      "Public participation is the single biggest predictor of recycling success.",
      "Smart-bin technology improves collection efficiency by 30%."
    ]
  },
  {
    id: 6,
    title: "Waste-to-energy innovations",
    category: "RENEWABLE ENERGY",
    description: "Exploring next-generation technologies for energy recovery from non-recyclable waste.",
    paragraphs: [
      "A deep dive into advanced thermal and biochemical conversion technologies. We evaluate the efficiency and environmental safety of modern waste-to-energy plants compared to traditional fossil fuel power generation.",
      "Techno-economic assessment and emission profiling of plasma gasification systems show that modern gasification has 50% lower air pollutants than standard incineration. Waste-to-energy can provide up to 10% of a city's base-load power, and carbon capture integration makes waste-to-energy carbon-negative."
    ],
    image: "/researchimages/research_2.jpg",
    tags: ["Energy", "Innovation", "Tech"],
    date: "2023-05-15",
    author: "Dr. Emily Brown",
    authorImage: "/ourteamimages/bibas.png",
    methodology: "Techno-economic assessment and emission profiling of plasma gasification systems.",
    keyFindings: [
      "Modern gasification has 50% lower air pollutants than standard incineration.",
      "Waste-to-energy can provide up to 10% of a city's base-load power.",
      "Carbon capture integration makes waste-to-energy carbon-negative."
    ]
  }
];

const publications = [
  {
    id: 1,
    title: "Socio-economic impacts of plastic pollution in coastal communities",
    authors: "Singh, A., Rokaya, N., & Chaudhary, A.",
    journal: "Journal of Environmental Management",
    year: "2024",
    doi: "10.1016/j.jenvman.2024.120000",
    category: "RESEARCH PAPER"
  },
  {
    id: 2,
    title: "Microplastic distribution patterns in urban river systems",
    authors: "Ghatani, B., & Singh, A.",
    journal: "Water Research",
    year: "2023",
    doi: "10.1016/j.watres.2023.110000",
    category: "RESEARCH PAPER"
  },
  {
    id: 3,
    title: "Community-led waste management: A case study from Nepal",
    authors: "Rokaya, N., & Singh, A.",
    journal: "Sustainability Science",
    year: "2024",
    doi: "10.1007/s11625-024-01500-w",
    category: "CASE STUDY"
  }
];

// Fallback for generated items (IDs 7+)
const getGeneratedPaper = (id: number) => ({
  id,
  title: `Research Initiative ${id}: Environmental Analysis`,
  category: ["PLASTICS", "CLIMATE", "ENERGY", "URBAN"][id % 4],
  description: "Comprehensive scientific study focusing on long-term sustainability and environmental preservation strategies.",
  paragraphs: [
    "This research explores the complex interactions between industrial processes and environmental health. Through multi-year monitoring and advanced statistical analysis, we aim to provide actionable data for policy makers and industry leaders to implement more sustainable practices.",
    "Our multivariate regression analysis combined with longitudinal field observations has identified a key correlation between process efficiency and waste reduction. We proposed a new framework for cross-industry sustainability benchmarking and validated several low-cost mitigation strategies for emerging markets."
  ],
  image: `/researchimages/research_${(id % 4) + 1}.jpg`,
  tags: ["Science", "Research", "Analysis"],
  date: `2023-0${(id % 9) + 1}-10`,
  author: "Lead Researcher",
  authorImage: "/ourteamimages/aaditya.png",
  methodology: "Multivariate regression analysis combined with longitudinal field observations.",
  keyFindings: [
    "Identified key correlation between process efficiency and waste reduction.",
    "Proposed a new framework for cross-industry sustainability benchmarking.",
    "Validated several low-cost mitigation strategies for emerging markets."
  ]
});

export default function ResearchDetail() {
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const paper = researchPapers.find(p => p.id === id) || getGeneratedPaper(id);

  const sections = [
    { id: "abstract", label: "Abstract & Overview", icon: BookOpen },
    { id: "content", label: "Research Content", icon: List },
    { id: "methodology", label: "Methodology", icon: ExternalLink },
    { id: "findings", label: "Key Findings", icon: CheckCircle2 },
  ];

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
              <span className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white">
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
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg shadow-blue-500/20">
                  <Image
                    src={(paper as any).authorImage}
                    alt={paper.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-gray-200 font-bold tracking-tight">{paper.author}</span>
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
                <div id="abstract" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <BookOpen className="text-blue-500" />
                    Abstract & Overview
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed mb-10 border-l-4 border-blue-600 pl-8 py-2">
                    {paper.description}
                  </p>
                </div>

                <div id="content" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <List className="text-blue-500" />
                    Research Content
                  </h2>
                  <div className="text-gray-400 text-lg leading-relaxed space-y-8 mb-16">
                    {(paper as any).paragraphs?.map((para: string, idx: number) => (
                      <p key={idx}>{para}</p>
                    )) || <p>{(paper as any).fullContent}</p>}
                  </div>
                </div>

                <div id="methodology" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <ExternalLink className="text-blue-500" />
                    Methodology
                  </h2>
                  <div className="bg-slate-900/50 rounded-3xl p-8 border border-white/5 mb-16">
                    <p className="text-gray-300 text-lg italic leading-relaxed">
                      &quot;{paper.methodology}&quot;
                    </p>
                  </div>
                </div>

                <div id="findings" className="scroll-mt-32">
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
              </div>
            </motion.div>

                <div id="findings" className="scroll-mt-32">
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
              </div>
            </motion.div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Table of Contents */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <List size={20} className="text-blue-500" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-4">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors group text-sm font-medium"
                      >
                        <section.icon size={16} className="group-hover:scale-110 transition-transform" />
                        {section.label}
                      </a>
                    ))}
                  </nav>
                </motion.div>

                {/* Resources Card - Enhanced based on image */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#2563eb] rounded-[2.5rem] p-8 shadow-2xl shadow-blue-600/30 relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-8 text-white tracking-tight">Resources</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-white text-[#2563eb] font-black py-5 rounded-[1.25rem] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-lg shadow-black/10">
                        <Download size={24} strokeWidth={2.5} />
                        DOWNLOAD PDF
                      </button>
                      <button className="w-full bg-[#3b82f6]/40 backdrop-blur-md text-white border border-white/30 font-black py-5 rounded-[1.25rem] flex items-center justify-center gap-3 hover:bg-[#3b82f6]/50 transition-all active:scale-[0.98]">
                        <Share2 size={24} strokeWidth={2.5} />
                        SHARE RESEARCH
                      </button>
                    </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                </motion.div>

                {/* Newsletter Card - Enhanced based on image */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#0f172a]/95 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-4 text-white">Stay Informed</h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-8">
                    Get the latest research findings and sustainability insights delivered to your inbox.
                  </p>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-500 font-medium"
                    />
                    <button className="w-full bg-[#2563eb] text-white font-black py-5 rounded-2xl hover:bg-[#1d4ed8] transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm">
                      SUBSCRIBE
                    </button>
                  </div>
                </motion.div>
              </div>
            </aside>
          </div>

          {/* Related Publications Section */}
          <div className="mt-32 pt-20 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-xs font-bold mb-6"
                >
                  <BookOpen size={14} /> RECOMMENDED READING
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-white">
                  Related <span className="text-blue-500">Publications</span>
                </h2>
              </div>
              <Link 
                href="/all-publications" 
                className="text-blue-500 font-black flex items-center gap-2 hover:text-white transition-colors group"
              >
                VIEW ALL <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {publications.map((pub, index) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all flex flex-col h-full group"
                >
                  <div className="mb-6">
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {pub.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 font-medium italic">
                    {pub.authors}
                  </p>
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>{pub.journal} ({pub.year})</span>
                    <Link 
                      href={`https://doi.org/${pub.doi}`} 
                      target="_blank" 
                      className="text-blue-500 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      DOI <ExternalLink size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
