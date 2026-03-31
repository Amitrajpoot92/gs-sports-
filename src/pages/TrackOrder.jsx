import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore"; // 🚀 onSnapshot का जादू
import { useAuth } from "../context/AuthContext";
import { 
  Package, Truck, MapPin, CheckCircle2, Clock, 
  Loader2, ShoppingBag, ShieldCheck, ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // 🛡️ अगर यूजर नहीं है तो लोड करना बंद करो
    if (!user) {
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", user.uid));

    // 🔥 Real-time Listener (onSnapshot)
    // यह आपके डेटाबेस से सीधा कनेक्शन बना देगा
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const myOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 🛠️ Manual Sort (Newest First)
      myOrders.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      setOrders(myOrders);
      setLoading(false);
    }, (error) => {
      console.error("Real-time Tracking Error:", error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-600" size={40} />
      <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Syncing Gear Stats...</p>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full h-[80px] bg-black fixed top-0 left-0 z-[100]" />
      <ShieldCheck className="text-slate-100 mb-6" size={80} />
      <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Login Required</h2>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Login to see your orders.</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full h-[80px] bg-black fixed top-0 left-0 z-[100]" />
      <ShoppingBag className="text-slate-100 mb-6" size={80} />
      <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">No History</h2>
      <Link to="/products" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest mt-8 flex items-center gap-2">Explore Products <ArrowRight size={14}/></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <div className="w-full h-[80px] bg-black fixed top-0 left-0 z-[100]" />
      <div className="pt-[140px] px-6 max-w-5xl mx-auto">
        <header className="mb-12 border-l-4 border-orange-600 pl-6">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Order <span className="text-orange-600">History</span></h1>
          <p className="mt-4 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Welcome back, {user.name || "Champion"}</p>
        </header>

        <div className="space-y-12">
          {orders.map((order) => (
            <motion.div 
              key={order.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} // Real-time अपडेट के समय स्मूथ ट्रांजिशन
              className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-6">
                  <div>
                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all duration-500 ${order.status === 'completed' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>{order.status}</span>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mt-4 leading-none">#GS-{order.id.slice(-6).toUpperCase()}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">Date: {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-black uppercase text-slate-900 italic">
                        <span>{item.name} x{item.qty}</span>
                        <span className="text-orange-600">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-50 flex justify-between font-black">
                       <span className="text-xs">Total</span>
                       <span className="text-lg italic">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-8 lg:pt-4">
                  <StatusStep title="Order Placed" sub="Verified by GS brand" icon={<Clock size={16}/>} done={true} />
                  <StatusStep title="In Warehouse" sub="Packing your gear" icon={<Package size={16}/>} done={['confirmed', 'shipped', 'completed'].includes(order.status)} active={order.status === 'pending'} />
                  <StatusStep title="Dispatched" sub="On the way to your city" icon={<Truck size={16}/>} done={['shipped', 'completed'].includes(order.status)} active={order.status === 'shipped'} />
                  <StatusStep title="Delivered" sub="Gear reached destination" icon={<MapPin size={16}/>} done={order.status === 'completed'} isLast={true} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusStep = ({ title, sub, icon, done, active, isLast }) => (
  <div className="flex gap-6 relative">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-700 ${done ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : active ? "bg-slate-900 text-white animate-pulse" : "bg-slate-200 text-slate-400"}`}>
      {done ? <CheckCircle2 size={18} /> : icon}
    </div>
    <div className="flex flex-col pb-8">
      <h4 className={`text-xs font-black uppercase italic tracking-tighter transition-colors duration-500 ${done || active ? "text-slate-900" : "text-slate-300"}`}>{title}</h4>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</p>
    </div>
    {!isLast && <div className={`absolute left-5 top-10 w-[2px] h-10 -z-0 transition-colors duration-700 ${done ? "bg-orange-600" : "bg-slate-100"}`} />}
  </div>
);

export default TrackOrder;