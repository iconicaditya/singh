"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Facebook, Twitter, Linkedin, Youtube, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/#about" },
    { name: "OUR TEAM", href: "/#team" },
    { name: "PROJECTS", href: "/projects" },
    { name: "GALLERY", href: "/all-gallery" },
    { name: "RESEARCH", href: "/research" },
    { name: "CONTACT", href: "/#contact" },
  ];

  const ScrollingContent = () => (
    <div className="flex items-center gap-12 whitespace-nowrap">
      <span className="text-gray-300 text-xs md:text-sm font-bold">
        <span className="text-blue-400">Research</span>, education, and community action for a <span className="text-blue-400">sustainable</span> future.
      </span>
      <span className="text-gray-300 text-xs md:text-sm font-bold">
        Empowering <span className="text-blue-400">communities</span> through innovative environmental research.
      </span>
      <span className="text-gray-300 text-xs md:text-sm font-bold">
        Working <span className="text-blue-400">together</span> for a greener and cleaner planet.
      </span>
    </div>
  );

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
        <div className="w-full md:max-w-md lg:max-w-xl overflow-hidden bg-white/5 py-2 rounded-full border border-white/10 relative">
          <motion.div
            initial={{ x: "0%" }}
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            }}
            className="flex w-fit"
          >
            <div className="flex shrink-0">
              <ScrollingContent />
              <div className="w-12" /> {/* Spacer */}
            </div>
            <div className="flex shrink-0">
              <ScrollingContent />
              <div className="w-12" /> {/* Spacer */}
            </div>
          </motion.div>
        </div>

        {/* Right: Social Icons */}
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
                  className={`inline-block px-3 py-4 transition-all duration-200 hover:bg-[#1d4ed8] text-white ${
                    pathname === link.href ? "bg-[#1d4ed8] border-b-2 border-white" : ""
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
              <ul className="flex flex-col py-2 text-center">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-6 py-3 text-sm font-bold border-b border-white/5 last:border-0 text-white hover:bg-white/10 transition-colors"
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
