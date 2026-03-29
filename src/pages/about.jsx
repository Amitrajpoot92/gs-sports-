import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Zap, Award, Target, Instagram, 
  Youtube, MessageCircle, MapPin, Phone, MessageSquare, ArrowUpRight 
} from 'lucide-react';

// 🚀 Founder Image Import
import founderImg from '../assets/home/founder.png';

const About = () => {
  const features = [
    { icon: <ShieldCheck className="text-orange-600" />, title: "Premium Quality", desc: "A++ Grade English Willow for pro-series." },
    { icon: <Award className="text-orange-600" />, title: "Handcrafted", desc: "Meticulously built by experts with decades of experience." },
    { icon: <Zap className="text-orange-600" />, title: "Power & Balance", desc: "Perfect weight distribution for explosive power." },
    { icon: <Target className="text-orange-600" />, title: "Pro Standards", desc: "Trusted by athletes for reliability and grip." },
  ];

  const socialLinks = [
    { name: "Instagram", icon: <Instagram size={18} />, url: "https://www.instagram.com/gs_sports_mairwa?igsh=aG5pNTBkcnhqY2x5", color: "hover:bg-pink-600" },
    { name: "YouTube", icon: <Youtube size={18} />, url: "https://youtube.com/@vikashthakur9046?si=dcKhg5STz4rSfWXd", color: "hover:bg-red-600" },
    { name: "WhatsApp", icon: <MessageCircle size={18} />, url: "https://wa.me/918507949676", color: "hover:bg-green-600" },
  ];

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32 pb-16 px-4 md:px-6 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- 1. THE FOUNDER STORY --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <div className="space-y-2">
              <span className="text-orange-600 font-black tracking-[0.3em] text-[8px] md:text-[10px] uppercase italic">The Visionary</span>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 italic uppercase tracking-tighter leading-[0.9]">
                SUSHIL <br /> <span className="text-orange-600 font-black">KUMAR</span>
              </h1>
            </div>
            
            <div className="space-y-6">
              <p className="text-slate-500 text-sm md:text-lg leading-relaxed max-w-lg font-medium mx-auto lg:mx-0">
                "GS Brand was born in Mairwa out of a simple passion: to make world-class cricket gear accessible to every aspiring champion. We build the confidence to dominate the pitch."
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 pt-4">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-all duration-500 group ${social.color} hover:text-white shadow-sm`}
                  >
                    {social.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative w-full max-w-[320px] md:max-w-full mx-auto"
          >
            <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-[8px] md:border-[12px] border-white">
              <img 
                src={founderImg} 
                alt="Sushil Kumar - Founder" 
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -top-5 -right-5 w-32 h-32 md:w-64 md:h-64 bg-orange-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-5 -left-5 w-32 h-32 md:w-64 md:h-64 bg-slate-900/5 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* --- 2. ARENA FEATURES --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-24 md:mb-32">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 md:p-10 bg-slate-50 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 hover:border-orange-600/20 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-3xl shadow-sm flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-12 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-black text-slate-900 uppercase italic tracking-tighter text-xl md:text-2xl mb-3 md:mb-4 leading-none">{f.title}</h3>
              <p className="text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* --- 3. THE CONTACT GRID (WhatsApp Focused) --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 bg-slate-950 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-10">
               <div className="space-y-2">
                 <span className="text-orange-600 font-black tracking-widest text-[8px] md:text-[10px] uppercase">Direct Access</span>
                 <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Get in <br /> <span className="text-orange-600">The Arena</span></h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-3">
                    <p className="flex items-center gap-3 text-white/50 font-black text-[8px] md:text-[10px] uppercase tracking-widest"><MapPin size={14} className="text-orange-600"/> Headquarters</p>
                    <p className="text-base md:text-lg font-black italic uppercase leading-snug">Mairwa, Siwan, <br className="hidden md:block" /> Bihar - 841239</p>
                  </div>
                  <div className="space-y-3">
                    <p className="flex items-center gap-3 text-white/50 font-black text-[8px] md:text-[10px] uppercase tracking-widest"><Phone size={14} className="text-orange-600"/> Rapid Support</p>
                    <p className="text-base md:text-lg font-black italic uppercase">+91 85079 49676</p>
                  </div>
               </div>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-[35vw] md:text-[20vw] font-black italic pointer-events-none uppercase">GS</div>
          </div>

          {/* 🚀 Updated Quick Chat Card: WhatsApp Instead of Mail */}
          <div className="bg-orange-600 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-12 flex flex-col justify-between text-white shadow-2xl shadow-orange-600/30">
             <div className="space-y-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center">
                    <MessageSquare size={28} md:size={32} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">Bulk <br /> Inquiry</h3>
                <p className="text-white/70 font-bold text-[10px] md:text-[11px] uppercase tracking-widest leading-relaxed">For bulk orders, custom gear, or any professional queries, chat with us directly.</p>
             </div>
             <a 
               href="https://wa.me/918507949676?text=Hi GS Sports, I have a bulk inquiry." 
               target="_blank"
               rel="noopener noreferrer"
               className="mt-8 flex items-center justify-between bg-white text-slate-900 p-5 md:p-6 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-all group"
             >
                Chat on WhatsApp <ArrowUpRight size={18} md:size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;