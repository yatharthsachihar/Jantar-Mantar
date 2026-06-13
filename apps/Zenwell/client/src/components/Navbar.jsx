import { NavLink, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/Cartcontent";

function Navbar({ theme, onToggleTheme }) {
  const { cart } = useContext(CartContext);
  const location = useLocation();

  // Hide navbar on Login and Signup pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup"
  ) {
    return null;
  }

  return (
    <>
      <div className="announcement-bar">
        <span>
          🌿 Spring Wellness Sale —
          <strong> Get up to 25% off</strong> on selected products
          &nbsp;|&nbsp;
          <strong> Free shipping</strong> on orders over ₹999
        </span>

        <Link to="/products" className="announcement-btn">
          Shop Now →
        </Link>
      </div>

      <header className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 60 60" width="44" height="44">
              <defs>
                <linearGradient
                  id="leafG"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#5a9e8a" />
                  <stop offset="100%" stopColor="#2d6a4f" />
                </linearGradient>
              </defs>

              <circle
                cx="30"
                cy="30"
                r="28"
                fill="var(--brand-circle)"
              />

              <path
                d="M30 12 Q42 18 42 30 Q42 42 30 48 Q18 42 18 30 Q18 18 30 12Z"
                fill="url(#leafG)"
              />

              <path
                d="M30 12 Q30 30 30 48"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
              />

              <path
                d="M18 30 Q24 24 30 30"
                stroke="white"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />

              <path
                d="M42 30 Q36 24 30 30"
                stroke="white"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </div>

          <div className="brand-text">
            <span className="brand-name">ZenWell</span>
            <span className="brand-tagline">
              Natural wellness products
            </span>
          </div>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>

          <NavLink to="/enquiry">
            Enquiry
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  e.target.value.trim()
                ) {
                  window.location.href =
                    `/products?search=${encodeURIComponent(
                      e.target.value
                    )}`;
                }
              }}
            />
            <span className="search-icon">🔍</span>
          </div>

          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <Link to="/cart" className="cart-btn">
            <span className="cart-emoji">🛒</span>

            {cart.length > 0 && (
              <span className="cart-count">
                {cart.length}
              </span>
            )}
          </Link>

          <Link
            to="/login"
            className="login-link"
          >
            Login
          </Link>
        </div>
      </header>
    </>
  );
}

export default Navbar;