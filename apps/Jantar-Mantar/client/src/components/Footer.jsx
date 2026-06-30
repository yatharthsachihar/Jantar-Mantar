import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';
import { useSettings } from '../hooks/useSettings';

export default function Footer() {
  const { data: settings } = useSettings();
  const s = settings || {};
  const social = s.socialLinks || {};

  return (
    <footer className="sh-footer">
      <div className="container sh-footer-grid">
        <div>
          <h3>{s.storeName || 'Jantar-Mantar'}</h3>
          <p className="muted">{s.footerAbout || 'Pure, authentic spices and dry fruits sourced directly from farms.'}</p>
          <div className="sh-social">
            {social.instagram && <a href={social.instagram} aria-label="Instagram"><FiInstagram /></a>}
            {social.facebook && <a href={social.facebook} aria-label="Facebook"><FiFacebook /></a>}
            {social.youtube && <a href={social.youtube} aria-label="YouTube"><FiYoutube /></a>}
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/shop?sort=createdAt">New Arrivals</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/track-order">Track Order</Link>
        </div>
        <div>
          <h4>Contact</h4>
          {s.storePhone && <p className="muted">{s.storePhone}</p>}
          {s.storeEmail && <p className="muted">{s.storeEmail}</p>}
          {s.storeAddress && <p className="muted">{s.storeAddress}</p>}
        </div>
      </div>
      <div className="sh-footer-bottom container">
        {s.footerText || '© Jantar-Mantar. All rights reserved.'}
      </div>
    </footer>
  );
}
