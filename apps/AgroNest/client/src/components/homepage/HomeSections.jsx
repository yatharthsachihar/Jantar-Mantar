import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "../category/CategoryCard";
import ProductCard  from "../product/ProductCard";
import { useSettings } from "../../context/SettingsContext";
import API from "../../api/axios";
import "./HomeSections.css";

/* ── fetch helper ── */
const fetchList = (url) => API.get(url).then(r => {
  const d = r.data;
  // route returns array or { products: [] }
  return Array.isArray(d) ? d : d.products || [];
});

/* ─────────────────────────────────────────────
   FEATURED CATEGORIES
───────────────────────────────────────────── */
const DEMO_CATS = [
  { _id:"d1", name:"Seeds",       slug:"seeds",       description:"Hybrid & organic seeds",   productCount:12, image:"https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=600&q=80" },
  { _id:"d2", name:"Fertilizers", slug:"fertilizers", description:"Macro & micro nutrients",  productCount:8,  image:"https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80" },
  { _id:"d3", name:"Pesticides",  slug:"pesticides",  description:"Crop protection range",    productCount:9,  image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80" },
  { _id:"d4", name:"Irrigation",  slug:"irrigation",  description:"Drip & sprinkler systems", productCount:5,  image:"https://images.unsplash.com/photo-1563514227147-6d2af9a0c3b5?w=600&q=80" },
  { _id:"d5", name:"Farm Tools",  slug:"farm-tools",  description:"Hand & power tools",       productCount:7,  image:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80" },
  { _id:"d6", name:"Organic",     slug:"organic",     description:"100% natural products",    productCount:10, image:"https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=600&q=80" },
];

export function FeaturedCategories() {
  const { data: cats = [], isLoading } = useQuery({
    queryKey: ["categories-home"],
    queryFn:  () => API.get("/categories").then(r => r.data).catch(() => []),
    staleTime: 1000 * 60 * 5,
  });

  // While loading, show skeleton cards — never show demo data
  if (isLoading) {
    return (
      <section className="home-section">
        <div className="site-container">
          <div className="home-section-head center">
            <div className="site-section-label">Shop by Category</div>
            <h2 className="site-section-heading">Everything Your Farm Needs</h2>
          </div>
          <div className="feat-cat-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="site-cat-card-skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If DB returned no categories yet, show empty — not fake demo data
  if (!cats.length) return null;

  return (
    <section className="home-section">
      <div className="site-container">
        <div className="home-section-head center">
          <div className="site-section-label">Shop by Category</div>
          <h2 className="site-section-heading">Everything Your Farm Needs</h2>
          <p className="site-section-sub">
            From certified seeds to irrigation systems — browse our complete
            agricultural range curated for Indian farmers.
          </p>
        </div>
        <div className="feat-cat-grid">
          {cats.map((cat, i) => (
            <CategoryCard key={cat._id} category={cat} index={i} />
          ))}
        </div>
        <div className="home-section-cta">
          <Link to="/categories" className="site-btn-secondary">
            View All Categories <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TRUST BAR
───────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon:"🌱", title:"Certified Organic",  desc:"All products tested & certified by national agricultural boards." },
  { icon:"🚚", title:"Pan India Delivery", desc:"Fast dispatch across 28 states — delivered in 24-72 hours." },
  { icon:"🔄", title:"Easy Returns",       desc:"7-day hassle-free return policy on all orders." },
  { icon:"💬", title:"Expert Support",     desc:"Talk to an agronomist 7 days a week." },
];

export function TrustSection() {
  return (
    <section className="trust-section">
      <div className="site-container">
        <div className="trust-grid">
          {TRUST_ITEMS.map(t => (
            <div key={t.title} className="trust-item">
              <div className="trust-icon">{t.icon}</div>
              <div>
                <div className="trust-title">{t.title}</div>
                <div className="trust-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRODUCTS — reusable
───────────────────────────────────────────── */
const DEMO_PRODUCTS = [
  { _id:"p1", name:"Hybrid Tomato Seeds",    slug:"hybrid-tomato-seeds",  category:{name:"Seeds"},       price:299, originalPrice:399, stock:500, unit:"packet", isFeatured:true,  isBestSeller:true,  images:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"] },
  { _id:"p2", name:"NPK 19:19:19 (5kg)",     slug:"npk-19-19-19-5kg",     category:{name:"Fertilizers"}, price:649, originalPrice:850, stock:800, unit:"bag",    isFeatured:true,  isTrending:true,    images:["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80"] },
  { _id:"p3", name:"Drip Irrigation Kit",    slug:"drip-irrigation-kit",  category:{name:"Irrigation"},  price:1899,originalPrice:2499,stock:120, unit:"kit",    isTopProduct:true,isFeatured:true,    images:["https://images.unsplash.com/photo-1563514227147-6d2af9a0c3b5?w=400&q=80"] },
  { _id:"p4", name:"Organic Neem Pesticide", slug:"organic-neem-pesticide",category:{name:"Pesticides"},  price:349, originalPrice:450, stock:600, unit:"bottle", isBestSeller:true,isOrganic:true,     images:["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80"] },
  { _id:"p5", name:"Paddy Seeds PR-126",     slug:"paddy-seeds-pr-126",   category:{name:"Seeds"},       price:199, stock:1200,unit:"packet",isTrending:true, isNewArrival:true,                        images:["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80"] },
  { _id:"p6", name:"Vermicompost 10kg",      slug:"vermicompost-10kg",    category:{name:"Organic"},     price:399, originalPrice:499, stock:400, unit:"bag",    isFeatured:true,  isOrganic:true,      images:["https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=400&q=80"] },
  { _id:"p7", name:"Forged Steel Spade",     slug:"forged-steel-spade",   category:{name:"Farm Tools"},  price:849, originalPrice:1099,stock:200, unit:"piece",  isTopProduct:true,                     images:["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"] },
  { _id:"p8", name:"DAP Fertilizer (50kg)",  slug:"dap-fertilizer-50kg",  category:{name:"Fertilizers"}, price:1400,stock:900, unit:"bag",    isBestSeller:true,isFeatured:true,                        images:["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80"] },
];

function ProductSection({ queryKey, flag, label, title, viewAllLink, altBg }) {
  const { activeMode } = useSettings();
  const { data: products = [] } = useQuery({
    queryKey: [queryKey, activeMode],
    queryFn:  () => fetchList(`/products?${flag}=true`).catch(() => []),
    staleTime: 1000 * 60 * 3,
  });

  // Use demo data if API not connected yet
  const items = (products.length ? products : DEMO_PRODUCTS.filter(p => p[flag === 'featured' ? 'isFeatured' : flag === 'bestseller' ? 'isBestSeller' : flag === 'newarrival' ? 'isNewArrival' : 'isTrending'])).slice(0, 8);
  if (!items.length) return null;

  return (
    <section className={`home-section${altBg ? " alt-bg" : ""}`}>
      <div className="site-container">
        <div className="home-section-head">
          <div>
            <div className="site-section-label">{label}</div>
            <h2 className="site-section-heading">{title}</h2>
          </div>
          <Link to={viewAllLink} className="site-btn-secondary">View All <FiArrowRight /></Link>
        </div>
        <div className="product-grid-4">
          {items.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  return <ProductSection queryKey="featured" flag="featured" label="Hand-Picked" title="Featured Products" viewAllLink="/products?filter=featured" />;
}

export function BestSellingProducts() {
  return <ProductSection queryKey="bestseller" flag="bestseller" label="Top Picks" title="Best Selling Products" viewAllLink="/products?filter=bestseller" altBg />;
}

export function NewArrivals() {
  return <ProductSection queryKey="newarrival" flag="newarrival" label="Just In" title="New Arrivals" viewAllLink="/products?filter=new" />;
}

/* ─────────────────────────────────────────────
   SEASONAL BANNER
───────────────────────────────────────────── */
export function SeasonalProducts() {
  return (
    <section className="home-section">
      <div className="site-container">
        <div className="seasonal-banner">
          <div className="seasonal-banner-left">
            <div className="site-section-label" style={{ color:"white" }}>Limited Time</div>
            <h2 className="seasonal-banner-heading">Kharif Season Sale</h2>
            <p className="seasonal-banner-sub">
              Stock up for the monsoon season. Up to 40% off on paddy seeds,
              sugarcane saplings & kharif fertilizers.
            </p>
            <Link to="/products?seasonal=true" className="site-btn-primary"
              style={{ background:"white", color:"#1F7A3D" }}>
              Shop Kharif Range <FiArrowRight />
            </Link>
          </div>
          <div className="seasonal-banner-right">
            <div className="seasonal-big-icon">🌧️</div>
            <div style={{ textAlign:"center" }}>
              <div className="seasonal-stat-num">40%</div>
              <div className="seasonal-stat-label">Off on Kharif Range</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   BRANDS
───────────────────────────────────────────── */
const BRANDS = ["Syngenta","Bayer","Corteva","UPL","Mahindra Agri","IFFCO","Coromandel","Godrej Agrovet","Rallis India","PI Industries"];

export function BrandsSection() {
  return (
    <section className="brands-section">
      <div className="site-container">
        <div className="brands-label">Trusted Brands We Stock</div>
        <div className="brands-ticker">
          <div className="brands-track">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div key={i} className="brand-chip">{b}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
const TESTIMONIALS = [
  { name:"Ramesh Patel",  location:"Gujarat",        crop:"Cotton & Wheat",    rating:5, text:"AgroNest's hybrid seeds gave me 30% more yield this rabi season. Delivery was fast and packaging was top notch." },
  { name:"Sunita Devi",   location:"Punjab",         crop:"Paddy & Sugarcane", rating:5, text:"The NPK fertilizers are excellent quality and the agronomist helpline actually helped me fix my soil pH issue." },
  { name:"Vijay Kumar",   location:"Andhra Pradesh", crop:"Chilies & Tomato",  rating:5, text:"Been ordering from AgroNest for 2 years. Their organic pesticides are genuinely effective — zero crop damage." },
  { name:"Meera Sharma",  location:"Rajasthan",      crop:"Cumin & Mustard",   rating:4, text:"Even in my remote village they deliver within 3 days. Customer care is prompt and they speak in Hindi." },
];

export function Testimonials() {
  return (
    <section className="home-section alt-bg">
      <div className="site-container">
        <div className="home-section-head center">
          <div className="site-section-label">Reviews</div>
          <h2 className="site-section-heading">Farmers Love AgroNest</h2>
          <p className="site-section-sub">50,000+ farmers across India trust us every season.</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">{"⭐".repeat(t.rating)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name[0]}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-meta">{t.location} · {t.crop}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   BLOG
───────────────────────────────────────────── */
const DEMO_BLOGS = [
  { _id:"b1", title:"How to Choose the Right Fertilizer for Your Kharif Crop",         category:"Fertilizers",  slug:"choose-fertilizer-kharif", featuredImage:"https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80" },
  { _id:"b2", title:"Drip Irrigation: Why Every Small Farmer Should Invest in 2026",   category:"Irrigation",   slug:"drip-irrigation-2026",     featuredImage:"https://images.unsplash.com/photo-1563514227147-6d2af9a0c3b5?w=600&q=80" },
  { _id:"b3", title:"Understanding Integrated Pest Management (IPM) for Indian Farms", category:"Pest Control", slug:"ipm-indian-farms",          featuredImage:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80" },
];

export function BlogSection() {
  const { data: apiBlogs = [] } = useQuery({
    queryKey: ["blogs-home"],
    queryFn:  () => API.get("/blogs?status=published").then(r => r.data).catch(() => []),
    staleTime: 1000 * 60 * 10,
  });
  const blogs = (apiBlogs.length ? apiBlogs : DEMO_BLOGS).slice(0, 3);

  return (
    <section className="home-section">
      <div className="site-container">
        <div className="home-section-head">
          <div>
            <div className="site-section-label">Knowledge Hub</div>
            <h2 className="site-section-heading">Farm Smarter</h2>
          </div>
          <Link to="/blog" className="site-btn-secondary">All Articles <FiArrowRight /></Link>
        </div>
        <div className="blog-grid">
          {blogs.map(b => (
            <Link key={b._id} to={`/blog/${b.slug || b._id}`} className="blog-card">
              <div className="blog-card-img-wrap">
                {b.featuredImage
                  ? <img src={b.featuredImage} alt={b.title} style={{ width:"100%", height:200, objectFit:"cover" }} />
                  : <div className="blog-card-img">📰</div>
                }
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span className="blog-card-cat">{b.category || "General"}</span>
                  <span className="blog-card-read">5 min read</span>
                </div>
                <div className="blog-card-title">{b.title}</div>
                <div className="blog-card-date">
                  {b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" }) : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────────── */
export function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="site-container">
        <div className="newsletter-inner">
          <div className="newsletter-icon">📬</div>
          <h2 className="newsletter-heading">Get Seasonal Crop Advice & Exclusive Deals</h2>
          <p className="newsletter-sub">
            Join 80,000 farmers who receive weekly tips, new arrivals,
            and early-bird offers in their inbox.
          </p>
          <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert("Subscribed! Thank you."); }}>
            <input type="email" placeholder="Enter your email address" className="newsletter-input" required />
            <button type="submit" className="site-btn-primary">Subscribe Free</button>
          </form>
          <div className="newsletter-note">No spam. Unsubscribe any time.</div>
        </div>
      </div>
    </section>
  );
}
