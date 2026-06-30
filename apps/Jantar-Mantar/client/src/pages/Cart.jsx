import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCartStore, selectTotal } from '../store/cartStore';
import { mediaUrl } from '../api/axios';
import { inr } from '../utils/format';

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore(selectTotal);

  if (!items.length) {
    return (
      <div className="container section empty">
        <h3>Your cart is empty</h3>
        <p>Add some delicious spices and dry fruits to get started.</p>
        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Your Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {items.map((i) => (
            <div key={i.key} className="cart-item">
              <img src={mediaUrl(i.image) || 'https://placehold.co/120x120?text=•'} alt={i.name} />
              <div className="cart-item-info">
                <Link to={`/product/${i.slug}`} className="cart-item-name">{i.name}</Link>
                {i.variationWeight && <span className="muted">{i.variationWeight}</span>}
                <span className="now">{inr(i.price)}</span>
              </div>
              <div className="pd-qty">
                <button onClick={() => setQuantity(i.key, i.quantity - 1)}><FiMinus /></button>
                <span>{i.quantity}</span>
                <button onClick={() => setQuantity(i.key, i.quantity + 1)}><FiPlus /></button>
              </div>
              <strong>{inr(i.price * i.quantity)}</strong>
              <button className="cart-del" onClick={() => removeItem(i.key)} aria-label="Remove"><FiTrash2 /></button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="spread"><span className="muted">Subtotal</span><strong>{inr(total)}</strong></div>
          <div className="spread"><span className="muted">Shipping</span><span>{total >= 499 ? 'Free' : inr(49)}</span></div>
          <hr />
          <div className="spread"><strong>Total</strong><strong className="now">{inr(total >= 499 ? total : total + 49)}</strong></div>
          <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 14 }}>Proceed to Checkout</Link>
        </aside>
      </div>
    </div>
  );
}
