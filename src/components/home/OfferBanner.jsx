import React from "react";
import { motion } from "framer-motion";
import { Ticket, ArrowRight, Timer } from "lucide-react";
import { Link } from "react-router-dom"; // 👈 Router Link

const OfferBanner = () => {
  return (
    <section className="py-12 md:py-20 bg-white px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-[#0a0a0a] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-[0_40px_80px_-15px_rgba(234,88,12,0.25)]"
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,#ea580c15,transparent)] z-0" />

          {/* 1. Text Content Area */}
          <div className="relative z-10 lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full flex items-center gap-1.5 animate-pulse">
                <Timer size={12} /> Limited Time Offer
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white italic leading-[0.9] uppercase tracking-tighter">
              Get <span className="text-orange-600">20% OFF</span> <br /> 
              On All Sports Gear
            </h2>

            <p className="text-gray-400 text-sm md:text-lg max-w-md font-medium leading-relaxed opacity-80">
              Handcrafted for champions. Use code <span className="text-white font-bold border-b border-orange-600">GS_CHAMP20</span> to save on your next order.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
              {/* 🚀 Simple Redirect to Products Page Top */}
              <Link 
                to="/products" 
                className="group px-10 py-4 bg-orange-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
              >
                Claim Offer <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest">
                <Ticket size={14} className="text-orange-500" /> Terms apply
              </div>
            </div>
          </div>

          {/* 2. Visual Area */}
          <div className="relative lg:w-1/2 flex items-center justify-center z-10">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d"
                alt="Pro Gear"
                className="w-full max-w-[450px] rounded-2xl shadow-2xl transform lg:-rotate-6 border border-white/5"
              />
              
              <div className="absolute -bottom-6 -right-6 md:right-0 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black italic">
                  %
                </div>
                <div className="leading-tight text-left">
                   <p className="text-[10px] text-gray-500 font-bold uppercase">Save Big</p>
                   <p className="text-sm font-black text-black uppercase">Season Sale</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferBanner;