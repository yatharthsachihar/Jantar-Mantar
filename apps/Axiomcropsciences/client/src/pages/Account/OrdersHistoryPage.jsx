import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiHeart, FiUser, FiLogOut, FiPackage, FiShoppingBag, FiTruck, FiMapPin, FiCalendar, FiClock } from "react-icons/fi";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/navigation/Footer";
import { useUser } from "../../context/UserContext";
import { orderApi } from "../../api/orderApi";
import { mediaUrl } from "../../api/axios";
import "../../styles/site.css";
import "./OrdersHistoryPage.css";

export default function OrdersHistoryPage() {
  const { user, logout, loading } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const fetchOrders = () => {
    if (user) {
      setOrdersLoading(true);
      orderApi.getMyOrders()
        .then(res => setOrders(res.data))
        .catch(err => console.error(err))
        .finally(() => setOrdersLoading(false));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading || !user) return <div className="site-root" style={{ minHeight: "100vh" }} />;

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const confirmCancelOrder = (orderId) => {
    setShowCancelConfirm(orderId);
  };

  const executeCancelOrder = async () => {
    const orderId = showCancelConfirm;
    setShowCancelConfirm(null);
    setCancellingId(orderId);
    try {
      await orderApi.cancel(orderId);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return "pending";
    if (s === "cancelled") return "cancelled";
    return "confirmed";
  };

  return (
    <div className="site-root">
      <Navbar />
      <div className="site-container orders-page-container">
        
        {/* Sidebar */}
        <aside className="orders-sidebar">
          <div className="orders-sidebar-user">
            <div className="orders-sidebar-avatar">
              {user.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="orders-sidebar-info">
              <div className="orders-sidebar-name">{user.fullName}</div>
              <div className="orders-sidebar-email">{user.email}</div>
            </div>
          </div>
          
          <div className="orders-sidebar-nav">
            <Link to="/account" style={{ textDecoration: "none" }}>
              <button className="orders-sidebar-btn">
                <FiUser size={16} /> My Profile
              </button>
            </Link>
            <button className="orders-sidebar-btn active">
              <FiPackage size={16} /> My Orders
            </button>
            <button onClick={logout} className="orders-sidebar-btn logout">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="orders-main">
          
          <section className="orders-section">
            <h2 className="orders-section-title">My Order History</h2>
            
            {ordersLoading ? (
              <div className="orders-loading">
                <div className="checkout-spinner" />
                <p>Loading your order records...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map(order => {
                  const isExpanded = expandedOrder === order._id;
                  const dateFormatted = new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric"
                  });
                  return (
                    <div key={order._id} className={`orders-card ${isExpanded ? "expanded" : ""}`}>
                      
                      {/* Order Summary Header Card (clickable) */}
                      <div className="orders-card-header" onClick={() => toggleExpand(order._id)}>
                        <div className="orders-card-header-left">
                          <div className="orders-card-meta">
                            <div className="orders-card-id">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </div>
                            <div className="orders-card-date">
                              <FiCalendar size={13} /> {dateFormatted}
                            </div>
                          </div>

                          <div className="orders-card-status">
                            <span className={`orders-status-badge ${getStatusClass(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="orders-card-header-right">
                          <div className="orders-card-total">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </div>
                          {isExpanded ? <FiChevronUp size={20} color="var(--site-text-muted)" /> : <FiChevronDown size={20} color="var(--site-text-muted)" />}
                        </div>
                      </div>

                      {/* Expanded Order Detail View */}
                      {isExpanded && (
                        <div className="orders-card-detail">
                          {/* 1. Itemised product breakdown */}
                          <div className="orders-items-section">
                            <h4 className="orders-detail-heading">
                              <FiShoppingBag size={14} /> Ordered Items
                            </h4>
                            <div className="orders-items-list">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="orders-item-row">
                                  <div className="orders-item-left">
                                    {item.image && (
                                      <img src={mediaUrl(item.image)} alt={item.name} className="orders-item-img" />
                                    )}
                                    <div className="orders-item-info">
                                      <div className="orders-item-name">{item.name}</div>
                                      <div className="orders-item-qty">
                                        ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="orders-item-total">
                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. Order Metadata & Shipping Grid */}
                          <div className="orders-detail-grid">
                            
                            {/* Shipping Details */}
                            <div className="orders-detail-block">
                              <h4 className="orders-detail-heading">
                                <FiMapPin size={14} /> Shipping Destination
                              </h4>
                              <div className="orders-shipping-info">
                                <div className="orders-shipping-name">{order.customerName}</div>
                                <div>{order.address}</div>
                                <div>{order.city}, {order.state} - {order.pincode}</div>
                                <div className="orders-shipping-phone">📞 {order.customerPhone}</div>
                              </div>
                            </div>

                            {/* Summary Totals */}
                            <div className="orders-detail-block">
                              <h4 className="orders-detail-heading">
                                <FiTruck size={14} /> Billing Breakdown
                              </h4>
                              <div className="orders-billing-rows">
                                <div className="orders-billing-row">
                                  <span>Payment Method</span>
                                  <strong>{order.paymentMethod}</strong>
                                </div>
                                <div className="orders-billing-row">
                                  <span>Payment Status</span>
                                  <span className={`orders-payment-status ${order.paymentStatus?.toLowerCase() === "paid" ? "paid" : "unpaid"}`}>
                                    {order.paymentStatus}
                                  </span>
                                </div>
                                <div className="orders-billing-row total">
                                  <span>Total Charged</span>
                                  <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* 3. Action Buttons Section */}
                          {order.status?.toLowerCase() === "pending" && (
                            <div className="orders-actions">
                              <button 
                                disabled={cancellingId === order._id}
                                onClick={() => confirmCancelOrder(order._id)}
                                className="orders-cancel-btn"
                              >
                                {cancellingId === order._id ? (
                                  <>
                                    <span className="checkout-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <FiClock size={14} /> Cancel Order
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="orders-empty">
                <FiShoppingBag size={48} className="orders-empty-icon" />
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate("/products")} className="site-btn-primary">Start Shopping</button>
              </div>
            )}
          </section>

        </div>
      </div>

      {/* Premium Cancel Order Modal */}
      {showCancelConfirm && (
        <div className="orders-modal-overlay">
          <div className="orders-modal">
            <div className="orders-modal-body">
              <div className="orders-modal-icon">
                <FiClock />
              </div>
              <h2 className="orders-modal-title">Cancel Order?</h2>
              <p className="orders-modal-text">
                Are you sure you want to cancel this pending order? This action cannot be undone.
              </p>
            </div>
            <div className="orders-modal-footer">
              <button 
                onClick={() => setShowCancelConfirm(null)}
                className="orders-modal-btn-secondary"
              >
                Go Back
              </button>
              <button 
                onClick={executeCancelOrder}
                className="orders-modal-btn-primary"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
