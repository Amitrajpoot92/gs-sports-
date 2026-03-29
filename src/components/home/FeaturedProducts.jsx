import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react";
import ProductCard from "../common/ProductCard";
import { useNavigate, Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, "products"), where("section", "==", "featured"));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sorted = productsList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setFeaturedProducts(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // 🚀 Scroll Logic for Buttons
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) return (
    <div className="bg-[#0a0a0a] py-20 flex justify-center border-t border-white/5">
      <Loader2 className="text-orange-600 animate-spin" size={40} />
    </div>
  );

  if (featuredProducts.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] py-16 md:py-24 px-4 md:px-6 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Nav Controls */}
        <div className="flex justify-between items-end mb-10 md:mb-16">
          <div className="space-y-2">
            <span className="text-orange-600 font-black tracking-[0.3em] text-[8px] md:text-[10px] uppercase italic">The Elite Collection</span>
            <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
              Featured <span className="text-orange-500">Gear</span>
            </h2>
          </div>
          
          <div className="hidden md:flex gap-3">
             <button 
                onClick={() => scroll('left')}
                className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 transition-all active:scale-90 shadow-2xl"
             >
                <ChevronLeft size={28} />
             </button>
             <button 
                onClick={() => scroll('right')}
                className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 transition-all active:scale-90 shadow-2xl"
             >
                <ChevronRight size={28} />
             </button>
          </div>
        </div>

        {/* 📱 Horizontal Slider */}
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="min-w-[85vw] sm:min-w-[320px] md:min-w-[380px] snap-center"
            >
              {/* Card wrapper to handle direct navigation */}
              <div 
                onClick={() => navigate(`/products#${product.id}`)}
                className="cursor-pointer transition-transform active:scale-[0.98]"
              >
                <ProductCard product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  image: product.imageUrl, 
                  discount: "TOP PICK",
                  buttonText: "BUY NOW" // 🚀 'BUY NOW' टेक्स्ट यहाँ से पास किया
                }} />
              </div>
            </div>
          ))}
          
          {/* Shop All Card */}
          <Link 
            to="/products" 
            className="min-w-[70vw] sm:min-w-[320px] snap-center flex items-center justify-center border-2 border-dashed border-white/10 bg-white/5 group hover:bg-orange-600/10 transition-all rounded-[3rem]"
          >
             <div className="text-center p-12">
                <div className="w-20 h-20 rounded-3xl bg-orange-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-3xl shadow-orange-600/40">
                    <ArrowRight className="text-white" size={32} />
                </div>
                <p className="text-white font-black uppercase text-xs tracking-[0.3em] italic">View All Arsenal</p>
             </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;