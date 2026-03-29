import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ShoppingBag, LayoutGrid, Search, ArrowRight, Loader2, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useCart } from "../context/CartContext"; 

const Products = () => {
  const [sportsData, setSportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

        // 🚀 1. CATEGORY SCROLL LOGIC (From Search Params)
        const queryParams = new URLSearchParams(location.search);
        const searchCat = queryParams.get("search");
        if (searchCat) {
          const targetIndex = groupedData.findIndex(s => s.category.toLowerCase() === searchCat.toLowerCase());
          if (targetIndex !== -1) setTimeout(() => scrollToSection(targetIndex), 500);
        }

        // 🚀 2. PRODUCT ID SCROLL LOGIC (From Hash #)
        // FeaturedProducts से आने वाली ID को यहाँ पकड़ेंगे
        if (location.hash) {
          const targetId = location.hash.replace("#", "");
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              const offset = 180; // Header के लिए गैप
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth"
              });
              
              // 💡 Highlight Effect: यूजर को पता चले कौन सा प्रोडक्ट है
              element.classList.add("ring-4", "ring-orange-600", "duration-500", "rounded-[2.5rem]");
              setTimeout(() => element.classList.remove("ring-4", "ring-orange-600"), 3000);
            }
          }, 800); // थोड़ा इंतज़ार ताकि इमेज लोड हो जाएं
        }

      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search, location.hash]); // Hash पर भी नजर रखो

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      const offset = 160; 
      window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
    }
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/cart"); 
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-600" size={40} />
      <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Syncing Arenas...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* FIXED HEADER */}
      <div className="fixed top-0 left-0 w-full z-[140]">
        <div className="h-[75px] w-full bg-black border-b border-white/5" />
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 shrink">
              <div className="p-2 bg-slate-900 text-white rounded-lg shrink-0"><LayoutGrid size={14} /></div>
              {sportsData.map((data, idx) => (
                <button key={idx} onClick={() => scrollToSection(idx)} className="px-5 py-2 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-orange-600 hover:text-white rounded-full transition-all border border-slate-100 whitespace-nowrap">
                  {data.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CONTENT */}
      <div className="pt-[160px] pb-20 max-w-7xl mx-auto px-6 space-y-24 font-sans">
        {sportsData
          .filter(sec => sec.category.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((section, idx) => (
          <div key={idx} id={`section-${idx}`} className="space-y-6 group/section">
            <div className="flex justify-between items-end border-l-4 border-orange-600 pl-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900">{section.category}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.products.map((item) => (
                // 🚀 यहाँ ID जोड़ दी ताकि स्क्रॉलिंग काम करे
                <div key={item.id} id={item.id} className="group/card bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 mb-6">
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt={item.name} loading="lazy" />
                    <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-2xl font-black italic shadow-xl">₹{item.price}</div>
                  </div>
                  
                  <div className="px-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">{item.name}</h3>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Professional Series</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => addToCart(item)}
                        className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                      >
                        <ShoppingBag size={14} /> Cart
                      </button>
                      <button 
                        onClick={() => handleBuyNow(item)}
                        className="flex items-center justify-center gap-2 bg-orange-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-orange-600/20"
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
    </div>
  );
};

export default Products;