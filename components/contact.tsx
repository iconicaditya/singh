"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Facebook, Twitter, Linkedin, Globe, Send } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({ email: false });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState({ ...formState, email: value });
    if (value && !/^\S+@\S+\.\S+$/.test(value)) {
      setErrors({ email: true });
    } else {
      setErrors({ email: false });
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-black text-[#1a2233] tracking-tight">
            Let's Start a Conversation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question about our research or interested in collaboration? 
            We're here to help you turn visionary ideas into reality.
          </p>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col lg:row overflow-hidden rounded-[1rem] shadow-2xl bg-white min-h-[600px] border border-gray-100 lg:flex-row"
        >
          {/* Left Panel: Dark Theme */}
          <div className="lg:w-[40%] relative overflow-hidden flex flex-col p-12 lg:p-16 text-white bg-[#1a2233]">
            <div className="absolute inset-0 z-0">
              <Image
                src="/attached_assets/stock_images/abstract_nature_back_0976b9f0.jpg"
                alt="Background"
                fill
                className="object-cover opacity-20 blur-sm scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a2233]/90 via-[#1a2233]/95 to-[#1a2233]" />
              <motion.div 
                animate={{ 
                  opacity: [0.1, 0.2, 0.1],
                  x: [0, 5, 0],
                  y: [0, -5, 0] 
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none"
              />
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-2xl font-black mb-6 tracking-tight">Contact Information</h2>
              <p className="text-gray-400 text-sm mb-12 leading-relaxed">
                We are always open to discussing new projects, creative ideas or opportunities to be part of your visions.
              </p>

              <div className="space-y-10">
                <div className="flex items-start gap-5 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shrink-0">
                    <MapPin size={18} className="text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">Location</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Kobe City University of Foreign Studies<br />
                      Kobe<br />
                      Japan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shrink-0">
                    <Mail size={18} className="text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">Email</h4>
                    <p className="text-gray-400 text-xs">contact@singhlab.org</p>
                    <p className="text-gray-400 text-xs">research@singhlab.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shrink-0">
                    <Globe size={18} className="text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-4">Socials</h4>
                    <div className="flex gap-4">
                      <Facebook size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                      <Twitter size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                      <Linkedin size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="lg:w-[60%] bg-white p-12 lg:p-16">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Your Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-5 py-3 rounded-xl bg-[#f8fafc] border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Your Email <span className="text-red-500">*</span></label>
                  <motion.input 
                    animate={errors.email ? { x: [-2, 2, -2, 2, 0] } : {}}
                    type="email" 
                    onChange={handleEmailChange}
                    placeholder="john@example.com"
                    className={`w-full px-5 py-3 rounded-xl bg-[#f8fafc] border outline-none focus:ring-2 transition-all text-sm text-black ${
                      errors.email ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Subject</label>
                <input 
                  type="text" 
                  placeholder="Research collaboration..."
                  className="w-full px-5 py-3 rounded-xl bg-[#f8fafc] border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm text-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Message <span className="text-red-500">*</span></label>
                <textarea 
                  rows={6}
                  placeholder="How can we help you?"
                  className="w-full px-5 py-3 rounded-xl bg-[#f8fafc] border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm resize-none text-black"
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-xl bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
              >
                <Send size={18} />
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}