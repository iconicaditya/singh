"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Header() {
  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "#" },
    { name: "OUR TEAM", href: "#" },
    { name: "PROJECTS", href: "#" },
    { name: "PUBLICATIONS", href: "#" },
    { name: "RESEARCH", href: "#" },
    { name: "RESOURCES", href: "#" },
    { name: "ACTIVITIES", href: "#" },
    { name: "GALLERY", href: "#" },
    { name: "CONTACT", href: "#" },
  ];

  const texts = [
    "Research, education, and community action for a sustainable future.",
    "Empowering communities through innovative environmental research.",
    "Working together for a greener and cleaner planet."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full">
      {/* Top Part: Black Background */}
      <div className="bg-black text-white py-4 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Logo and Name */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
          <div className="bg-white p-2 rounded shrink-0">
            <Image
              src="/vercel.svg"
              alt="Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-[#3b82f6] leading-none text-center md:text-left">SINGHLAB</h1>
            <p className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-[#ef4444] uppercase mt-1 text-center md:text-left">Environment</p>
          </div>
        </div>

        {/* Center: Typing Animation */}
        <div className="max-w-md text-center h-12 md:h-10 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-gray-400 text-xs md:text-sm leading-tight italic"
            >
              {texts[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4 md:gap-5 text-gray-400 w-full md:w-auto justify-center md:justify-end">
          <Link href="#" className="hover:text-white transition-colors">
            <Globe size={20} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Facebook size={20} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Twitter size={20} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Linkedin size={20} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Youtube size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Bottom Part: Blue Navigation */}
      <nav className="bg-[#2563eb] text-white shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <ul className="flex items-center justify-center md:justify-end gap-1 py-0 whitespace-nowrap text-[12px] font-bold">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`inline-block px-4 py-4 transition-all duration-200 hover:bg-[#1d4ed8] ${
                    link.name === "HOME" ? "text-[#f87171]" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
