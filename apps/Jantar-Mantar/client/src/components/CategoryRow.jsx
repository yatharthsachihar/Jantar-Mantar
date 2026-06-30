import { Link } from 'react-router-dom';
import { mediaUrl } from '../api/axios';

// Horizontally scrollable category shortcuts (Sagat pill/tile row).
export default function CategoryRow({ categories = [] }) {
  if (!categories.length) return null;
  return (
    <div className="container">
      <div className="scroll-x sh-catrow">
        {categories.map((c) => (
          <Link key={c._id} to={`/shop?category=${c._id}`} className="sh-cat">
            <div className="sh-cat-ic">
              {c.image
                ? <img src={mediaUrl(c.image)} alt={c.name} />
                : <span>{c.icon || '🛍️'}</span>}
            </div>
            <span className="sh-cat-label">{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
