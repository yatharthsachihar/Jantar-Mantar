import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useSettings } from '../hooks/useSettings';
import { useCartStore, selectCount } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { mediaUrl } from '../api/axios';

export default function Header() {
  const { data: settings } = useSettings();
  const cartCount = useCartStore(selectCount);
  const wishCount = useWishlistStore((s) => s.items.length);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const nav = settings?.navItems?.length ? settings.navItems : [
    { label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' },
    { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' },
  ];

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <header className="sh-header">
      {settings?.announcementActive && settings?.announcementBar && (
        <div className="sh-announce">{settings.announcementBar}</div>
      )}
      <div className="container sh-bar">
        <button className="sh-burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <FiX /> : <FiMenu />}
        </button>

        <Link to="/" className="sh-logo">
          {settings?.storeLogo
            ? <img src={mediaUrl(settings.storeLogo)} alt={settings.storeName} />
            : <span>{settings?.storeName || 'Jantar-Mantar'}</span>}
        </Link>

        <form className="sh-search" onSubmit={submitSearch}>
          <FiSearch />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search spices, dry fruits…" />
        </form>

        <div className="sh-actions">
          <Link to="/wishlist" className="sh-icon" aria-label="Wishlist">
            <FiHeart />{wishCount > 0 && <i>{wishCount}</i>}
          </Link>
          <Link to="/cart" className="sh-icon" aria-label="Cart">
            <FiShoppingCart />{cartCount > 0 && <i>{cartCount}</i>}
          </Link>
        </div>
      </div>

      <nav className={`sh-nav ${open ? 'open' : ''}`}>
        <div className="container sh-nav-inner">
          {nav.map((n) => (
            <NavLink key={n.to + n.label} to={n.to} onClick={() => setOpen(false)}
              className={({ isActive }) => `sh-link ${isActive ? 'active' : ''}`} end={n.to === '/'}>
              {n.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
