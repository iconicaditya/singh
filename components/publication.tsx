"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

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

export default function Publication() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold mb-6"
          >
            <BookOpen size={14} /> SCHOLARLY WORKS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4"
          >
            Recent <span className="text-blue-600">Publications</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full group"
            >
              <div className="mb-6">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {pub.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                {pub.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4 font-medium italic">
                {pub.authors}
              </p>
              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
                <span>{pub.journal} ({pub.year})</span>
                <Link href={`https://doi.org/${pub.doi}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                  DOI <ExternalLink size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/all-publications"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-10 py-4 rounded-full font-black hover:bg-[#1d4ed8] transition-all shadow-xl shadow-blue-500/25 group"
          >
            VIEW ALL PUBLICATIONS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
