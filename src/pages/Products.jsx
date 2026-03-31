import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ShoppingBag, LayoutGrid, Search, ArrowRight, Loader2, Zap, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useCart } from "../context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const [sportsData, setSportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catQuery = query(collection(db, "categories"), orderBy("name", "asc"));
        const catSnapshot = await getDocs(catQuery);
        const categoriesList = catSnapshot.docs.map(doc => doc.data().name);

        const prodQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const prodSnapshot = await getDocs(prodQuery);
        const allProducts = prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const groupedData = categoriesList.map(cat => ({
          category: cat,
          description: `Elite performance gear for ${cat} enthusiasts.`,
          products: allProducts.filter(p => p.category === cat)
        })).filter(section => section.products.length > 0);

        setSportsData(groupedData);
        setLoading(false);

        // --- Deep Link Scroll Logic ---
        const queryParams = new URLSearchParams(location.search);
        const searchCat = queryParams.get("search");
        if (searchCat) {
          const targetIndex = groupedData.findIndex(s => s.category.toLowerCase() === searchCat.toLowerCase());
          if (targetIndex !== -1) setTimeout(() => scrollToSection(targetIndex), 500);
        }

        if (location.hash) {
          const targetId = location.hash.replace("#", "");
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              const offset = 180;
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
              element.classList.add("ring-4", "ring-orange-600", "duration-500", "rounded-[2.5rem]");
              setTimeout(() => element.classList.remove("ring-4", "ring-orange-600"), 3000);
            }
          }, 800);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search, location.hash]);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      const offset = 160; 
      window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
    }
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setCurrentImgIdx(0);
  };

  const nextImg = (imgs) => setCurrentImgIdx((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
  const prevImg = (imgs) => setCurrentImgIdx((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-600" size={40} />
      <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Syncing Arenas...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* FIXED HEADER */}
      <div className="fixed top-0 left-0 w-full z-[140]">
        <div className="h-[75px] w-full bg-black border-b border-white/5" />
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-white rounded-lg shrink-0"><LayoutGrid size={14} /></div>
            {sportsData.map((data, idx) => (
              <button key={idx} onClick={() => scrollToSection(idx)} className="px-5 py-2 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-orange-600 hover:text-white rounded-full transition-all border border-slate-100 whitespace-nowrap">
                {data.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DYNAMIC CONTENT */}
      <div className="pt-[160px] pb-20 max-w-7xl mx-auto px-6 space-y-24">
        {sportsData
          .filter(sec => sec.category.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((section, idx) => (
          <div key={idx} id={`section-${idx}`} className="space-y-6">
            <div className="flex justify-between items-end border-l-4 border-orange-600 pl-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">{section.category}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.products.map((item) => (
                <div key={item.id} id={item.id} className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl transition-all duration-500 relative">
                  {item.stock <= 0 && (
                    <div className="absolute top-8 left-8 z-10 bg-red-600 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic shadow-xl">
                      Sold Out
                    </div>
                  )}

                  <div onClick={() => openQuickView(item)} className="cursor-pointer relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 mb-6">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} loading="lazy" />
                    <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-2xl font-black italic text-xs">₹{item.price}</div>
                  </div>
                  
                  <div className="px-2 space-y-4">
                    <div onClick={() => openQuickView(item)} className="cursor-pointer">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">{item.name}</h3>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Professional Series</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        disabled={item.stock <= 0}
                        onClick={() => addToCart(item)}
                        className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-[9px] uppercase hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-30"
                      >
                        <ShoppingBag size={14} /> Cart
                      </button>
                      <button 
                        disabled={item.stock <= 0}
                        onClick={() => { addToCart(item); navigate("/cart"); }}
                        className="flex items-center justify-center gap-2 bg-orange-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase hover:bg-black transition-all active:scale-95 shadow-lg shadow-orange-600/20 disabled:opacity-30"
                      >
                        <Zap size={14} fill="white" /> Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 QUICKVIEW MODAL (POPUP) - COMPACT MOBILE VIEW */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-4xl md:rounded-[3rem] rounded-t-[3rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col md:flex-row"
            >
              {/* Close Button - More visible and separated */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-[1010] bg-slate-900/50 hover:bg-red-600 backdrop-blur-md text-white p-2 rounded-full transition-all md:top-6 md:right-6"
              >
                <X size={20} />
              </button>

              {/* 🖼️ IMAGE SECTION - Adjusted Aspect Ratio for Mobile */}
              <div className="md:w-1/2 w-full aspect-[4/5] md:aspect-auto relative bg-slate-50 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImgIdx}
                    src={selectedProduct.imageUrls ? selectedProduct.imageUrls[currentImgIdx] : selectedProduct.imageUrl}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* 🏹 Arrows - Positioned not to interfere with Close Button */}
                {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
                  <>
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                      <button 
                        onClick={() => prevImg(selectedProduct.imageUrls)} 
                        className="pointer-events-auto p-2 bg-white/90 rounded-full shadow-lg text-slate-900 active:scale-90"
                      >
                        <ChevronLeft size={24}/>
                      </button>
                      <button 
                        onClick={() => nextImg(selectedProduct.imageUrls)} 
                        className="pointer-events-auto p-2 bg-white/90 rounded-full shadow-lg text-slate-900 active:scale-90"
                      >
                        <ChevronRight size={24}/>
                      </button>
                    </div>
                    
                    {/* Progress Dots */}
                    <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5">
                      {selectedProduct.imageUrls.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${i === currentImgIdx ? "w-6 bg-orange-600" : "w-1.5 bg-black/20"}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 📝 INFO SECTION - Compacted for Mobile */}
              <div className="md:w-1/2 w-full p-6 md:p-12 overflow-y-auto">
                <div className="space-y-5 md:space-y-6">
                  <div>
                    <span className="text-orange-600 font-black text-[9px] uppercase tracking-widest italic">{selectedProduct.category}</span>
                    <h2 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none mt-1">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-2xl md:text-3xl font-black italic text-slate-900">₹{selectedProduct.price}</p>
                      {selectedProduct.stock > 0 ? (
                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight">In Arena: {selectedProduct.stock}</span>
                      ) : (
                        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight">Sold Out</span>
                      )}
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-100" />

                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gear Details</p>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium whitespace-pre-line">
                      {selectedProduct.description || "Elite professional series gear designed for champions."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-4">
                    <button 
                      disabled={selectedProduct.stock <= 0}
                      onClick={() => { addToCart(selectedProduct); navigate("/cart"); }}
                      className="w-full bg-orange-600 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-20"
                    >
                      <Zap size={16} fill="white" /> Buy Now
                    </button>
                    <button 
                      disabled={selectedProduct.stock <= 0}
                      onClick={() => { addToCart(selectedProduct); }}
                      className="w-full bg-slate-100 text-slate-900 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-20"
                    >
                      <ShoppingBag size={16} /> Add To Cart
                    </button>
                  </div>
                  
                  <p className="text-center text-[8px] font-bold text-slate-300 uppercase tracking-widest pt-2">GS brand • Premium Gear</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;