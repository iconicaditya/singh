"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Facebook, Twitter, Linkedin, Youtube, Send } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
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
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row overflow-hidden rounded-[2.5rem] shadow-2xl bg-white min-h-[700px]"
        >
          {/* Left Panel: Dark Theme with Abstract Background */}
          <div className="lg:w-[45%] relative overflow-hidden flex flex-col justify-center p-12 lg:p-16 text-white">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/attached_assets/stock_images/abstract_nature_back_0976b9f0.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-60 scale-110 blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-black/70 to-black" />
                  <motion.div 
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      x: [0, 10, 0],
                      y: [0, -10, 0] 
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none"
                  />
                </div>

            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl lg:text-5xl font-black mb-6 leading-tight"
              >
                Let&apos;s Build a <br />
                <span className="text-blue-400">Greener Future</span>
              </motion.h2>
              <p className="text-gray-300 text-lg mb-12 max-w-sm">
                Have questions about our research or want to collaborate? Reach out to our team.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                    <MapPin size={24} className="text-blue-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-blue-400 uppercase tracking-widest mb-1">Location</h4>
                    <p className="text-gray-200">Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                    <Mail size={24} className="text-blue-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-blue-400 uppercase tracking-widest mb-1">Email Us</h4>
                    <p className="text-gray-200">info@singhlab.org</p>
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <h4 className="font-bold text-sm text-blue-400 uppercase tracking-widest mb-6">Follow Our Progress</h4>
                <div className="flex gap-4">
                  {[Facebook, Twitter, Linkedin, Youtube].map((Icon, idx) => (
                    <motion.a
                      key={idx}
                      href="#"
                      whileHover={{ scale: 1.2, y: -5 }}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Clean White Form */}
          <div className="lg:w-[55%] bg-white p-12 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h3 className="text-2xl font-black text-[#1e293b] mb-8">Send a Message</h3>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:scale-[1.02] transition-all placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                  <motion.input 
                    animate={errors.email ? { x: [-2, 2, -2, 2, 0] } : {}}
                    type="email" 
                    onChange={handleEmailChange}
                    placeholder="john@example.com"
                    className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border outline-none focus:ring-2 focus:bg-white focus:scale-[1.02] transition-all placeholder:text-gray-300 ${
                      errors.email ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-blue-100'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Message</label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:scale-[1.02] transition-all placeholder:text-gray-300 resize-none"
                  ></textarea>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-sm tracking-widest shadow-xl shadow-blue-200 relative group overflow-hidden"
                >
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    SEND MESSAGE 
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}