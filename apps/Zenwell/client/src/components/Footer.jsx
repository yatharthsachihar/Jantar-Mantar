import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const hiddenRoutes = ["/login", "/signup"];

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="zen-footer">
      <div className="footer-glow"></div>

      <div className="footer-container">

        <div className="footer-top">
          <h2>ZenWell</h2>

          <p>
            Find balance. Live well.
            Thoughtfully crafted wellness products designed
            to bring calm, mindfulness, and intention into
            your daily life.
          </p>

          <div className="footer-newsletter">
            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              Join Community
            </button>
          </div>
        </div>

        <div className="footer-links">

          <div>
            <h4>Explore</h4>

            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/about">About</Link>
            <Link to="/enquiry">Contact</Link>
          </div>

          <div>
            <h4>Support</h4>

            <a href="#">FAQs</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Privacy Policy</a>
          </div>

          <div>
            <h4>Connect</h4>

            <a href="#">Instagram</a>
            <a href="#">Pinterest</a>
            <a href="#">YouTube</a>
            <a href="#">Facebook</a>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © 2026 ZenWell • Crafted for mindful living.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;