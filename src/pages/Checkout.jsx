import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { 
  MapPin, Phone, User, MessageSquare, ArrowRight, 
  ShoppingBag, Loader2, Home
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || user?.displayName || "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    pincode: "",
    state: ""
  });

  if (!user) return <Navigate to="/" replace />;
  if (cartItems.length === 0) return <Navigate to="/products" />;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🚀 सुधार: एक 'fullAddress' स्ट्रिंग तैयार करें जो सीधे Admin Panel में दिखेगी
      const completeAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

      // 1. डेटा तैयार करें (Admin Orders पेज के लॉजिक के हिसाब से)
      const orderData = {
        userId: user.uid,
        customerName: formData.name,
        phone: formData.phone,
        address: completeAddress, // 👈 यह सीधे होम आइकॉन के सामने दिखेगा
        shipping: { 
          ...formData,
          fullAddress: completeAddress // 👈 बैकअप के लिए अंदर भी रख दिया
        },
        items: cartItems,
        totalAmount: subtotal,
        status: "pending",
        paymentStatus: "unpaid",
        createdAt: serverTimestamp(),
      };

      // 2. Firestore में सेव करें
      const docRef = await addDoc(collection(db, "orders"), orderData);
      const orderId = docRef.id.slice(-6).toUpperCase();

      // 3. WhatsApp Message Design 🚀
      const adminWhatsApp = "918507949676"; 
      let message = `*📦 NEW ORDER #GS-${orderId}* \n`;
      message += `----------------------------\n`;
      message += `*👤 Name:* ${formData.name}\n`;
      message += `*📞 Phone:* ${formData.phone}\n`;
      message += `*📍 Address:* ${completeAddress}\n`;
      message += `*🚩 Landmark:* ${formData.landmark || "N/A"}\n`;
      message += `----------------------------\n`;
      message += `*🛒 Items Ordered:*\n`;
      cartItems.forEach((item, i) => {
        message += `${i + 1}. ${item.name} (x${item.qty}) - ₹${item.price * item.qty}\n`;
      });
      message += `----------------------------\n`;
      message += `*💰 TOTAL PAYABLE: ₹${subtotal}*\n\n`;
      message += `*⚠️ PAYMENT ACTION:* \n_I have placed my order. Please share your QR code for payment confirmation._`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;

      // 4. Final Actions
      alert("✅ Order Placed Successfully! Redirecting to WhatsApp...");
      
      // WhatsApp खोलें
      window.open(whatsappURL, "_blank"); 

      // कार्ट साफ़ करना
      if(clearCart) await clearCart(); 
      
      // यूजर को वापस होम या ट्रैक पेज पर भेजें
      navigate("/track-order");

    } catch (err) {
      console.error(err);
      alert("Order Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Spacer for Navbar */}
      <div className="w-full h-[80px] bg-black" />
      
      <div className="max-w-6xl mx-auto pt-16 px-6">
        <div className="mb-10 text-center md:text-left border-l-4 border-orange-600 pl-6">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Elite <span className="text-orange-600">Checkout</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Finalize your gear acquisition</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleOrderSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 p-6 md:p-10 rounded-[3rem] border border-slate-100 space-y-6 shadow-sm">
              <h3 className="text-lg font-black uppercase italic text-slate-900 flex items-center gap-3 mb-2">
                <Home className="text-orange-600" size={20} /> Shipping Logistics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="text" placeholder="RECEIVER NAME" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white p-5 rounded-2xl font-black text-[10px] uppercase outline-none border border-slate-200 focus:border-orange-600 pl-14 shadow-sm tracking-widest" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="tel" placeholder="WP NUMBER" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white p-5 rounded-2xl font-black text-[10px] uppercase outline-none border border-slate-200 focus:border-orange-600 pl-14 shadow-sm tracking-widest" />
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-5 top-6 text-slate-300" size={18} />
                <textarea placeholder="STREET ADDRESS / VILLAGE / HOUSE NO." required rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-white p-5 rounded-2xl font-black text-[10px] uppercase outline-none border border-slate-200 focus:border-orange-600 pl-14 shadow-sm tracking-widest"></textarea>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <input type="text" placeholder="CITY" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-white p-4 rounded-xl font-black text-[9px] uppercase outline-none border border-slate-200 text-center tracking-widest" />
                 <input type="text" placeholder="PINCODE" required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full bg-white p-4 rounded-xl font-black text-[9px] uppercase outline-none border border-slate-200 text-center tracking-widest" />
                 <input type="text" placeholder="STATE" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-white p-4 rounded-xl font-black text-[9px] uppercase outline-none border border-slate-200 text-center tracking-widest" />
                 <input type="text" placeholder="LANDMARK" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} className="w-full bg-white p-4 rounded-xl font-black text-[9px] uppercase outline-none border border-slate-200 text-center tracking-widest" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-orange-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify & Pay on WhatsApp"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl sticky top-32 border-b-8 border-orange-600">
              <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-3 border-b border-white/5 pb-4 tracking-tighter">
                <ShoppingBag className="text-orange-600" size={22} /> Order Summary
              </h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-3">
                    <span className="text-white/60">{item.name} <span className="text-orange-600 ml-1">x{item.qty}</span></span>
                    <span className="italic">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-white/40">Grand Total</span>
                <span className="text-3xl font-black text-orange-600 italic tracking-tighter">₹{subtotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;