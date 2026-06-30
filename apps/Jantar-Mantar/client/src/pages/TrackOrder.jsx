import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function TrackOrder() {
  const location = useLocation();
  const placedId = location.state?.orderId;
  const [orderId, setOrderId] = useState(placedId || '');

  return (
    <div className="container section" style={{ maxWidth: 620 }}>
      <h1>Track Your Order</h1>
      {placedId && (
        <div className="cart-summary" style={{ marginBottom: 18 }}>
          <h3>🎉 Order placed!</h3>
          <p className="muted">Your order reference is:</p>
          <strong style={{ wordBreak: 'break-all' }}>{placedId}</strong>
          <p className="muted" style={{ marginTop: 10 }}>You'll be contacted shortly to confirm delivery (Cash on Delivery).</p>
        </div>
      )}
      <div className="field">
        <label>Order ID</label>
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter your order reference" />
      </div>
      <p className="muted">Order tracking status will be available here. For now, please keep your order reference for support enquiries.</p>
    </div>
  );
}
