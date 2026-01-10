"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, Facebook, Twitter, Linkedin, Youtube, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const scrollingText = "Research, education, and community action for a sustainable future. Empowering communities through innovative environmental research. Working together for a greener and cleaner planet.";

  return (
    <header className="w-full sticky top-0 z-50 shadow-md">
      {/* Top Part: Black Background */}
      <div className="bg-black text-white py-3 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Logo and Name */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded shrink-0">
              <Image
                src="/vercel.svg"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 md:w-10 md:h-10"
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-[#3b82f6] leading-none">SINGHLAB</h1>
              <p className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-[#ef4444] uppercase mt-1">Environment</p>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Center: Marquee Animation */}
        <div className="w-full md:max-w-md lg:max-w-xl overflow-hidden bg-white/5 py-1.5 rounded-full border border-white/10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
            className="whitespace-nowrap inline-block"
          >
            <span className="text-gray-300 text-xs md:text-sm font-medium px-4">
              {scrollingText}
            </span>
            <span className="text-gray-300 text-xs md:text-sm font-medium px-4">
              {scrollingText}
            </span>
          </motion.div>
        </div>

        {/* Right: Social Icons (Desktop only or hidden on small mobile) */}
        <div className="hidden md:flex items-center gap-4 text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">
            <Globe size={18} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Facebook size={18} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Twitter size={18} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Linkedin size={18} strokeWidth={1.5} />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Youtube size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Bottom Part: Blue Navigation */}
      <nav className="bg-[#2563eb] text-white overflow-hidden">
        {/* Desktop Nav */}
        <div className="hidden md:block max-w-screen-xl mx-auto px-4">
          <ul className="flex items-center justify-center lg:justify-end gap-1 whitespace-nowrap text-[11px] lg:text-[12px] font-bold">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`inline-block px-3 py-4 transition-all duration-200 hover:bg-[#1d4ed8] ${
                    link.name === "HOME" ? "text-[#f87171]" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#1d4ed8] border-t border-white/10"
            >
              <ul className="flex flex-col py-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-6 py-3 text-sm font-bold border-b border-white/5 last:border-0 ${
                        link.name === "HOME" ? "text-[#f87171]" : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                {/* Mobile Social Icons */}
                <li className="flex justify-center gap-6 py-6 border-t border-white/10 mt-2">
                  <Link href="#" className="text-white/70 hover:text-white"><Globe size={20} /></Link>
                  <Link href="#" className="text-white/70 hover:text-white"><Facebook size={20} /></Link>
                  <Link href="#" className="text-white/70 hover:text-white"><Twitter size={20} /></Link>
                  <Link href="#" className="text-white/70 hover:text-white"><Linkedin size={20} /></Link>
                  <Link href="#" className="text-white/70 hover:text-white"><Youtube size={20} /></Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
