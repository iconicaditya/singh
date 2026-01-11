"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Bell, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const activities = [
  {
    id: 1,
    title: "International Symposium on Sustainable Waste Management",
    date: "2024-05-15",
    description: "The Singh Lab hosted a global symposium featuring experts from 12 countries to discuss microplastic mitigation strategies.",
    image: "/attached_assets/stock_images/professional_researc_2d676eab.jpg",
    category: "NEWS"
  },
  {
    id: 2,
    title: "New Research Grant: Coastal Ecosystem Restoration",
    date: "2024-04-10",
    description: "We are thrilled to announce a new major grant focusing on restoring mangrove forests in Southeast Asia.",
    image: "/attached_assets/stock_images/professional_researc_b03bfae3.jpg",
    category: "UPDATE"
  },
  {
    id: 3,
    title: "Community Workshop: Urban Composting",
    date: "2024-03-22",
    description: "Over 50 local residents joined us for a hands-on workshop on converting household waste into nutrient-rich soil.",
    image: "/attached_assets/stock_images/professional_researc_b446b59e.jpg",
    category: "COMMUNITY"
  },
  {
    id: 4,
    title: "Singh Lab Publication in Nature Sustainability",
    date: "2024-02-14",
    description: "Our latest findings on plastic lifecycle impacts have been published in a leading scientific journal.",
    image: "/attached_assets/stock_images/professional_researc_f172db13.jpg",
    category: "NEWS"
  },
  {
    id: 5,
    title: "Annual Lab Retreat and Strategic Planning",
    date: "2024-01-05",
    description: "Our team gathered for a week of reflection and planning for the year ahead at the Kobe innovation center.",
    image: "/attached_assets/stock_images/professional_researc_2d676eab.jpg",
    category: "LAB UPDATE"
  }
];

export default function Activities() {
  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-xs font-bold mb-6"
          >
            <Bell size={14} /> NEWS & UPDATES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4"
          >
            Latest <span className="text-blue-600">Activities</span>
          </motion.h2>
        </div>

        <div className="space-y-8 mb-16">
          {activities.map((activity, index) => (
            <motion.article
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="relative w-full md:w-64 aspect-[4/3] overflow-hidden rounded-3xl shrink-0">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
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
                <h3 className="text-2xl font-black text-[#1e293b] mb-4 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                  {activity.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">
                  {activity.description}
                </p>
                <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
                  Read More <ArrowRight size={18} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            href="/all-activities"
            className="inline-flex items-center gap-2 bg-[#1e293b] text-white px-10 py-4 rounded-full font-bold hover:bg-blue-600 transition-all shadow-xl group"
          >
            VIEW ALL ACTIVITIES <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
