import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { mediaUrl } from '../api/axios';
import { inr } from '../utils/format';

export default function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  if (!items.length) {
    return (
      <div className="container section empty">
        <h3>Your wishlist is empty</h3>
        <p>Tap the heart on any product to save it here.</p>
        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Wishlist</h1>
      <div className="product-grid">
        {items.map((p) => (
          <div key={p._id} className="card">
            <Link to={`/product/${p.slug}`} className="card-img">
              <img src={mediaUrl(p.image) || 'https://placehold.co/300x300?text=•'} alt={p.name} />
            </Link>
            <div className="card-body">
              <Link to={`/product/${p.slug}`} className="card-title">{p.name}</Link>
              <div className="card-price"><span className="now">{inr(p.price)}</span></div>
              <div className="row">
                <button className="btn btn-primary" style={{ flex: 1 }}
                  onClick={() => { addItem({ _id: p._id, name: p.name, slug: p.slug, images: [p.image], price: p.price }, {}); toast.success('Added to cart'); }}>
                  Add to Cart
                </button>
                <button className="btn btn-outline" onClick={() => remove(p._id)} aria-label="Remove"><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
