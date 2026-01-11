"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight, Bell, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const allActivities = [
  {
    id: 1,
    title: "International Symposium on Sustainable Waste Management",
    date: "2024-05-15",
    description: "The Singh Lab hosted a global symposium featuring experts from 12 countries to discuss microplastic mitigation strategies. The event focused on lifecycle analysis and policy frameworks.",
    image: "/attached_assets/stock_images/professional_researc_2d676eab.jpg",
    category: "NEWS",
    content: "Detailed content about the symposium..."
  },
  {
    id: 2,
    title: "New Research Grant: Coastal Ecosystem Restoration",
    date: "2024-04-10",
    description: "We are thrilled to announce a new major grant focusing on restoring mangrove forests in Southeast Asia. This three-year project will study carbon sequestration.",
    image: "/attached_assets/stock_images/professional_researc_b03bfae3.jpg",
    category: "UPDATE",
    content: "Detailed content about the grant..."
  },
  // Adding more mock news items
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: i + 3,
    title: `Lab Announcement ${i + 1}: Strategic Development`,
    date: `2024-0${(i % 5) + 1}-01`,
    description: "Updates on our ongoing research efforts, community outreach programs, and technological innovations in the environmental sector.",
    image: `/attached_assets/stock_images/professional_researc_${["2d676eab", "b03bfae3", "b446b59e", "f172db13"][i % 4]}.jpg`,
    category: i % 2 === 0 ? "UPDATE" : "NEWS",
    content: "Full news content here..."
  }))
];

export default function AllActivitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-600 font-bold mb-12 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-4">
            News & <span className="text-blue-600">Updates</span>
          </h1>
          <p className="text-gray-500 text-lg">Stay updated with the latest happenings at Singh Lab.</p>
        </div>

        <div className="space-y-12">
          {allActivities.map((activity, idx) => (
            <motion.article
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col md:flex-row gap-8 items-start bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="relative w-full md:w-64 aspect-[4/3] overflow-hidden rounded-3xl shrink-0">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Tag size={12} /> {activity.category}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1.5 font-medium">
                    <Calendar size={14} /> {activity.date}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#1e293b] mb-4 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                  {activity.title}
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {activity.description}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                  Read Full Story <ArrowRight size={18} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
