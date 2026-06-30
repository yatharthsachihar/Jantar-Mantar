import { Link, useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { mediaUrl } from '../api/axios';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { inr, discountPct, startingPrice } from '../utils/format';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.items.some((i) => i._id === product._id));

  const start = startingPrice(product);
  const off = discountPct(start, product.compareAtPrice, product.discount);
  const catName = product.category?.name;

  const onAdd = (e) => {
    e.preventDefault();
    if (product.hasVariations) {
      navigate(`/product/${product.slug}`);
      return;
    }
    addItem(product, { quantity: 1 });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product.slug}`} className="card">
      <div className="card-img">
        {off > 0 && <span className="card-badge">{off}% OFF</span>}
        <button
          className={`card-wish ${wished ? 'on' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWish(product); }}
          aria-label="Toggle wishlist"
        >
          <FiHeart fill={wished ? 'currentColor' : 'none'} />
        </button>
        <img src={mediaUrl(product.images?.[0]) || 'https://placehold.co/600x600?text=No+Image'} alt={product.name} loading="lazy" />
      </div>
      <div className="card-body">
        {catName && <span className="card-cat">{catName}</span>}
        <h3 className="card-title">{product.name}</h3>
        {product.rating > 0 && (
          <div className="card-rating">★ {product.rating.toFixed(1)} <span>({product.reviewsCount})</span></div>
        )}
        {product.hasVariations && product.variations?.length > 0 && (
          <div className="card-variants">
            {product.variations.slice(0, 3).map((v) => (
              <span key={v.weight} className="card-variant">{v.weight}</span>
            ))}
          </div>
        )}
        <div className="card-price">
          <span className="now">{inr(start)}</span>
          {product.compareAtPrice > start && <span className="was">{inr(product.compareAtPrice)}</span>}
          {off > 0 && <span className="off">{off}% off</span>}
        </div>
        <button className="btn btn-primary btn-block" onClick={onAdd}>
          {product.hasVariations ? 'Select Options' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
