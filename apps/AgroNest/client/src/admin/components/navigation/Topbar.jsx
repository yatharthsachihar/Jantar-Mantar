import { FiBell, FiSearch, FiMoon, FiSun, FiLogOut, FiExternalLink } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const initials = admin?.name
    ? admin.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "Y";
  const displayName = admin?.name || "Yatharth";
  const displayRole = admin?.role || "Super Admin";

  return (
    <header className="admin-topbar">

      <div className="topbar-search">
        <FiSearch />
        <input type="text" placeholder="Search products, orders, customers…" />
      </div>

      <div className="topbar-right">

        {/* View live site */}
        <Link
          to="/"
          target="_blank"
          className="topbar-site-btn"
          title="View live site"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6, fontSize: 12, fontWeight: 600,
            padding: "0 14px", height: 48, minWidth: 0,
            color: "var(--primary)", border: "1px solid var(--border)",
            borderRadius: 14, textDecoration: "none",
            background: "var(--card)", transition: ".2s",
          }}
        >
          <FiExternalLink size={15} />
          <span className="topbar-site-label">Live Site</span>
        </Link>

        {/* Theme toggle */}
        <button className="topbar-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Notifications */}
        <button className="topbar-btn" title="Notifications" style={{ position: "relative" }}>
          <FiBell size={18} />
          <span style={{
            position: "absolute", top: 10, right: 10,
            width: 8, height: 8, background: "#ef4444",
            borderRadius: "50%", border: "2px solid var(--bg-secondary)",
          }} />
        </button>

        {/* User info */}
        <div className="topbar-user">
          <div className="avatar">{initials}</div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{displayName}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{displayRole}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          className="topbar-btn"
          onClick={handleLogout}
          title="Logout"
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <FiLogOut size={18} />
        </button>

      </div>
    </header>
  );
}
