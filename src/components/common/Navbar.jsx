import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Cart", path: "/cart" },
    { name: "Track Order", path: "/track-order" },
  ];

  const getUserDisplayName = () => {
    if (!user) return null;
    return user.name || user.displayName || user.email?.split("@")[0] || "Champion";
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full transition-all duration-500 z-[999] ${
          scrolled || isOpen ? "bg-black py-4 border-b border-white/10 shadow-2xl" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
          
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)} className="relative z-[1001]">
            <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase leading-none tracking-tighter">
              GS<span className="text-orange-600">SPORTS</span>
            </h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
                  location.pathname === link.path ? "text-orange-500" : "text-white hover:text-orange-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 relative z-[1001]">
            {user && user.email ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end leading-none">
                  <span className="text-[7px] font-black text-orange-600 uppercase italic tracking-widest leading-none">Champion</span>
                  <span className="text-white font-bold text-[10px] uppercase truncate max-w-[120px]">
                    {getUserDisplayName()}
                  </span>
                </div>
                <button 
                  onClick={() => { if(window.confirm("Bhai, logout karna hai?")) logout(); }}
                  className="w-9 h-9 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all border border-white/10 shadow-lg"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              // 🚀 यहाँ साइज कम किया गया है (Compact Size)
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2 bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all shadow-lg shadow-orange-600/20 active:scale-95"
              >
                Join Arena
              </button>
            )}

            <button className="lg:hidden text-white w-10 h-10 flex items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-[#0a0a0a] z-[998] flex flex-col justify-between p-8 pt-28"
          >
            <div className="space-y-6 relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                  className={`text-4xl font-black italic uppercase tracking-tighter block transition-colors ${
                    location.pathname === link.path ? "text-orange-600" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-6 border-t border-white/5">
                {user && user.email ? (
                  <div className="space-y-4">
                    <p className="text-orange-600 font-black italic text-xl uppercase tracking-tighter">
                      Hi, {getUserDisplayName()}!
                    </p>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-white/30 font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
                      <LogOut size={14} /> Logout Session
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setIsLoginModalOpen(true); setIsOpen(false); }} className="w-full py-5 bg-orange-600 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl italic shadow-xl">
                    Member Login
                  </button>
                )}
              </div>
            </div>

            {/* Support Info */}
            <div className="relative z-10 border-t border-white/10 pt-8 flex justify-between items-center">
               <div className="space-y-1">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Support Line</p>
                 <p className="text-sm font-black text-white italic">+91 85079 49676</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white text-[10px] font-black italic">GS</div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
               <h2 className="text-[45vw] font-black italic text-white uppercase leading-none">GS</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Navbar;