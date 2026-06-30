import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiImage, FiLayout, FiDroplet, FiFolder, FiShoppingBag, FiUsers, FiShield, FiLogOut, FiMenu } from 'react-icons/fi';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/admin/products', label: 'Products', icon: <FiBox /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiTag /> },
  { to: '/admin/banners', label: 'Banners', icon: <FiImage /> },
  { to: '/admin/homepage-builder', label: 'Homepage Builder', icon: <FiLayout /> },
  { to: '/admin/theme', label: 'Theme Builder', icon: <FiDroplet /> },
  { to: '/admin/media', label: 'Media', icon: <FiFolder /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  { to: '/admin/roles', label: 'Roles', icon: <FiShield /> },
];

export default function AdminLayout() {
  const { token, admin, setAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token && !admin) {
      authApi.me().then(setAdmin).catch(() => logout());
    }
  }, [token, admin, setAdmin, logout]);

  if (!token) return <Navigate to="/admin/login" replace />;

  const onLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="adm">
      <aside className={`adm-side ${open ? 'open' : ''}`}>
        <div className="adm-brand">Jantar-Mantar</div>
        <nav className="adm-nav" onClick={() => setOpen(false)}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.icon} {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="adm-side-foot">
          <div style={{ fontSize: 13, marginBottom: 8 }}>{admin?.name} <span className="tag grey">{admin?.role}</span></div>
          <button className="btn btn-outline btn-block" onClick={onLogout}><FiLogOut /> Logout</button>
        </div>
      </aside>
      <div className="adm-main">
        <div className="adm-top">
          <button className="btn btn-outline" style={{ display: 'none' }} onClick={() => setOpen((v) => !v)}><FiMenu /></button>
          <h1>Admin</h1>
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline">View Store ↗</a>
        </div>
        <div className="adm-body"><Outlet /></div>
      </div>
    </div>
  );
}
