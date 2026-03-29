import React, { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Package, Users, ArrowRight, ExternalLink } from "lucide-react";
import StatCard from "../components/StatCard";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    regularProducts: 0,
    featuredProducts: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. 📈 Real-time Stats Logic
    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      let totalRev = 0;
      let activeCount = 0;
      const allOrders = snapshot.docs.map(doc => doc.data());

      allOrders.forEach(order => {
        // अगर पेमेंट 'paid' है तो रेवेन्यू में जोड़ो
        if (order.paymentStatus === "paid") {
          totalRev += Number(order.totalAmount || 0);
        }
        // अगर स्टेटस 'delivered' या 'cancelled' नहीं है, तो वो 'Active' है
        if (order.status !== "completed" && order.status !== "cancelled") {
          activeCount++;
        }
      });

      setStats(prev => ({ ...prev, revenue: totalRev, activeOrders: activeCount }));
    });

    // 2. 📦 Products Count (Regular vs Featured)
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const products = snapshot.docs.map(doc => doc.data());
      const featured = products.filter(p => p.isFeatured).length;
      setStats(prev => ({ 
        ...prev, 
        totalProducts: products.length,
        regularProducts: products.length - featured,
        featuredProducts: featured
      }));
    });

    // 3. 👥 Customers Count (Total Signups)
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats(prev => ({ ...prev, totalCustomers: snapshot.size }));
    });

    // 4. 🛒 Latest 5 Orders
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
    const unsubRecent = onSnapshot(q, (snapshot) => {
      setRecentOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubUsers();
      unsubRecent();
    };
  }, []);

  const formatCurrency = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none italic">
            Store <span className="text-orange-600">Pulse</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            Live Analytics Dashboard
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          val={formatCurrency(stats.revenue)} 
          sub="Verified Payments"
          icon={<TrendingUp size={20}/>} 
          color="bg-blue-600" 
        />
        <StatCard 
          label="Active Orders" 
          val={stats.activeOrders.toString().padStart(2, '0')} 
          sub="Processing/Transit"
          icon={<ShoppingBag size={20}/>} 
          color="bg-orange-600" 
        />
        <StatCard 
          label="Inventory" 
          val={stats.totalProducts} 
          sub={`${stats.featuredProducts} Featured Gear`}
          icon={<Package size={20}/>} 
          color="bg-slate-900" 
        />
        <StatCard 
          label="GS Customers" 
          val={`${stats.totalCustomers}+`} 
          sub="Total Signups"
          icon={<Users size={20}/>} 
          color="bg-green-600" 
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Latest Dispatches</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time order stream (Last 5)</p>
          </div>
          <Link 
            to="/admin/orders" 
            className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-orange-600 transition-all border border-slate-100 px-4 py-2 rounded-full"
          >
            Manage All Orders <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-5 text-[10px] font-black uppercase text-slate-400 tracking-widest pl-4">Order Details</th>
                <th className="pb-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                <th className="pb-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-4">Amount</th>
              </tr>
            </thead>
            <tbody className="text-[12px] font-bold">
              {recentOrders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => navigate('/admin/orders')}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer group"
                >
                  <td className="py-6 pl-4">
                    <div className="flex flex-col">
                      <span className="font-black uppercase tracking-tighter text-slate-900 text-sm italic">#GS-{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-tighter border ${
                      order.status === 'completed' 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-6 text-right pr-4">
                    <div className="flex flex-col items-end">
                      <span className="font-black italic tracking-tighter text-slate-950 text-base">₹{order.totalAmount}</span>
                      <span className={`text-[8px] font-black uppercase mt-1 ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-slate-400'}`}>
                        {order.paymentStatus === 'paid' ? '● Verified' : '○ Pending'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">
                    Waiting for the first battlefield order...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;