import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/Cartcontent';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Your Cart is Empty</h1>
        <p style={{ color: 'var(--text-light)', margin: '1rem 0' }}>Add some wellness products to get started</p>
        <Link to="/products" className="btn" style={{ display: 'inline-block', maxWidth: '200px' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Cart Items */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, parseInt(e.target.value))}
                      style={{ width: '60px', padding: '0.5rem' }}
                    />
                  </td>
                  <td>₹{item.price * item.qty}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '8px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>₹{total}</span>
          </div>
          <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
          <button className="btn" style={{ marginBottom: '1rem' }}>Proceed to Checkout</button>
          <button
            onClick={clearCart}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.7rem', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}