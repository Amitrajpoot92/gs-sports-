import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy, deleteDoc } from "firebase/firestore";
import { 
  Truck, ExternalLink, MapPin, Phone, Package, 
  CheckCircle, X, Clock, User, Navigation, Home, Hash, Trash2, ShieldCheck, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchOrders(); }, []);

  // 🗑️ DELETE ORDER LOGIC
  const deleteOrder = async (id) => {
    if(window.confirm("Bhai, are you sure? Ye order hamesha ke liye delete ho jayega!")) {
      try {
        await deleteDoc(doc(db, "orders", id));
        alert("Order Deleted!");
        fetchOrders();
      } catch (err) { console.error(err); }
    }
  };

  // 🔄 UPDATE STATUS LOGIC
  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      fetchOrders();
      if (selectedOrder) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) { console.error(err); }
  };

  // 💰 UPDATE PAYMENT LOGIC
  const togglePayment = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
    try {
      await updateDoc(doc(db, "orders", orderId), { paymentStatus: nextStatus });
      fetchOrders();
      if (selectedOrder) setSelectedOrder(prev => ({ ...prev, paymentStatus: nextStatus }));
    } catch (err) { console.error(err); }
  };

  const statusColors = {
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    shipped: "bg-purple-50 text-purple-600 border-purple-100",
    completed: "bg-green-50 text-green-600 border-green-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="space-y-10 pb-20 px-4 md:px-0 font-sans">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
          Order <span className="text-orange-600">Central</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{orders.length} Total Gear Dispatches</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl transition-all group relative">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${statusColors[order.status || 'pending']}`}>
                <Package size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                  #{order.id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {order.customerName} • {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 w-full md:w-auto">
              <div className="text-left md:text-right">
                <p className="text-xl font-black italic text-slate-900 leading-none">₹{order.totalAmount}</p>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusColors[order.status || 'pending']}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-orange-600 transition-all active:scale-95"
                >
                  View Details <ExternalLink size={14} />
                </button>
                <button 
                  onClick={() => deleteOrder(order.id)}
                  className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              
              <div className="bg-slate-950 p-8 text-white flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Order Intelligence</h2>
                  <p className="text-orange-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12}/> Order ID: GS-{selectedOrder.id.toUpperCase()}
                  </p>
                  <p className="text-slate-500 font-bold text-[8px] uppercase tracking-widest">User UID: {selectedOrder.userId}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-all"><X size={18} /></button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={14}/> Logistics Info</p>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-xl font-black text-slate-900 uppercase italic leading-none">{selectedOrder.customerName}</p>
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3 text-slate-600 font-bold text-xs bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                          <Phone size={14} className="text-orange-600" /> {selectedOrder.phone}
                        </div>
                        
                        <div className="space-y-3 pl-1">
                           {/* 🚀 FIXED HOME ADDRESS RENDER */}
                           <div className="flex items-start gap-3 text-slate-700 font-bold text-[11px] leading-relaxed">
                              <Home size={14} className="text-orange-600 shrink-0 mt-0.5" /> 
                              <span>
                                {selectedOrder.shipping?.fullAddress || 
                                 selectedOrder.address || 
                                 selectedOrder.fullAddress || 
                                 "Address not provided"}
                              </span>
                           </div>
                           
                           <div className="flex items-center gap-3 text-slate-700 font-bold text-[11px]">
                              <Navigation size={14} className="text-orange-600" /> 
                              <span>{selectedOrder.shipping?.city || selectedOrder.city || "N/A"}, {selectedOrder.shipping?.state || selectedOrder.state || "N/A"}</span>
                           </div>
                           
                           <div className="flex items-center gap-3 text-slate-700 font-bold text-[11px]">
                              <Hash size={14} className="text-orange-600" /> 
                              <span>Pincode: {selectedOrder.shipping?.pincode || selectedOrder.pincode || "N/A"}</span>
                           </div>

                           {/* 🚀 LANDMARK FIX */}
                           {(selectedOrder.shipping?.landmark || selectedOrder.landmark) && (
                             <div className="bg-orange-600/5 text-orange-600 p-2 rounded-lg text-[10px] font-black uppercase border border-orange-600/10 italic text-center">
                               Near: {selectedOrder.shipping?.landmark || selectedOrder.landmark}
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Workflow Action (Tracker Sync)</p>
                    <div className="grid grid-cols-1 gap-2">
                       <StatusBtn label="Order Placed" sub="Verified by GS" status="pending" active={selectedOrder.status === 'pending'} onClick={() => updateStatus(selectedOrder.id, 'pending')} />
                       <StatusBtn label="In Warehouse" sub="Packing Gear" status="confirmed" active={selectedOrder.status === 'confirmed'} onClick={() => updateStatus(selectedOrder.id, 'confirmed')} />
                       <StatusBtn label="Dispatched" sub="In Transit" status="shipped" active={selectedOrder.status === 'shipped'} onClick={() => updateStatus(selectedOrder.id, 'shipped')} />
                       <StatusBtn label="Delivered" sub="Mission Accomplished" status="completed" active={selectedOrder.status === 'completed'} onClick={() => updateStatus(selectedOrder.id, 'completed')} />
                       <button onClick={() => updateStatus(selectedOrder.id, 'cancelled')} className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedOrder.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-400 border-red-100 hover:bg-red-500 hover:text-white'}`}>Cancel Order</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Package size={14}/> Gear Selection</p>
                  <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="p-4 flex justify-between items-center border-b border-white last:border-none">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200"><img src={item.imageUrl} alt="" className="w-full h-full object-cover" /></div>
                          <div><p className="text-xs font-black uppercase text-slate-900 tracking-tighter">{item.name}</p><p className="text-[9px] font-bold text-slate-400 italic">Qty: {item.qty} × ₹{item.price}</p></div>
                        </div>
                        <p className="text-sm font-black italic text-slate-900 tracking-tight">₹{item.price * item.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-8 rounded-[2.5rem] flex justify-between items-center text-white shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Due From Customer</p>
                     <p className="text-4xl font-black italic text-orange-600 leading-none tracking-tighter">₹{selectedOrder.totalAmount}</p>
                   </div>
                   <div className="text-right relative z-10 space-y-2">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Payment Security</p>
                     <button 
                       onClick={() => togglePayment(selectedOrder.id, selectedOrder.paymentStatus)}
                       className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 transition-all ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                     >
                       <CreditCard size={14}/> {selectedOrder.paymentStatus === 'paid' ? 'Paid & Verified' : 'Mark as Paid'}
                     </button>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none uppercase font-black text-8xl italic">GS</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 💡 Internal Component for Clean Buttons
const StatusBtn = ({ label, sub, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`p-4 rounded-2xl flex flex-col items-center justify-center border transition-all ${active ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 hover:border-orange-600'}`}
  >
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-orange-600' : 'text-slate-900'}`}>{label}</span>
    <span className={`text-[8px] font-bold uppercase ${active ? 'text-white/40' : 'text-slate-400'}`}>{sub}</span>
  </button>
);

export default Orders;