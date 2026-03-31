import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { X, Loader2, Mail, Lock, User, KeyRound, ArrowRight, Phone, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoginModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // 🚀 New Phone Field
  const [showPassword, setShowPassword] = useState(false); // 👁️ Eye toggle
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // 💡 Smart Error State
  
  const { login, signup } = useAuth();

  // 🚀 स्मार्ट एरर टाइमआउट लॉजिक
  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const handleForgotPassword = async () => {
    if (!email) return showError("Bhai, pehle email to likho!");
    try {
      await sendPasswordResetEmail(auth, email);
      showError("Reset link sent! Check your inbox. 📧"); // Reuse toast for success too
    } catch (err) { showError(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) { 
        await login(email, password); 
      } else { 
        // Signup logic with Name and Phone
        await signup(email, password, name, phoneNumber); 
      }
      onClose(); 
    } catch (err) { 
      showError(err.message); 
    }
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

          {/* Smart Error Popup (Toast) */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 z-[1200] bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400"
              >
                <AlertCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Box */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            className="relative bg-white w-full max-w-[360px] rounded-[2.5rem] overflow-hidden shadow-2xl p-6 md:p-8"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-slate-300 hover:text-orange-600 transition-colors"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl mx-auto flex items-center justify-center rotate-12 shadow-lg shadow-orange-600/20 mb-4">
                <KeyRound className="text-white -rotate-12" size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {isLogin ? "Member Login" : "Join Arena"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Name Input */}
                  <div className="relative flex items-center">
                    <User className="absolute left-4 text-slate-300 z-10" size={18} />
                    <input 
                      type="text" placeholder="FULL NAME" required 
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-[13px] text-slate-900 outline-none border-2 border-transparent focus:border-orange-600/20 pl-12 transition-all" 
                    />
                  </div>
                  {/* Phone Input */}
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 text-slate-300 z-10" size={18} />
                    <input 
                      type="tel" placeholder="PHONE NUMBER" required 
                      value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-[13px] text-slate-900 outline-none border-2 border-transparent focus:border-orange-600/20 pl-12 transition-all" 
                    />
                  </div>
                </>
              )}

              {/* Email Input */}
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-300 z-10" size={18} />
                <input 
                  type="email" placeholder="EMAIL ADDRESS" required 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-[13px] text-slate-900 outline-none border-2 border-transparent focus:border-orange-600/20 pl-12 transition-all" 
                />
              </div>

              {/* Password Input with Eye Icon */}
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-300 z-10" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="PASSWORD" required 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-[13px] text-slate-900 outline-none border-2 border-transparent focus:border-orange-600/20 pl-12 pr-12 transition-all" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-300 hover:text-orange-600 transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isLogin && (
                <div className="text-right px-1">
                  <button 
                    type="button" onClick={handleForgotPassword} 
                    className="text-[9px] font-black uppercase text-slate-400 hover:text-orange-600"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button 
                type="submit" disabled={loading} 
                className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl mt-4 active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Authenticate" : "Create Account")}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
              <button 
                onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }} 
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600"
              >
                {isLogin ? "New Player? Join Arena" : "Already a Pro? Login Here"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;