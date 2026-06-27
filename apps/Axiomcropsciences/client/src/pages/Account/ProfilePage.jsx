import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUser, FiPackage, FiLogOut } from "react-icons/fi";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/navigation/Footer";
import { useUser } from "../../context/UserContext";
import API from "../../api/axios";
import "../../styles/site.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout, loading } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: user || {}
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      API.get("/orders/my-orders")
        .then(res => setOrders(res.data))
        .catch(err => console.error(err))
        .finally(() => setOrdersLoading(false));
    }
  }, [user]);

  if (loading || !user) return <div className="site-root" style={{ minHeight: "100vh" }} />;

  const onUpdateProfile = async (data) => {
    try {
      await API.put("/users/me", data);
      toast.success("Profile updated");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="site-root">
      <Navbar />
      <div className="site-container profile-page-container">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-user">
            <div className="profile-sidebar-avatar">
              {user.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="profile-sidebar-info">
              <div className="profile-sidebar-name">{user.fullName}</div>
              <div className="profile-sidebar-email">{user.email}</div>
            </div>
          </div>
          
          <div className="profile-sidebar-nav">
            <button className="profile-sidebar-btn active">
              <FiUser size={16} /> My Profile
            </button>
            <button onClick={() => navigate("/account/orders")} className="profile-sidebar-btn">
              <FiPackage size={16} /> My Orders
            </button>
            <button onClick={logout} className="profile-sidebar-btn logout">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="profile-main">
          
          <section className="profile-section">
            <h2 className="profile-section-title">Edit Profile</h2>
            <form onSubmit={handleSubmit(onUpdateProfile)} className="profile-form">
              <div className="profile-form-row">
                <div className="profile-form-field">
                  <label className="profile-form-label">Full Name</label>
                  <input {...register("fullName")} className="profile-form-input" />
                </div>
                <div className="profile-form-field">
                  <label className="profile-form-label">Mobile</label>
                  <input {...register("mobile")} className="profile-form-input" />
                </div>
              </div>
              <div className="profile-form-field profile-form-field-full">
                <label className="profile-form-label">Email Address</label>
                <input {...register("email")} disabled className="profile-form-input disabled" />
              </div>
              <button type="submit" disabled={isSubmitting} className="site-btn-primary profile-save-btn">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section className="profile-section">
            <h2 className="profile-section-title">Order History</h2>
            {ordersLoading ? (
              <p>Loading orders...</p>
            ) : orders.length > 0 ? (
              <div className="profile-orders-list">
                {orders.map(order => (
                  <div key={order._id} className="profile-order-card">
                    <div className="profile-order-info">
                      <div className="profile-order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div className="profile-order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="profile-order-status">
                      <span className={`profile-order-badge ${order.status?.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <div className="profile-order-amount">₹{order.totalAmount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-orders-empty">
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate("/products")} className="site-btn-secondary">Start Shopping</button>
              </div>
            )}
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
