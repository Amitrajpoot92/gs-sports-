import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; 
import { Loader2 } from "lucide-react";

// --- User Components & Pages ---
import Navbar from "./components/common/Navbar"; 
import Footer from "./components/common/Footer"; 
import Home from "./pages/home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout"; 
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/about"; 

// --- Admin Components & Pages ---
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import AddProduct from "./admin/pages/AddProduct";
import AllProducts from "./admin/pages/AllProducts";
import Orders from "./admin/pages/Orders";
import AdminLogin from "./admin/pages/Login";

// 🚀 New Admin Pages Imports
import Revenue from "./admin/pages/revenue";
import Customers from "./admin/pages/customers";

// 🛡️ ENHANCED PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Identity...</p>
      </div>
    );
  }

  // अगर लॉगिन नहीं है, तो सीधे एडमिन लॉगिन पेज पर भेजें
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // अगर लॉगिन है पर रोल 'admin' नहीं है
  if (user.role !== "admin") {
    alert("🚫 Access Denied: Admin Access Only!");
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            
            {/* 🔑 1. ADMIN LOGIN */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 🛡️ 2. PROTECTED ADMIN PANEL */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute> 
                  <AdminLayout /> 
                </ProtectedRoute>
              }
            >
              {/* ये सब AdminLayout के <Outlet /> में रेंडर होंगे */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="all-products" element={<AllProducts />} />
              <Route path="orders" element={<Orders />} />
              
              {/* 🚀 NEW PROTECTED ROUTES ADDED HERE */}
              <Route path="revanue" element={<Revenue />} />
              <Route path="customer" element={<Customers />} />
            </Route>

            {/* 🌐 3. PUBLIC WEBSITE ROUTES */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-white flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/about" element={<About />} /> 
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;