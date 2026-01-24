"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Facebook, Twitter, Linkedin, Youtube, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: "HOME", labelKey: "HOME", href: "/" },
    { name: "ABOUT", labelKey: "ABOUT", href: "/#about" },
    { name: "OUR_TEAM", labelKey: "OUR_TEAM", href: "/our-team" },
    { name: "PROJECTS", labelKey: "PROJECTS", href: "/projects" },
    { name: "PUBLICATIONS", labelKey: "PUBLICATIONS", href: "/publications" },
    { name: "GALLERY", labelKey: "GALLERY", href: "/all-gallery" },
    { name: "RESEARCH", labelKey: "RESEARCH", href: "/research" },
    { name: "CONTACT", labelKey: "CONTACT", href: "/#contact" },
  ];

  const ScrollingContent = () => (
    <div className="flex items-center gap-6 md:gap-12 whitespace-nowrap">
      <span className="text-gray-300 text-[10px] md:text-xs lg:text-sm font-bold">
        <span className="text-blue-400">{t("RESEARCH_HIGHLIGHT")}</span>, education, and community action for a <span className="text-blue-400">{t("SUSTAINABLE_HIGHLIGHT")}</span> future.
      </span>
      <span className="text-gray-300 text-[10px] md:text-xs lg:text-sm font-bold">
        Empowering <span className="text-blue-400">{t("COMMUNITIES_HIGHLIGHT")}</span> through innovative environmental research.
      </span>
      <span className="text-gray-300 text-[10px] md:text-xs lg:text-sm font-bold">
        Working <span className="text-blue-400">{t("TOGETHER_HIGHLIGHT")}</span> for a greener and cleaner planet.
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
        <div className="hidden sm:block w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl overflow-hidden bg-white/5 py-2 rounded-full border border-white/10 relative ml-4">
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
              <div className="w-8 md:w-12" /> {/* Spacer */}
            </div>
            <div className="flex shrink-0">
              <ScrollingContent />
              <div className="w-8 md:w-12" /> {/* Spacer */}
            </div>
          </motion.div>
        </div>

        {/* Right: Social Icons */}
        <div className="hidden md:flex items-center gap-4 text-gray-400">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="hover:text-white transition-colors p-1 relative"
              title={t("LANGUAGE")}
            >
              <Globe size={18} strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-[#1e293b] text-white rounded-lg shadow-xl overflow-hidden z-50 min-w-[150px]"
                >
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors ${
                      language === "en" ? "bg-blue-600" : ""
                    }`}
                  >
                    {t("ENGLISH")}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("ja");
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors ${
                      language === "ja" ? "bg-blue-600" : ""
                    }`}
                  >
                    {t("JAPANESE")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                  href={link.href || "/"}
                  className={`inline-block px-3 py-4 transition-all duration-200 hover:bg-[#1d4ed8] text-white ${
                    pathname === (link.href || "/") ? "bg-[#1d4ed8] border-b-2 border-white" : ""
                  }`}
                >
                  {t(link.labelKey)}
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
                      href={link.href || "/"}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-6 py-3 text-sm font-bold border-b border-white/5 last:border-0 text-white hover:bg-white/10 transition-colors"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
                {/* Mobile Language Switcher */}
                <li className="flex flex-col gap-2 py-4 border-t border-white/10 mt-2 px-6">
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setIsMenuOpen(false);
                    }}
                    className={`text-sm font-bold py-2 px-3 rounded transition-colors ${
                      language === "en" ? "bg-blue-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {t("ENGLISH")}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("ja");
                      setIsMenuOpen(false);
                    }}
                    className={`text-sm font-bold py-2 px-3 rounded transition-colors ${
                      language === "ja" ? "bg-blue-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {t("JAPANESE")}
                  </button>
                </li>
                {/* Mobile Social Icons */}
                <li className="flex justify-center gap-6 py-6 border-t border-white/10 mt-2">
                  <button className="text-white/70 hover:text-white"><Facebook size={20} /></button>
                  <button className="text-white/70 hover:text-white"><Twitter size={20} /></button>
                  <button className="text-white/70 hover:text-white"><Linkedin size={20} /></button>
                  <button className="text-white/70 hover:text-white"><Youtube size={20} /></button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
