"use client";

import { motion } from "framer-motion";
import { Microscope, Globe, Repeat, BarChart3, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResearchFocus() {
  const focuses = [
    {
      title: "Applied Environmental Science",
      icon: <Microscope className="w-6 h-6 text-blue-600" />,
      description: "Utilizing advanced data analysis and field methods to monitor environmental changes and assess ecosystem health."
    },
    {
      title: "Global Sustainability Policy",
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      description: "Analyzing international frameworks and local implementations to bridge the gap between policy goals and community action."
    },
    {
      title: "Circular Economy Models",
      icon: <Repeat className="w-6 h-6 text-blue-600" />,
      description: "Developing practical models for waste reduction and resource efficiency in urban and rural settings."
    },
    {
      title: "Impact Assessment",
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      description: "Measuring the social and environmental outcomes of sustainability interventions to guide future decision-making."
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-black text-[#1e293b] mb-4">Our Research Focus</h2>
              <div className="w-16 h-1 bg-blue-600 mb-8" />
              <p className="text-gray-600 text-lg mb-12 leading-relaxed">
                We go beyond theoretical study to apply rigorous scientific methods to real-world problems. 
                Our work informs policy, empowers communities, and contributes to the global body of sustainability knowledge.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {focuses.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-300 group"
                >
                  <div className="mb-4 p-3 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1e293b] mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all group">
                View Our Research <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group">
              <Image
                src="/researchfocus.png"
                alt="Research Data Visualization"
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full -z-10 blur-2xl opacity-60" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 rounded-full -z-10 blur-2xl opacity-60" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
