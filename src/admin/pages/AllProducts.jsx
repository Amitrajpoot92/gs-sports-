import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, onSnapshot, deleteDoc, doc, query, orderBy, updateDoc, increment } from "firebase/firestore";
import { 
  Trash2, Tag, IndianRupee, Loader2, ExternalLink, 
  Star, LayoutGrid, Search, PackageX, Plus, Minus, Edit3, X, UploadCloud, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit Modal States
  const [editingProduct, setEditingProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newImages, setNewImages] = useState([]); // Multiple new files
  const [existingImages, setExistingImages] = useState([]); // Images on Cloudinary

  const CLOUD_NAME = "dug2dfufw"; 
  const UPLOAD_PRESET = "gs-brand";

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubProducts = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
      setFilteredProducts(list);
      setLoading(false);
    });

    const unsubCats = onSnapshot(collection(db, "categories"), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubProducts(); unsubCats(); };
  }, []);

  useEffect(() => {
    let result = [...products];
    if (activeFilter !== "all") {
      result = result.filter(p => p.category === activeFilter || p.section === activeFilter);
    }
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [activeFilter, searchTerm, products]);

  const handleStockUpdate = async (id, amount) => {
    try {
      await updateDoc(doc(db, "products", id), { stock: increment(amount) });
    } catch (err) { alert("Stock sync failed!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, warehouse se hamesha ke liye hata dein?")) {
      try { await deleteDoc(doc(db, "products", id)); } catch (err) { alert("Delete failed!"); }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setExistingImages(product.imageUrls || [product.imageUrl]);
    setNewImages([]);
  };

  const removeExistingImg = (url) => {
    setExistingImages(existingImages.filter(img => img !== url));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      let finalUrls = [...existingImages];

      if (newImages.length > 0) {
        const uploadPromises = newImages.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", UPLOAD_PRESET);
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
          const fileData = await res.json();
          return fileData.secure_url;
        });
        const uploadedUrls = await Promise.all(uploadPromises);
        finalUrls = [...finalUrls, ...uploadedUrls];
      }

      if (finalUrls.length === 0) throw new Error("Bhai, kam se kam ek photo to honi chahiye!");

      await updateDoc(doc(db, "products", editingProduct.id), {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        category: editingProduct.category,
        description: editingProduct.description || "",
        section: editingProduct.section,
        imageUrls: finalUrls,
        imageUrl: finalUrls[0] 
      });

      setEditingProduct(null);
      alert("Inventory Updated Successfully! 🚀");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Warehouse...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 font-sans px-4 md:px-0">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic leading-none">Gear <span className="text-orange-600">Warehouse</span></h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Live Inventory Control</p>
        </div>
        <div className="relative w-full md:w-80">
          <input type="text" placeholder="FIND PRODUCT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border-2 border-slate-50 p-5 pl-14 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-orange-600/20 shadow-sm" />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        </div>
      </div>

      {/* 2. DYNAMIC CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto custom-scrollbar">
        <FilterBtn label="All Gear" active={activeFilter === 'all'} onClick={() => setActiveFilter("all")} />
        <FilterBtn label="Featured" active={activeFilter === 'featured'} onClick={() => setActiveFilter("featured")} isSpecial={true} />
        {categories.map(cat => (
          <FilterBtn key={cat.id} label={cat.name} active={activeFilter === cat.name} onClick={() => setActiveFilter(cat.name)} />
        ))}
      </div>

      {/* 3. TABLE DISPLAY */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest">
              <tr>
                <th className="p-8">Product Details</th>
                <th className="p-8 text-center">Stock Control</th>
                <th className="p-8 text-center">Price</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shrink-0">
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 uppercase text-sm tracking-tighter italic">{item.name}</p>
                        <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-md uppercase">{item.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-4 bg-slate-50 w-fit mx-auto p-2 rounded-2xl border border-slate-100">
                      <button onClick={() => handleStockUpdate(item.id, -1)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-red-600 transition-all shadow-sm"><Minus size={12}/></button>
                      <span className={`text-sm font-black italic min-w-[30px] text-center ${item.stock <= 0 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>{item.stock || 0}</span>
                      <button onClick={() => handleStockUpdate(item.id, 1)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-green-600 transition-all shadow-sm"><Plus size={12}/></button>
                    </div>
                  </td>
                  <td className="p-6 text-center font-black italic text-base text-slate-950">₹{item.price?.toLocaleString()}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(item)} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-all active:scale-90 shadow-lg"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 ELITE EDIT MODAL (UPDATED) */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            
            <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setEditingProduct(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={24}/></button>

              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Modify <span className="text-orange-600">Product</span></h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Product ID: {editingProduct.id.toUpperCase()}</p>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  {/* --- Left Side: Gallery Management --- */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><UploadCloud size={14}/> Product Gallery (Primary First)</p>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Existing Images with Static Delete Button (Mobile Friendly) */}
                      {existingImages.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm">
                          <img src={url} className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => removeExistingImg(url)} 
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-xl active:scale-90 transition-all z-10"
                          >
                            <X size={14}/>
                          </button>
                        </div>
                      ))}
                      {/* Upload New Slots */}
                      <label className="aspect-square rounded-[1.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-orange-600 transition-all text-slate-300">
                        <Plus size={32}/>
                        <span className="text-[9px] font-black uppercase mt-1">Add Visual</span>
                        <input type="file" multiple hidden onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setNewImages([...newImages, ...files]);
                        }} />
                      </label>
                      {/* New Image Previews */}
                      {newImages.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-orange-600/20 shadow-sm">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setNewImages(newImages.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-orange-600 text-white p-2 rounded-full shadow-xl active:scale-90"><X size={14}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* --- Right Side: Inputs with LABELS --- */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Product Name</label>
                       <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Price (₹)</label>
                        <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Stock Quantity</label>
                        <input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Gear Category</label>
                       <select value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20">
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Product Description</label>
                       <textarea rows="5" value={editingProduct.description || ""} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20 resize-none" placeholder="Describe the product details here..."></textarea>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2 italic">Placement Section</label>
                       <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl">
                          {['regular', 'featured'].map(s => (
                            <button key={s} type="button" onClick={() => setEditingProduct({...editingProduct, section: s})} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase transition-all ${editingProduct.section === s ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>
                              {s}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>

                <button disabled={updateLoading} className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-4 disabled:opacity-70 shadow-2xl active:scale-95">
                  {updateLoading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={18}/> Deploy Global Update</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterBtn = ({ label, active, onClick, isSpecial }) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border ${active ? isSpecial ? 'bg-orange-600 text-white border-orange-500 shadow-lg' : 'bg-slate-900 text-white border-slate-800 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
    {label}
  </button>
);

export default Inventory;