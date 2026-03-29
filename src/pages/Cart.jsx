import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="w-full h-[80px] bg-black fixed top-0 left-0 z-[100]" />
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
           <ShoppingBag className="text-slate-200" size={40} />
        </div>
        <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Your bag is empty</h2>
        <Link to="/products" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest mt-8">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Navbar Spacer */}
      <div className="w-full h-[80px] bg-black" />
      
      <div className="max-w-7xl mx-auto px-6 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
            My Gear <span className="text-orange-600">Bag</span>
          </h1>
          
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-white p-4 rounded-[2.5rem] border border-slate-100 group transition-all hover:shadow-xl">
                <div className="w-full sm:w-40 h-40 rounded-[2rem] overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-slate-900 uppercase text-lg leading-tight">{item.name}</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{item.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <p className="font-black text-slate-950 italic text-xl">₹{(item.price * item.qty).toLocaleString()}</p>
                    <div className="flex items-center gap-5 bg-slate-100 px-5 py-3 rounded-2xl">
                      <button onClick={() => updateQty(item.id, "minus")}><Minus size={14} /></button>
                      <span className="font-black text-xs">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, "plus")}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-950 p-8 rounded-[3.5rem] text-white sticky top-32 shadow-2xl">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
               Summary <ShieldCheck className="text-orange-600" size={24} />
            </h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                <span>Items Value</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xl font-black italic italic uppercase">Total</span>
                <span className="text-3xl font-black text-orange-600 italic">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {user ? (
              <Link to="/checkout" className="w-full bg-orange-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all">
                Secure Checkout <ArrowRight size={18} />
              </Link>
            ) : (
              <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Please login to checkout</p>
                <div className="flex items-center justify-center gap-2 text-orange-600 font-black italic uppercase text-xs">
                  <Lock size={14} /> Account Required
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;