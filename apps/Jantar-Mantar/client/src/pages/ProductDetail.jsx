import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productApi } from '../api';
import { mediaUrl } from '../api/axios';
import { inr, discountPct } from '../utils/format';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.get(slug),
  });

  const [imgIdx, setImgIdx] = useState(0);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => product && s.items.some((i) => i._id === product._id));

  if (isLoading) return <div className="container section empty">Loading…</div>;
  if (isError || !product) return <div className="container section empty"><h3>Product not found</h3><Link to="/shop" className="btn btn-outline">Back to Shop</Link></div>;

  const selected = product.hasVariations
    ? (variant || product.variations[0])
    : null;
  const price = selected ? selected.price : product.price;
  const mrp = selected ? (selected.compareAtPrice || 0) : product.compareAtPrice;
  const off = discountPct(price, mrp, product.discount);
  const stock = selected ? selected.stock : product.stock;

  const onAdd = () => {
    if (product.hasVariations && !variant) {
      // default to first variant if user didn't pick
      setVariant(product.variations[0]);
    }
    addItem(product, {
      weight: selected?.weight || '',
      price,
      quantity: qty,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="container section">
      <div className="pd-grid">
        <div className="pd-gallery">
          <div className="pd-main">
            <img src={mediaUrl(product.images?.[imgIdx]) || 'https://placehold.co/600x600?text=No+Image'} alt={product.name} />
          </div>
          {product.images?.length > 1 && (
            <div className="pd-thumbs">
              {product.images.map((im, i) => (
                <button key={i} className={`pd-thumb ${i === imgIdx ? 'on' : ''}`} onClick={() => setImgIdx(i)}>
                  <img src={mediaUrl(im)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          {product.category?.name && <span className="card-cat">{product.category.name}</span>}
          <h1>{product.name}</h1>
          {product.rating > 0 && (
            <div className="card-rating" style={{ fontSize: 14 }}>★ {product.rating.toFixed(1)} <span>({product.reviewsCount} reviews)</span></div>
          )}
          <div className="pd-price">
            <span className="now">{inr(price)}</span>
            {mrp > price && <span className="was">{inr(mrp)}</span>}
            {off > 0 && <span className="off">{off}% OFF</span>}
          </div>
          {product.shortDescription && <p className="muted">{product.shortDescription}</p>}

          {product.badges?.length > 0 && (
            <div className="row" style={{ flexWrap: 'wrap' }}>
              {product.badges.map((b) => <span key={b} className="tag green">{b}</span>)}
            </div>
          )}

          {product.hasVariations && (
            <div className="field">
              <label>Weight</label>
              <div className="row" style={{ flexWrap: 'wrap' }}>
                {product.variations.map((v) => (
                  <button key={v.weight} className={`pill ${selected?.weight === v.weight ? 'active' : ''}`} onClick={() => setVariant(v)}>
                    {v.weight} · {inr(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-qty-row">
            <div className="pd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}><FiMinus /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}><FiPlus /></button>
            </div>
            <span className={`tag ${stock > 0 ? 'green' : 'grey'}`}>{stock > 0 ? `In stock` : 'Out of stock'}</span>
          </div>

          <div className="row">
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onAdd} disabled={stock <= 0}>Add to Cart</button>
            <button className={`btn btn-outline ${wished ? 'on' : ''}`} onClick={() => toggleWish(product)} aria-label="Wishlist">
              <FiHeart fill={wished ? 'currentColor' : 'none'} color={wished ? 'var(--red)' : undefined} />
            </button>
          </div>

          {product.description && (
            <div className="pd-desc">
              <h3>Description</h3>
              <p className="muted">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
