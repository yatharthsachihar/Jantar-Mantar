import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi } from '../api';
import ProductCard from '../components/ProductCard';

const SORTS = [
  { label: 'Newest', sort: 'createdAt', order: 'desc' },
  { label: 'Price: Low to High', sort: 'price', order: 'asc' },
  { label: 'Price: High to Low', sort: 'price', order: 'desc' },
  { label: 'Top Rated', sort: 'rating', order: 'desc' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const sort = params.get('sort') || 'createdAt';
  const order = params.get('order') || 'desc';

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.list() });

  const flags = {};
  ['isBestSeller', 'isTrending', 'isNewArrival', 'isFeatured'].forEach((f) => {
    if (params.get(f)) flags[f] = params.get(f);
  });

  const { data, isLoading } = useQuery({
    queryKey: ['shop', { category, search, sort, order, ...flags }],
    queryFn: () => productApi.list({ category, search, sort, order, limit: 48, page: 1, ...flags }),
  });
  const products = data?.products || [];

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  };

  return (
    <div className="container section">
      <div className="spread" style={{ marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Shop</h1>
          {search && <p className="muted" style={{ margin: '4px 0 0' }}>Results for “{search}”</p>}
        </div>
        <select className="input" style={{ width: 'auto' }} value={`${sort}:${order}`}
          onChange={(e) => { const [s, o] = e.target.value.split(':'); const next = new URLSearchParams(params); next.set('sort', s); next.set('order', o); setParams(next); }}>
          {SORTS.map((s) => <option key={s.label} value={`${s.sort}:${s.order}`}>{s.label}</option>)}
        </select>
      </div>

      <div className="scroll-x" style={{ marginBottom: 20 }}>
        <button className={`pill ${!category ? 'active' : ''}`} onClick={() => setParam('category', '')}>All</button>
        {categories.map((c) => (
          <button key={c._id} className={`pill ${category === c._id ? 'active' : ''}`} onClick={() => setParam('category', c._id)}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="empty">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="empty"><h3>No products found</h3><p>Try a different category or search term.</p></div>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
