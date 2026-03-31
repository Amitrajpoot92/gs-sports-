import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Users, Search, Mail, Phone, Calendar, ShieldCheck, Loader2, Clock, ArrowRight } from "lucide-react";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // all, today, month

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
      setFilteredUsers(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 🚀 Filtering Logic (Time & Search)
  useEffect(() => {
    let result = [...users];

    // 1. Search Filter
    if (searchTerm) {
      result = result.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Time Filter
    if (timeFilter !== "all") {
      const now = new Date();
      result = result.filter(u => {
        const uDate = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
        if (timeFilter === "today") return uDate.toDateString() === now.toDateString();
        if (timeFilter === "month") return uDate.getMonth() === now.getMonth() && uDate.getFullYear() === now.getFullYear();
        return true;
      });
    }

    setFilteredUsers(result);
  }, [searchTerm, timeFilter, users]);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Syncing Member Base...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 font-sans px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Member <span className="text-orange-600">Arena</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <Users size={12} className="text-orange-600"/> Total Signups: {users.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" placeholder="FIND MEMBER..." 
              className="w-full bg-white border-2 border-slate-50 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-orange-600/20 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-900 text-white p-4 rounded-2xl text-[10px] font-black uppercase outline-none cursor-pointer border-none shadow-xl"
          >
            <option value="all">Lifetime Access</option>
            <option value="today">Joined Today</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-black uppercase italic text-slate-900 tracking-tighter">Registered Personnel</h3>
          <span className="text-[9px] font-black text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
            {filteredUsers.length} Entries Found
          </span>
        </div>

        {/* Scrollable Table Wrapper */}
        <div className="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="sticky top-0 bg-white z-20 shadow-sm">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">Member Identity</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-center">Contact Info</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-center">Registration Date</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black italic text-sm shrink-0 shadow-lg group-hover:bg-orange-600 transition-colors">
                          {item.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 uppercase text-sm italic leading-tight">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold lowercase tracking-tight mt-0.5">{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-slate-600">
                        <Phone size={12} className="text-orange-600" />
                        <span className="text-[10px] font-black italic tracking-widest">{item.phone || "---"}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock size={12} className="text-orange-600" />
                          <span className="text-[10px] font-black uppercase italic">
                            {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                         <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter border ${item.role === 'admin' ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-200' : 'bg-white text-slate-400 border-slate-200'}`}>
                           {item.role}
                         </span>
                         {item.role === 'admin' && <ShieldCheck size={16} className="text-blue-500 shrink-0" />}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">No members found in this perimeter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View More Placeholder / Footer */}
        <div className="p-6 bg-slate-900 text-center">
           <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.5em]">GS brand • INTERNAL DATABASE • END OF LOG</p>
        </div>
      </div>
    </div>
  );
};

export default Customers;