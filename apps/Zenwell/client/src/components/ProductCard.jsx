import { Link } from "react-router-dom";

// ProductCard shows one product preview inside the Products page.
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img
  src={product.thumbnail || product.image}
  alt={product.title}
  className="product-image"
/>

      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h2>{product.title}</h2>
        <p className="product-description">{product.description}</p>
        <div className="product-card-footer">
          <strong>${product.price}</strong>
          <Link to={`/products/${product.id}`} className="small-button">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;