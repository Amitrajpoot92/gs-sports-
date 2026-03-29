import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // 🔄 रियल-टाइम डेटाबेस सिंक (Firestore से कार्ट लाना)
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const cartRef = doc(db, "carts", user.uid);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setCartItems(docSnap.data().items || []);
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 🚀 हेल्पर: डेटाबेस में कार्ट अपडेट करना
  const updateDBCart = async (newItems) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "carts", user.uid), { 
        items: newItems,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Cart Sync Error:", err);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      alert("Bhai, pehle login to kar lo! 🏏");
      return;
    }
    
    const existingItem = cartItems.find((item) => item.id === product.id);
    let updatedItems;

    if (existingItem) {
      updatedItems = cartItems.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedItems = [...cartItems, { ...product, qty: 1 }];
    }
    
    await updateDBCart(updatedItems);
    alert("Added to bag! 🎒");
  };

  const removeFromCart = async (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    await updateDBCart(updatedItems);
  };

  const updateQty = async (id, type) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = type === "plus" ? item.qty + 1 : Math.max(1, item.qty - 1);
        return { ...item, qty: newQty };
      }
      return item;
    });
    await updateDBCart(updatedItems);
  };

  const clearCart = async () => {
    await updateDBCart([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);