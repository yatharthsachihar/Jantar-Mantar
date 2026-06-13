import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Sidebar from "../components/navigation/Sidebar";
import Topbar  from "../components/navigation/Topbar";

export default function AdminLayout() {
  const { loading, token, admin, init } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { init(); }, []); // eslint-disable-line

  useEffect(() => {
    // Once loading is done, if still no token → send to login
    if (!loading && !token) {
      navigate("/admin/login", { replace: true });
    }
  }, [loading, token, navigate]);

  if (loading) return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"center",
      height:"100vh", background:"var(--bg)",
      flexDirection:"column", gap:16,
    }}>
      <div style={{
        width:48, height:48, borderRadius:"50%",
        border:"3px solid var(--border)",
        borderTop:"3px solid var(--primary)",
        animation:"spin 0.8s linear infinite",
      }} />
      <span style={{ fontSize:15, color:"var(--text-muted)" }}>Loading AgroNest…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Don't render panel at all if no token (redirect already fired)
  if (!token) return null;

  return (
    <div className={`admin-layout role-${admin?.role || 'viewer'}`}>
      <Sidebar />
      <div className="admin-main">
        {admin?.role === 'viewer' && (
          <div className="viewer-banner" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "8px 20px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(239, 68, 68, 0.2)" }}>
            ⚠️ You are in View-Only mode. Changes cannot be saved.
          </div>
        )}
        <Topbar />
        <main style={{ overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
