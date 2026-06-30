import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { productApi, categoryApi, bannerApi, orderApi } from '../api';
import { inr } from '../utils/format';

export default function Dashboard() {
  const { data: products } = useQuery({ queryKey: ['adm-products-count'], queryFn: () => productApi.list({ page: 1, limit: 1 }) });
  const { data: categories } = useQuery({ queryKey: ['adm-categories'], queryFn: () => categoryApi.list({ all: true }) });
  const { data: banners } = useQuery({ queryKey: ['adm-banners'], queryFn: () => bannerApi.list({ all: true }) });
  const { data: orders } = useQuery({ queryKey: ['adm-orders'], queryFn: orderApi.list });

  const revenue = (orders || []).reduce((s, o) => s + (o.totalAmount || 0), 0);

  const stats = [
    { l: 'Products', n: products?.total ?? '—', to: '/admin/products' },
    { l: 'Categories', n: categories?.length ?? '—', to: '/admin/categories' },
    { l: 'Banners', n: banners?.length ?? '—', to: '/admin/banners' },
    { l: 'Orders', n: orders?.length ?? '—', to: '/admin/orders' },
  ];

  return (
    <div>
      <div className="adm-stats">
        {stats.map((s) => (
          <Link key={s.l} to={s.to} className="adm-stat">
            <div className="n">{s.n}</div>
            <div className="l">{s.l}</div>
          </Link>
        ))}
      </div>
      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Revenue (all orders)</h3>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--green)' }}>{inr(revenue)}</div>
        <p className="muted">Across {orders?.length || 0} order(s). COD / manual orders included.</p>
      </div>
    </div>
  );
}
