"use client";

import { motion } from "framer-motion";
import { Microscope, Globe, Leaf, BarChart3 } from "lucide-react";
import Image from "next/image";

const researchFocusData = [
  {
    icon: <Microscope className="w-6 h-6 text-blue-600" />,
    title: "Applied Environmental Science",
    description: "Utilizing advanced data analysis and field methods to monitor environmental changes and assess ecosystem health.",
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-600" />,
    title: "Global Sustainability Policy",
    description: "Analyzing international frameworks and local implementations to bridge the gap between policy goals and community action.",
  },
  {
    icon: <Leaf className="w-6 h-6 text-blue-600" />,
    title: "Circular Economy Models",
    description: "Developing practical models for waste reduction and resource efficiency in urban and rural settings.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    title: "Impact Assessment",
    description: "Measuring the social and environmental outcomes of sustainability interventions to guide future decision-making.",
  },
];

export default function ResearchFocus() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Content - Now physically first in the DOM for mobile top appearance */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="w-full lg:w-1/2 lg:order-last relative group"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl h-[400px] md:h-[600px] lg:h-[700px] w-full">
              <Image 
                src="/researchfocus.png" 
                alt="Research Focus Visualization" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Animated background element */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute -top-10 -right-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute -bottom-10 -left-10 w-80 h-80 bg-slate-100 rounded-full blur-3xl -z-0"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Research Focus</h2>
            <div className="w-16 h-1 bg-blue-600 mb-8" />
            
            <p className="text-lg text-slate-600 mb-12 leading-relaxed">
              We go beyond theoretical study to apply rigorous scientific methods to real-world problems. 
              Our work informs policy, empowers communities, and contributes to the global body 
              of sustainability knowledge.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {researchFocusData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-lg"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
