import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/axios';
import { CartContext } from '../context/Cartcontent';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
  if (!product) return <div className="container" style={{ padding: '2rem' }}>Not found</div>;

  return (
    <div className="container product-detail">
      <Link to="/products" className="back-link">← Back</Link>
      <div className="product-detail-grid">
        <img src={product.image} alt={product.name} className="product-detail-img" />
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="category">{product.category}</p>
          <div className="price">₹{product.price}</div>
          <p className="description">{product.fullDesc}</p>
          <button onClick={() => addToCart(product)} className="btn">Add to Cart</button>
          <Link to="/enquiry" className="btn">Enquire Now</Link>
        </div>
      </div>
    </div>
  );
}