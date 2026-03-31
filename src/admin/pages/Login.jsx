import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Eye toggle state
  const [loading, setLoading] = useState(false); // ⏳ Loader state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // लोडर चालू करें

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); 
    } catch (err) {
      setError("Invalid Credentials. Access Denied.");
      setLoading(false); // एरर आने पर लोडर बंद करें
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200">
        <div className="text-center">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
            GS <span className="text-orange-600">Admin</span>
          </h2>
          <p className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Restricted Access Area</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" required placeholder="ADMIN ID"
                className="w-full bg-white border-2 border-transparent focus:border-orange-600/20 px-12 py-4 rounded-2xl font-bold text-xs outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required placeholder="PASSWORD"
                className="w-full bg-white border-2 border-transparent focus:border-orange-600/20 px-12 py-4 rounded-2xl font-bold text-xs outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Authenticate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;