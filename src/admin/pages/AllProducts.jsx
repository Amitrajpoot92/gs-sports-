import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { 
  Trash2, Tag, IndianRupee, Loader2, ExternalLink, 
  Star, LayoutGrid, Search, PackageX, PackagePlus 
} from "lucide-react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 REAL-TIME DB SYNC (onSnapshot)
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
      setFilteredProducts(list);
      setLoading(false);
    }, (err) => {
      console.error("Inventory Sync Error:", err);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  // 🚀 FILTERING LOGIC
  useEffect(() => {
    let result = [...products];
    
    if (activeFilter !== "all") {
      result = result.filter(p => p.section === activeFilter);
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [activeFilter, searchTerm, products]);

  // 🗑️ DELETE HANDLER
  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai? Ye warehouse se hamesha ke liye hat jayega.")) {
      try {
        await deleteDoc(doc(db, "products", id));
        alert("Removed! 🗑️");
      } catch (err) { alert("Delete failed! Check internet."); }
    }
  };

  // 🕒 LOADING STATE
  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center italic">Scanning Warehouse Stock...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 font-sans">
      
      {/* 1. HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 italic leading-none">Gear Warehouse</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Active SKUs: {products.length} Items</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="FIND GEAR..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 p-5 pl-14 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-orange-600/30 transition-all shadow-sm tracking-widest"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        </div>
      </div>

      {/* 2. FILTER CONTROLS */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
        <FilterBtn label="All Stock" active={activeFilter === 'all'} onClick={() => setActiveFilter("all")} />
        <FilterBtn label="Regular" icon={<LayoutGrid size={14}/>} active={activeFilter === 'regular'} onClick={() => setActiveFilter("regular")} />
        <FilterBtn label="Featured" icon={<Star size={14}/>} active={activeFilter === 'featured'} onClick={() => setActiveFilter("featured")} isSpecial={true} />
      </div>

      {/* 3. INVENTORY DISPLAY */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <PackageX className="mx-auto text-slate-200 mb-6" size={60} />
           <h3 className="text-xl font-black uppercase italic text-slate-400 tracking-tighter">Inventory Dry</h3>
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-2">No items found matching the current filters.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Item Info</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Classification</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Unit Price</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shrink-0 bg-white group-hover:border-orange-600/30 transition-all">
                          <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase text-base tracking-tighter leading-none italic">{item.name}</p>
                          <p className={`text-[8px] font-black uppercase mt-1.5 px-2 py-0.5 rounded w-fit ${item.section === 'featured' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {item.section} Stock
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="bg-slate-50 text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-200 flex items-center gap-2 w-fit tracking-widest">
                        <Tag size={12} className="text-orange-600" /> {item.category}
                      </span>
                    </td>
                    <td className="p-6 font-black text-xl italic text-slate-950">₹{item.price.toLocaleString()}</td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a href={item.imageUrl} target="_blank" rel="noreferrer" className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><ExternalLink size={18} /></a>
                        <button onClick={() => handleDelete(item.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex gap-5">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-slate-50 shrink-0"><img src={item.imageUrl} className="w-full h-full object-cover" alt="" /></div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-black text-slate-900 uppercase text-base leading-tight italic">{item.name}</h3>
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest italic">₹{item.price.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleDelete(item.id)} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Delete Gear</button>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Tag size={12}/> {item.category}</span>
                   <span className={`text-[8px] font-black px-2 py-1 rounded uppercase ${item.section === 'featured' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{item.section}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// 💡 INTERNAL BUTTON COMPONENT (For Clean Code)
const FilterBtn = ({ label, icon, active, onClick, isSpecial }) => (
  <button 
    onClick={onClick}
    className={`px-7 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
      active 
        ? isSpecial ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'bg-slate-900 text-white shadow-xl' 
        : 'text-slate-400 hover:text-slate-900'
    }`}
  >
    {icon} {label}
  </button>
);

export default Inventory;