import React, { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Package, Users, ArrowRight, Clock, User, Phone } from "lucide-react";
import StatCard from "../components/StatCard";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("orders"); // orders, revenue, inventory, customers
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    featuredProducts: 0,
    totalCustomers: 0
  });
  
  const [dataList, setDataList] = useState({
    orders: [],
    revenue: [],
    inventory: [],
    customers: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 📈 Orders & Revenue Logic
    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      let totalRev = 0;
      let activeCount = 0;
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      orders.forEach(order => {
        if (order.paymentStatus === "paid") totalRev += Number(order.totalAmount || 0);
        if (order.status !== "completed" && order.status !== "cancelled") activeCount++;
      });

      setStats(prev => ({ ...prev, revenue: totalRev, activeOrders: activeCount }));
      setDataList(prev => ({ 
        ...prev, 
        orders: orders.slice(0, 5),
        revenue: orders.filter(o => o.paymentStatus === "paid").slice(0, 5) 
      }));
    });

    // 2. 📦 Inventory Logic
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const featured = products.filter(p => p.section === 'featured').length;
      setStats(prev => ({ 
        ...prev, 
        totalProducts: products.length,
        featuredProducts: featured
      }));
      setDataList(prev => ({ ...prev, inventory: products.slice(0, 5) }));
    });

    // 3. 👥 Customers Logic
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStats(prev => ({ ...prev, totalCustomers: users.length }));
      setDataList(prev => ({ ...prev, customers: users.slice(0, 5) }));
      setLoading(false);
    });

    return () => { unsubOrders(); unsubProducts(); unsubUsers(); };
  }, []);

  const formatCurrency = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  // 🚀 UPDATED REDIRECTION LOGIC
  const handleViewAll = () => {
    switch (activeView) {
      case "orders":
        navigate("/admin/orders");
        break;
      case "inventory":
        navigate("/admin/all-products"); // As per your link
        break;
      case "revenue":
        navigate("/admin/revanue"); // Redirects to your new revenue file
        break;
      case "customers":
        navigate("/admin/customer"); // Redirects to your new customer file
        break;
      default:
        navigate("/admin");
    }
  };

  return (
    <div className="space-y-8 pb-10 px-4 md:px-0 font-sans">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic leading-none">
            Store <span className="text-orange-600">Pulse</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Real-time Systems Online
          </p>
        </div>
      </div>

      {/* Stats Grid - Clickable Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div onClick={() => setActiveView("revenue")} className="cursor-pointer transform transition-transform active:scale-95">
          <StatCard label="Total Revenue" val={formatCurrency(stats.revenue)} sub="Paid Collections" icon={<TrendingUp size={20}/>} color={activeView === "revenue" ? "bg-orange-600 shadow-xl shadow-orange-600/20" : "bg-blue-600"} />
        </div>
        <div onClick={() => setActiveView("orders")} className="cursor-pointer transform transition-transform active:scale-95">
          <StatCard label="Active Orders" val={stats.activeOrders.toString().padStart(2, '0')} sub="Live Operations" icon={<ShoppingBag size={20}/>} color={activeView === "orders" ? "bg-orange-600 shadow-xl shadow-orange-600/20" : "bg-orange-600"} />
        </div>
        <div onClick={() => setActiveView("inventory")} className="cursor-pointer transform transition-transform active:scale-95">
          <StatCard label="Inventory" val={stats.totalProducts} sub="Active Listings" icon={<Package size={20}/>} color={activeView === "inventory" ? "bg-orange-600 shadow-xl shadow-orange-600/20" : "bg-slate-900"} />
        </div>
        <div onClick={() => setActiveView("customers")} className="cursor-pointer transform transition-transform active:scale-95">
          <StatCard label="GS Customers" val={stats.totalCustomers} sub="Member Base" icon={<Users size={20}/>} color={activeView === "customers" ? "bg-orange-600 shadow-xl shadow-orange-600/20" : "bg-green-600"} />
        </div>
      </div>

      {/* Dynamic Data Table Area */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">
              {activeView === "orders" && "Latest Dispatches"}
              {activeView === "revenue" && "Recent Payments"}
              {activeView === "inventory" && "Warehouse Stock"}
              {activeView === "customers" && "New Signups"}
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Activity Stream • Last 5 entries</p>
          </div>
          
          <button 
            onClick={handleViewAll}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-orange-600 transition-all border border-slate-100 px-5 py-3 rounded-full bg-slate-50 md:bg-transparent w-full md:w-auto justify-center group"
          >
            View Full System <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Details</th>
                <th className="pb-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Context</th>
                <th className="pb-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Value/ID</th>
              </tr>
            </thead>
            <tbody className="text-[12px] font-bold divide-y divide-slate-50">
              {dataList[activeView].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-all group">
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      {activeView === 'inventory' && <img src={item.imageUrl} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />}
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-tighter text-slate-900 text-sm italic">
                          {activeView === 'customers' ? item.name : (item.name || `#GS-${item.id.slice(-6).toUpperCase()}`)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {activeView === 'customers' ? item.email : (item.customerName || item.category)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-6 text-center">
                    {activeView === 'orders' && (
                      <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-tighter border ${item.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {item.status}
                      </span>
                    )}
                    {activeView === 'inventory' && (
                      <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1 rounded-lg italic">Qty: {item.stock || 0}</span>
                    )}
                    {activeView === 'revenue' && (
                      <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] uppercase font-black">
                        <Clock size={12} className="text-orange-600"/> {item.createdAt?.toDate().toLocaleDateString()}
                      </div>
                    )}
                    {activeView === 'customers' && (
                      <div className="flex items-center justify-center gap-2 text-slate-500 font-black italic">
                        <Phone size={12} className="text-orange-600"/> {item.phone || "N/A"}
                      </div>
                    )}
                  </td>

                  <td className="py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-black italic tracking-tighter text-slate-950 text-base">
                        {activeView === 'inventory' ? `₹${item.price}` : (item.totalAmount ? `₹${item.totalAmount}` : <User className="text-slate-200" />)}
                      </span>
                      {item.paymentStatus === 'paid' && (
                        <span className="text-[8px] font-black uppercase mt-1 text-green-500 italic">● Verified Inflow</span>
                      )}
                      {activeView === 'customers' && (
                        <span className="text-[8px] font-black uppercase mt-1 text-slate-400 italic">Verified Account</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;