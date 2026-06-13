import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPackage } from "react-icons/fi";
import "./CategoryCard.css";

const DEFAULT_ICONS = ["🌾","🌿","🛡️","💧","🔧","🍃","🐾","🌻","🥬","🫘"];

export default function CategoryCard({ category = {}, index = 0 }) {
  const {
    name         = "Category",
    slug         = "category",
    description  = "",
    productCount = 0,
    image        = "",
  } = category;

  // Track whether the image has finished loading
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError,  setImgError]  = useState(false);

  const icon     = category.icon || DEFAULT_ICONS[index % DEFAULT_ICONS.length];
  const hasImage = image && !imgError;

  return (
    <Link to={`/categories/${slug}`} className="site-cat-card">

      {/* ── Background layer ── */}
      <div className="site-cat-card-bg">

        {/* Shimmer — shows while image is loading OR if no image */}
        {(!hasImage || !imgLoaded) && (
          <div className="site-cat-card-shimmer-bg" />
        )}

        {/* Actual image — invisible until loaded, then fades in */}
        {hasImage && (
          <img
            src={image}
            alt={name}
            className={`site-cat-card-img${imgLoaded ? " loaded" : ""}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Dark overlay — only when image is visible */}
      {hasImage && imgLoaded && <div className="site-cat-card-overlay" />}

      {/* Subtle shine sweep */}
      <div className="site-cat-card-shine" />

      {/* Top — icon + count */}
      <div className="site-cat-card-top">
        <span className="site-cat-card-icon">{icon}</span>
        {productCount > 0 && (
          <span className="site-cat-card-count">
            <FiPackage size={11} /> {productCount} products
          </span>
        )}
      </div>

      {/* Bottom — name + desc + arrow */}
      <div className={`site-cat-card-body${hasImage && imgLoaded ? "" : " site-cat-card-body-dark"}`}>
        <div className="site-cat-card-name">{name}</div>
        {description && (
          <div className="site-cat-card-desc">{description}</div>
        )}
        <div className="site-cat-card-link">
          Shop now <FiArrowRight size={14} />
        </div>
      </div>

    </Link>
  );
}
