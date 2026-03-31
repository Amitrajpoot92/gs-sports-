import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, updateDoc, doc, query, orderBy, deleteDoc } from "firebase/firestore";
import { 
  Truck, ExternalLink, MapPin, Phone, Package, 
  CheckCircle2, X, Clock, User, Navigation, Home, Hash, Trash2, ShieldCheck, CreditCard, Search, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  // 🔄 Real-time DB Sync (Changed to onSnapshot for instant updates)
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
      setFilteredOrders(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🚀 Filtering Logic (Time & Search)
  useEffect(() => {
    let result = [...orders];
    if (searchTerm) {
      result = result.filter(o => 
        o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (timeFilter !== "all") {
      const now = new Date();
      result = result.filter(o => {
        const oDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt?.seconds * 1000);
        if (timeFilter === "today") return oDate.toDateString() === now.toDateString();
        if (timeFilter === "month") return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear();
        return true;
      });
    }
    setFilteredOrders(result);
  }, [searchTerm, timeFilter, orders]);

  // 🔄 Status Update Logic
  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      if (selectedOrder) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) { console.error(err); }
  };

  // 💰 Payment Toggle Logic
  const togglePayment = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
    try {
      await updateDoc(doc(db, "orders", orderId), { paymentStatus: nextStatus });
      if (selectedOrder) setSelectedOrder(prev => ({ ...prev, paymentStatus: nextStatus }));
    } catch (err) { console.error(err); }
  };

  // 🗑️ Delete Order
  const deleteOrder = async (id) => {
    if(window.confirm("Bhai, are you sure? Ye hamesha ke liye hat jayega!")) {
      try { await deleteDoc(doc(db, "orders", id)); } catch (err) { console.error(err); }
    }
  };

  const statusColors = {
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    shipped: "bg-purple-50 text-purple-600 border-purple-100",
    completed: "bg-green-50 text-green-600 border-green-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Syncing Dispatches...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 font-sans px-4 md:px-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Order <span className="text-orange-600">Central</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Total Operations: {orders.length}</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" placeholder="FIND ORDER..." 
              className="w-full bg-white border-2 border-slate-50 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-orange-600/20 shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-900 text-white p-4 rounded-2xl text-[10px] font-black uppercase outline-none cursor-pointer border-none shadow-xl"
          >
            <option value="all">Lifetime Stream</option>
            <option value="today">Today's Orders</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-black uppercase italic text-slate-900 tracking-tighter">Dispatch Queue</h3>
        </div>

        <div className="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead className="sticky top-0 bg-white z-20 shadow-sm">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50">TXN Identity</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-center">Metadata</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black uppercase tracking-tighter text-slate-900 text-sm italic">#GS-{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">₹{order.totalAmount}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 uppercase text-[12px] italic">{order.customerName}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase mt-1">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-tighter border ${statusColors[order.status || 'pending']}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-slate-900 text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2"
                      >
                        Details <ArrowRight size={12} />
                      </button>
                      <button 
                        onClick={() => deleteOrder(order.id)} 
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-900 text-center">
           <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.5em]">GS SPORTS • ORDER INTELLIGENCE LOGS</p>
        </div>
      </div>

      {/* 🚀 Order Intelligence Modal (Keep your original logic) */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              
              <div className="bg-slate-950 p-8 text-white flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Intelligence Brief</h2>
                  <p className="text-orange-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12}/> ID: GS-{selectedOrder.id.toUpperCase()}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-all"><X size={18} /></button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Logistics Info</p>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-xl font-black text-slate-900 uppercase italic leading-none">{selectedOrder.customerName}</p>
                      <div className="mt-6 space-y-4 font-bold text-slate-700">
                        <div className="flex items-center gap-3 text-xs bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <Phone size={14} className="text-orange-600" /> {selectedOrder.phone}
                        </div>
                        <div className="space-y-3 pl-1 text-[11px]">
                          <div className="flex items-start gap-3 leading-relaxed">
                            <Home size={14} className="text-orange-600 shrink-0 mt-0.5" /> 
                            <span>{selectedOrder.shipping?.fullAddress || selectedOrder.address || "Address N/A"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Navigation size={14} className="text-orange-600" /> 
                            <span>{selectedOrder.shipping?.city || "N/A"}, {selectedOrder.shipping?.state || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Workflow Action</p>
                    <div className="grid grid-cols-2 gap-2">
                       <StatusBtn label="Placed" status="pending" active={selectedOrder.status === 'pending'} onClick={() => updateStatus(selectedOrder.id, 'pending')} />
                       <StatusBtn label="Confirmed" status="confirmed" active={selectedOrder.status === 'confirmed'} onClick={() => updateStatus(selectedOrder.id, 'confirmed')} />
                       <StatusBtn label="Shipped" status="shipped" active={selectedOrder.status === 'shipped'} onClick={() => updateStatus(selectedOrder.id, 'shipped')} />
                       <StatusBtn label="Completed" status="completed" active={selectedOrder.status === 'completed'} onClick={() => updateStatus(selectedOrder.id, 'completed')} />
                    </div>
                    <button onClick={() => updateStatus(selectedOrder.id, 'cancelled')} className={`w-full p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedOrder.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-400 border-red-100 hover:bg-red-500 hover:text-white'}`}>Cancel Dispatch</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Package size={14}/> Item Manifest</p>
                  <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="p-4 flex justify-between items-center border-b border-white last:border-none">
                        <div className="flex items-center gap-4">
                          <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover bg-white" />
                          <div><p className="text-xs font-black uppercase text-slate-900 italic tracking-tighter">{item.name}</p><p className="text-[9px] font-bold text-slate-400 uppercase">Qty: {item.qty}</p></div>
                        </div>
                        <p className="text-sm font-black italic text-slate-900 tracking-tight">₹{item.price * item.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-8 rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl">
                   <div>
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Collection</p>
                     <p className="text-4xl font-black italic text-orange-600 leading-none tracking-tighter">₹{selectedOrder.totalAmount}</p>
                   </div>
                   <button 
                     onClick={() => togglePayment(selectedOrder.id, selectedOrder.paymentStatus)}
                     className={`px-6 py-4 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 transition-all ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                   >
                     <CreditCard size={14}/> {selectedOrder.paymentStatus === 'paid' ? 'Verified Paid' : 'Mark as Paid'}
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusBtn = ({ label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`p-4 rounded-2xl flex flex-col items-center justify-center border transition-all ${active ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-600'}`}
  >
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-orange-600' : 'text-slate-900'}`}>{label}</span>
  </button>
);

const Loader2 = ({ className, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default Orders;