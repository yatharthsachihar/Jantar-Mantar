import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Our Products</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Explore our wellness collection</p>
      <div className="grid grid-3">
        {products.map((p, idx) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -8 }}
          >
            <Link to={`/product/${p._id}`} style={{ textDecoration: 'none' }}>
              <div className="product-card">
                <img src={p.image} alt={p.name} className="product-image" />
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                    {p.category}
                  </div>
                  <div className="product-price">₹{p.price}</div>
                  <p className="product-desc">{p.shortDesc}</p>
                  <button className="btn" disabled={p.quantity === 0}>
                    {p.quantity === 0 ? 'Out of Stock' : 'View Details'}
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}