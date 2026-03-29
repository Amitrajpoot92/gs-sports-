import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { X, Loader2, Mail, Lock, User, KeyRound, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleForgotPassword = async () => {
    if (!email) return alert("Bhai, email to likho!");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link sent! 📧");
    } catch (err) { alert(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) { await login(email, password); } 
      else { await signup(email, password, name); }
      onClose(); 
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Compact Modal Box */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            className="relative bg-white w-full max-w-[360px] rounded-[2rem] overflow-hidden shadow-2xl p-6 md:p-8"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-5 text-slate-300 hover:text-orange-600 transition-colors"
            >
              <X size={22} />
            </button>

            {/* Header - Compact */}
            <div className="text-center mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-xl mx-auto flex items-center justify-center rotate-12 shadow-lg shadow-orange-600/20 mb-2">
                <KeyRound className="text-white -rotate-12" size={20} />
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {isLogin ? "Member Login" : "Join Arena"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-slate-400 z-10" size={18} />
                  <input 
                    type="text" placeholder="FULL NAME" required 
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-xl font-bold text-[13px] text-slate-900 outline-none border-2 border-transparent focus:border-orange-600/20 pl-12 transition-all" 
                  />
                </div>
              )}

              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-400 z-10" size={18} />
                <input 
                  type="email" placeholder="EMAIL ADDRESS" required 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-xl font-bold text-[13px] text-slate-900 outline-none border-2 border-transparent focus:border-orange-600/20 pl-12 transition-all" 
                />
              </div>

              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-400 z-10" size={18} />
                <input 
                  type="password" placeholder="PASSWORD" required 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-xl font-bold text-[13px] text-slate-900 outline-none border-2 border-transparent focus:border-orange-600/20 pl-12 transition-all" 
                />
              </div>

              {isLogin && (
                <div className="text-right px-1">
                  <button 
                    type="button" onClick={handleForgotPassword} 
                    className="text-[9px] font-black uppercase text-slate-400 hover:text-orange-600"
                  >
                    Forgot?
                  </button>
                </div>
              )}

              <button 
                type="submit" disabled={loading} 
                className="w-full bg-slate-950 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl mt-2 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (isLogin ? "Authenticate" : "Create Account")}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-6 pt-4 border-t border-slate-50 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600"
              >
                {isLogin ? "New Player? Join" : "Already a Pro? Login"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;