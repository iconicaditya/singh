"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const team = [
  {
    name: "Dr. R.P. Singh",
    role: "Director / Principal Investigator",
    image: "/ourteamimages/director.jpg",
    bio: "Leading research initiatives in environmental sustainability and policy. Expert in applied environmental science with over 20 years of experience.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Dr. Sarah Miller",
    role: "Senior Researcher",
    image: "/ourteamimages/member1.jpg",
    bio: "Specializing in climate change adaptation and community resilience. Focuses on bridging scientific data with local action.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Kenji Tanaka",
    role: "Sustainability Analyst",
    image: "/ourteamimages/member2.jpg",
    bio: "Expert in circular economy models and waste management systems. Developing practical solutions for urban sustainability.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Dr. Elena Rossi",
    role: "Policy Specialist",
    image: "/ourteamimages/member3.jpg",
    bio: "Analyzing global environmental frameworks and their local implementation across diverse geographical contexts.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  }
];

export default function OurTeam() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#1e293b] mb-4"
          >
            Meet Our <span className="text-blue-600">Team</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            A dedicated group of researchers and professionals working towards a sustainable future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                  <div className="flex gap-4">
                    <Link href={member.social.facebook} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-600 transition-all">
                      <Facebook size={20} />
                    </Link>
                    <Link href={member.social.twitter} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-400 transition-all">
                      <Twitter size={20} />
                    </Link>
                    <Link href={member.social.linkedin} className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white hover:text-blue-700 transition-all">
                      <Linkedin size={20} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-[#1e293b] mb-1 group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold text-sm mb-4 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="#" className="inline-flex items-center gap-2 px-8 py-3 bg-[#1e293b] text-white rounded-full font-bold hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg">
            Join Our Team <ExternalLink size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
