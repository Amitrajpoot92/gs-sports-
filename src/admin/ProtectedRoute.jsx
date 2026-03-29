import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🕒 1. अगर Firebase अभी यूजर का डेटा लोड कर रहा है
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  // 🚫 2. अगर यूजर लॉगिन ही नहीं है
  if (!user) {
    // उसे एडमिन लॉगिन पर भेजें और current location याद रखें ताकि लॉगिन के बाद वापस यहीं आए
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 🛡️ 3. सबसे ज़रूरी: अगर लॉगिन है पर 'Admin' नहीं है (Security Check)
  // यह तभी काम करेगा जब आपने Firestore में अपनी ID के अंदर role: "admin" लिखा हो
  if (user.role !== "admin") {
    console.error("Access Denied: Non-admin user attempted to access dashboard.");
    alert("Bhai, aapke paas is area ka access nahi hai! 🚫");
    return <Navigate to="/" replace />;
  }

  // ✅ 4. अगर सब सही है, तो एडमिन पेज दिखाओ
  return children;
};

export default ProtectedRoute;