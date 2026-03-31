import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Instagram, Youtube, ArrowUpRight, Globe, 
  ShieldCheck, Zap, X, ShieldAlert, FileText, Lock 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState(null); 

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Cart", path: "/cart" },
    { name: "Track Order", path: "/track-order" },
  ];

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-100 relative font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* 1. Logo & Mission */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
              GS<span className="text-orange-600">Sports</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
              Equipping the champions of tomorrow. Based in Mairwa.
            </p>
            
            {/* 🚀 Social Media: Instagram & YouTube Only */}
            <div className="flex gap-5">
              <a 
                href="https://www.instagram.com/gs_sports_mairwa?igsh=aG5pNTBkcnhqY2x5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-900 hover:text-orange-600 transition-all hover:-translate-y-1"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com/@vikashthakur9046?si=dcKhg5STz4rSfWXd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-900 hover:text-red-600 transition-all hover:-translate-y-1"
              >
                <Youtube size={22} />
              </a>
            </div>
          </div>

          {/* 2. Explore Store */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Explore Store</h4>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm font-black uppercase italic text-slate-900 hover:text-orange-600 transition-all flex items-center gap-1 group">
                    {item.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Support & Admin Access */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/admin/login" className="text-sm font-black uppercase italic text-orange-600 hover:text-slate-900 transition-all flex items-center gap-2">
                  <Lock size={12} /> Admin Console
                </Link>
              </li>
              <li>
                <button onClick={() => setModalType('privacy')} className="text-sm font-black uppercase italic text-slate-900 hover:text-orange-600 transition-all text-left">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setModalType('terms')} className="text-sm font-black uppercase italic text-slate-900 hover:text-orange-600 transition-all text-left">Terms & Conditions</button>
              </li>
              <li>
                <Link to="/about" className="text-sm font-black uppercase italic text-slate-900 hover:text-orange-600 transition-all">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* 4. Quick Info */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Quick Info</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Zap size={14} className="text-orange-600" />
                <span className="text-[11px] font-black uppercase italic tracking-tight">Fastest Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck size={14} className="text-orange-600" />
                <span className="text-[11px] font-black uppercase italic tracking-tight">100% Genuine Gear</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900">
                <Globe size={14} className="text-orange-600" />
                <span className="text-[11px] font-black uppercase italic tracking-tight">Across India Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase">
            © {currentYear} GS brand Worldwide
          </p>

          <a 
            href="https://codewebx.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-full hover:bg-orange-600 transition-all duration-500 shadow-lg"
          >
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Architected By</span>
            <span className="text-[12px] font-black text-white uppercase tracking-tighter flex items-center gap-2">
              CodeWebX<span className="text-orange-500 group-hover:text-white">.in</span>
              <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </span>
          </a>
        </div>
      </div>

      {/* --- POPUP MODAL SYSTEM --- */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setModalType(null)} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 20, opacity: 0 }} 
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="bg-slate-950 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {modalType === 'privacy' ? <ShieldAlert className="text-orange-600" /> : <FileText className="text-orange-600" />}
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">
                    {modalType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                  </h2>
                </div>
                <button onClick={() => setModalType(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-all"><X size={20}/></button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 text-slate-600 font-medium text-sm leading-relaxed">
                {modalType === 'privacy' ? (
                  <>
                    <p>At <span className="font-black text-slate-900 italic">GS brand</span>, we respect your privacy. This policy outlines how we handle your data.</p>
                    <div className="space-y-4">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic underline decoration-orange-600">1. Data Collection</h3>
                      <p>We collect only essential information required to process your orders, such as your Name, Phone Number, and Shipping Address.</p>
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic underline decoration-orange-600">2. WhatsApp Security</h3>
                      <p>Order coordination happens via WhatsApp to ensure direct communication.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Welcome to the <span className="font-black text-slate-900 italic">GS brand</span> arena. By using our store, you agree to the following terms:</p>
                    <div className="space-y-4">
                      <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic underline decoration-orange-600">1. Ordering Process</h3>
                      <p>All orders placed on the website are confirmed only after WhatsApp verification and payment confirmation.</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;