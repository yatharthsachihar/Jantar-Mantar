import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

// A titled homepage product strip. `viewAllTo` links to the filtered shop.
export default function ProductSection({ title, subtitle, products = [], viewAllTo }) {
  if (!products.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {viewAllTo && <Link to={viewAllTo}>View all →</Link>}
        </div>
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
