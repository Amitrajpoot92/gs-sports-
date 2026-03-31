import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroLanding from '../../assets/home/hero.webp'; 

const Hero = () => {
  return (
    // 🚀 Height updated: lg:h-[95vh] for desktop and increased min-height for mobile
    <section className="relative min-h-[700px] lg:h-[95vh] w-full bg-[#0a0a0a] overflow-hidden flex flex-col lg:flex-row">
      
      {/* 1. IMAGE AREA */}
      {/* 🚀 Image area height adjusted for a more vertical feel */}
      <div className="relative w-full lg:w-3/5 h-[450px] md:h-[600px] lg:h-full order-1 lg:order-2">
        <img 
          src={heroLanding} 
          alt="GS Brand Sports Gear"
          className="w-full h-full object-cover object-center lg:object-right-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0a0a0a] lg:via-transparent lg:to-transparent" />
        
        <div className="absolute bottom-10 right-6 md:right-10 bg-orange-600 px-5 py-3 flex items-center gap-2 shadow-2xl z-20">
          <Star size={14} className="text-white fill-current" />
          <span className="text-white text-[10px] font-black tracking-widest uppercase">A++ Grade Willow</span>
        </div>
      </div>

      {/* 2. TEXT CONTENT AREA */}
      <div className="relative w-full lg:w-2/5 flex items-center z-10 order-2 lg:order-1 px-6 py-12 md:py-20 lg:pl-16 lg:py-0">
        <div className="max-w-xl text-left">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-4 md:mb-6"
          >
            {/* Tagline placeholder or empty space as per original */}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic leading-[1] uppercase mb-8"
          >
            Power In <br />
            <span className="text-orange-600">Every Stroke.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-base md:text-lg lg:text-xl mb-10 max-w-sm font-medium leading-relaxed opacity-80"
          >
            Elevate your game with GS Brand's handcrafted cricket gear. Designed for the modern-day champion.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 lg:gap-6"
          >
            <Link to="/products" className="px-10 py-5 bg-orange-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl">
              Shop Now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link to="/about" className="px-10 py-5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-center">
              Our Process
            </Link>
          </motion.div>
          
          {/* Background Text Accent */}
          <div className="absolute left-0 bottom-10 hidden lg:block opacity-[0.03] pointer-events-none">
            <h2 className="text-[12rem] font-black italic text-white tracking-tighter">GSBRAND</h2>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;