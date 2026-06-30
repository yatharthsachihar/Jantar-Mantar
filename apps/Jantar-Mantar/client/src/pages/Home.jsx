import { useQuery, useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bannerApi, categoryApi, productApi } from '../api';
import { useSettings } from '../hooks/useSettings';
import { mediaUrl } from '../api/axios';
import BannerCarousel from '../components/BannerCarousel';
import CategoryRow from '../components/CategoryRow';
import ProductSection from '../components/ProductSection';

const FLAG_TO_QUERY = {
  isBestSeller: { isBestSeller: 'true' },
  isTrending: { isTrending: 'true' },
  isNewArrival: { isNewArrival: 'true' },
  isFeatured: { isFeatured: 'true' },
};

export default function Home() {
  const { data: settings } = useSettings();
  const { data: banners = [] } = useQuery({ queryKey: ['banners'], queryFn: () => bannerApi.list() });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.list() });

  const sections = (settings?.homeSections || [])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const sectionResults = useQueries({
    queries: sections.map((s) => ({
      queryKey: ['home-section', s.source],
      queryFn: () => productApi.list({ ...(FLAG_TO_QUERY[s.source] || {}), limit: 8 }),
    })),
  });

  const hasSectionProducts = sectionResults.some((r) => {
    const d = r?.data?.products || r?.data || [];
    return (Array.isArray(d) ? d : []).length > 0;
  });

  return (
    <div>
      {banners.length > 0 ? <BannerCarousel banners={banners} /> : <HeroFallback settings={settings} />}

      {settings?.showCategoryRow !== false && categories.length > 0 && (
        <section className="section" style={{ paddingBottom: 8 }}>
          <div className="container section-head">
            <div><h2>Shop by Category</h2><p>Explore our curated collections</p></div>
          </div>
          <CategoryRow categories={categories} />
        </section>
      )}

      {sections.map((s, i) => {
        const products = sectionResults[i]?.data?.products || sectionResults[i]?.data || [];
        const list = Array.isArray(products) ? products : products.products || [];
        return (
          <ProductSection
            key={s.key}
            title={s.title}
            subtitle={s.subtitle}
            products={list}
            viewAllTo={`/shop?${new URLSearchParams(FLAG_TO_QUERY[s.source] || {}).toString()}`}
          />
        );
      })}

      {settings?.showTopCategories !== false && categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><div><h2>Top Categories</h2></div></div>
            <div className="sh-tiles">
              {categories.slice(0, 4).map((c) => (
                <Link key={c._id} to={`/shop?category=${c._id}`} className="sh-tile">
                  {c.image
                    ? <img src={mediaUrl(c.image)} alt={c.name} />
                    : <div style={{ display: 'grid', placeItems: 'center', height: '100%', fontSize: 48 }}>{c.icon || '🛍️'}</div>}
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length === 0 && !hasSectionProducts && (
        <div className="container empty" style={{ paddingBottom: 60 }}>
          <h3>Your store is ready 🛍️</h3>
          <p>Add categories, products and banners from the admin panel to fill the homepage.</p>
        </div>
      )}
    </div>
  );
}

// Shown when no banners exist yet — keeps the homepage looking complete.
function HeroFallback({ settings }) {
  return (
    <div className="container">
      <div className="sh-hero-fallback">
        <span className="tag green">Welcome</span>
        <h1>{settings?.storeName || 'Jantar-Mantar'}</h1>
        <p>{settings?.tagline || 'Pure spices, dry fruits & herbal goodness'}</p>
        <Link to="/shop" className="btn btn-primary">Shop Now</Link>
      </div>
    </div>
  );
}
