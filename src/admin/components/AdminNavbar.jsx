import React from "react";
import { UserCircle, Menu } from "lucide-react";

const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-10 flex items-center justify-between sticky top-0 z-[100]">
      
      {/* 1. Mobile Menu Icon - Left Side (Triggers the Sidebar) */}
      <div className="lg:hidden">
        <button 
          onClick={toggleSidebar} 
          className="p-3 bg-slate-950 text-white rounded-2xl shadow-xl active:scale-90 transition-all flex items-center justify-center"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* 2. Desktop Branding Placeholder */}
      <div className="hidden lg:block">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          GS <span className="text-orange-600">Inventory</span>
        </h2>
      </div>

      {/* 3. Profile Section - Right Side */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">
            GS Brand
          </p>
          <p className="text-[8px] font-bold text-orange-600 uppercase tracking-tighter mt-1">
            Super Admin
          </p>
        </div>
        
        {/* Profile Avatar Container */}
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner group cursor-pointer hover:border-orange-600/20 transition-all overflow-hidden">
          <UserCircle size={28} className="group-hover:text-slate-900 transition-colors" />
        </div>
      </div>

    </header>
  );
};

export default AdminNavbar;