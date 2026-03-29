import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative bg-[#121212] border border-white/5 overflow-hidden transition-all duration-500 hover:border-orange-600/50 shadow-xl">
      
      {/* Discount/Status Badge */}
      {product.discount && (
        <div className="absolute top-4 left-4 z-20 bg-orange-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
          {product.discount}
        </div>
      )}

      {/* Product Image & Quick Actions */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        
        {/* Floating Quick Action Sidebar */}
        <div className="absolute -right-12 group-hover:right-4 top-4 flex flex-col gap-2 transition-all duration-500">
          <button className="p-3 bg-white text-black hover:bg-orange-600 hover:text-white transition-colors shadow-xl">
            <Heart size={16} />
          </button>
          <button className="p-3 bg-white text-black hover:bg-orange-600 hover:text-white transition-colors shadow-xl">
            <Eye size={16} />
          </button>
        </div>

        {/* Add to Cart Overlay (Bottom) */}
        <button className="absolute bottom-0 left-0 w-full bg-orange-600 text-white py-4 font-black text-[10px] uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5 space-y-2">
        <p className="text-orange-500 text-[9px] font-bold uppercase tracking-widest">{product.category}</p>
        <h3 className="text-white font-black text-lg uppercase tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-2">
          <span className="text-white text-xl font-black italic">
            ₹{product.price.toLocaleString()}
          </span>
          <div className="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-orange-600 transition-all" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;