import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/Cartcontent";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Enquiry from "./pages/Enquiry";
import Admin from "./pages/Admin";
import CustomerLogin from "./pages/Customer-login";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About"
import Cart from "./pages/Cart";
import "./styles/global.css";
import { Link } from "react-router-dom";

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("zenwell-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return "dark";
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    try { localStorage.setItem("zenwell-theme", theme); } catch {}
  }, [theme]);

  function toggleTheme() {
    setTheme(current => current === "light" ? "dark" : "light");
  }

  return (
    <CartProvider>
      <div className="app">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;