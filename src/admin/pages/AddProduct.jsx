import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { 
  UploadCloud, X, Loader2, Tag, LayoutGrid, Star, Plus, Package 
} from "lucide-react";

const AddProduct = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "", 
    price: "", 
    description: "",
    section: "regular",
    stock: "" 
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const [images, setImages] = useState([]); 
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = "dug2dfufw"; 
  const UPLOAD_PRESET = "gs-brand";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, "categories"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const cats = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setCategories(cats);
    } catch (err) { console.error("Error fetching cats:", err); }
  };

  const deleteCategory = async (catId) => {
    if(window.confirm("Bhai, Category delete karne se products delete nahi honge. Continue?")) {
      try {
        await deleteDoc(doc(db, "categories", catId));
        fetchCategories();
      } catch (err) { alert("Error deleting category!"); }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" && value === "ADD_NEW") {
      setIsAddingNew(true);
      setFormData({ ...formData, category: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = isAddingNew ? newCategory.trim() : formData.category;
    
    if (images.length === 0) return alert("Bhai, kam se kam ek photo to dalo!");
    if (!finalCategory) return alert("Bhai, category zaruri hai!");

    setUploading(true);

    try {
      // 🚀 PARALLEL UPLOAD LOGIC: Saari photos ek saath upload hongi
      const uploadPromises = images.map(async (imgFile) => {
        const data = new FormData();
        data.append("file", imgFile);
        data.append("upload_preset", UPLOAD_PRESET);
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data,
        });

        if (!res.ok) throw new Error("Cloudinary upload failed");
        
        const fileData = await res.json();
        return fileData.secure_url;
      });

      // Wait for all uploads to finish simultaneously
      const imageUrls = await Promise.all(uploadPromises);

      if (isAddingNew && !categories.find(c => c.name === finalCategory)) {
        await addDoc(collection(db, "categories"), { name: finalCategory });
      }

      // Final Product Deployment to Firestore
      await addDoc(collection(db, "products"), {
        name: formData.name,
        category: finalCategory,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
        description: formData.description,
        section: formData.section, 
        imageUrls: imageUrls, 
        imageUrl: imageUrls[0], // First image as thumbnail
        createdAt: serverTimestamp(),
      });

      alert(`Success! Deployed to ${formData.section.toUpperCase()} section. 🚀`);
      
      // Reset everything
      setFormData({ name: "", category: "", price: "", description: "", section: "regular", stock: "" });
      setPreviews([]); 
      setImages([]); 
      setIsAddingNew(false); 
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error: Upload process slow hai ya fail ho gaya. Net check karein!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic">Inventory <span className="text-orange-600">Sync</span></h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">GS-Brand Management System</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          
          <div className="flex gap-4 p-2 bg-slate-50 rounded-3xl">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, section: 'regular'})}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.section === 'regular' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
            >
              <LayoutGrid size={16}/> Regular Shop
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, section: 'featured'})}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.section === 'featured' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
              <Star size={16}/> Featured Gear
            </button>
          </div>

          <div className="space-y-6">
            <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="PRODUCT NAME" required className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="PRICE (₹)" required className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20" />
              <input name="stock" value={formData.stock} onChange={handleChange} type="number" placeholder="STOCK QTY" required className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20" />

              <div className="relative">
                {!isAddingNew ? (
                  <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20 appearance-none">
                    <option value="">SELECT CATEGORY</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name.toUpperCase()}</option>)}
                    <option value="ADD_NEW" className="text-orange-600 font-black">+ ADD NEW</option>
                  </select>
                ) : (
                  <div className="relative">
                    <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} type="text" placeholder="NEW NAME" required className="w-full bg-orange-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-orange-600/20" />
                    <button type="button" onClick={() => setIsAddingNew(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 font-black text-[10px]">X</button>
                  </div>
                )}
              </div>
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="PRODUCT DETAILS" rows="4" className="w-full bg-slate-50 p-5 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-600/20"></textarea>
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-slate-950 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-orange-600 transition-all flex items-center justify-center gap-4 disabled:opacity-70">
            {uploading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>Deploying Gear...</span>
              </div>
            ) : "Deploy to Storefront"}
          </button>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Multi-Image Preview Section */}
          <div className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm min-h-[350px]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Product Visuals</p>
             <div className="grid grid-cols-2 gap-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-orange-600 transition-all">
                  <Plus size={24} className="text-slate-300" />
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Add Pic</span>
                  <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" multiple />
                </label>
             </div>
          </div>

          {/* Active Categories List */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
             <div className="flex items-center gap-3 mb-4">
               <Tag className="text-orange-600" size={18} />
               <p className="text-[10px] font-black uppercase tracking-widest">Active Categories</p>
             </div>
             <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 group">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{cat.name}</span>
                    <button 
                      type="button" 
                      onClick={() => deleteCategory(cat.id)} 
                      className="text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <X size={14}/>
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;