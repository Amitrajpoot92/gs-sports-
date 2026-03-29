import React from "react";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Zap, Headphones } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Fast Delivery",
    desc: "Lightning fast shipping.",
    icon: <Truck size={24} />,
    color: "from-blue-600 to-blue-400",
  },
  {
    id: 2,
    title: "100% Genuine",
    desc: "Direct from factories.",
    icon: <ShieldCheck size={24} />,
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: 3,
    title: "Elite Pricing",
    desc: "Best market rates.",
    icon: <Zap size={24} />,
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: 4,
    title: "Pro Support",
    desc: "24/7 Expert advice.",
    icon: <Headphones size={24} />,
    color: "from-purple-600 to-pink-500",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-orange-600 rounded-full"></div>
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter">
            Why <span className="text-orange-600">GS Brand?</span>
          </h2>
        </div>

        {/* Horizontal Scroll for Mobile, Grid for Desktop */}
        <div 
          className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-6 md:pb-0 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[200px] md:min-w-full snap-center group"
            >
              {/* Compact Card */}
              <div className="relative p-5 h-[160px] md:h-auto flex flex-col md:flex-row items-center md:items-start gap-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                
                {/* Icon Box */}
                <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                  {feature.icon}
                </div>

                {/* Text Content */}
                <div className="text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-black text-slate-900 uppercase italic leading-none mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-tight">
                    {feature.desc}
                  </p>
                </div>

                {/* Corner Number */}
                <span className="absolute top-2 right-4 text-xs font-black text-slate-200 group-hover:text-orange-100 transition-colors">
                  0{feature.id}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;