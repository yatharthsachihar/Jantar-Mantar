import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import Navbar       from "../../components/navigation/Navbar";
import Footer       from "../../components/navigation/Footer";
import ProductCard  from "../../components/product/ProductCard";
import API          from "../../api/axios";
import "../../styles/site.css";
import "./ProductsPage.css";

/* ── Demo data (shown when API is not running) ── */
const DEMO_PRODUCTS = [
  { _id:"p1",  name:"Hybrid Tomato Seeds (50g)",         slug:"hybrid-tomato-seeds",     category:{name:"Seeds"},       price:299,  originalPrice:399,  rating:4.8, reviewCount:312, isNew:true, images:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"] },
  { _id:"p2",  name:"NPK Fertilizer 19:19:19 (5kg)",     slug:"npk-fertilizer-5kg",      category:{name:"Fertilizers"}, price:649,  originalPrice:850,  rating:4.6, reviewCount:198, images:["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80"] },
  { _id:"p3",  name:"Drip Irrigation Starter Kit",       slug:"drip-irrigation-kit",     category:{name:"Irrigation"},  price:1899, originalPrice:2499, rating:4.9, reviewCount:87,  badge:"Best Seller", images:["https://images.unsplash.com/photo-1563514227147-6d2af9a0c3b5?w=400&q=80"] },
  { _id:"p4",  name:"Organic Neem Pesticide 1L",         slug:"organic-neem-pesticide",  category:{name:"Pesticides"},  price:349,  originalPrice:450,  rating:4.7, reviewCount:256, isOrganic:true, images:["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80"] },
  { _id:"p5",  name:"Forged Steel Garden Spade",         slug:"forged-steel-spade",      category:{name:"Tools"},       price:849,  originalPrice:1099, rating:4.5, reviewCount:143, images:["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"] },
  { _id:"p6",  name:"Vermicompost Premium 10kg",         slug:"vermicompost-premium",     category:{name:"Organic"},     price:399,  originalPrice:499,  rating:4.8, reviewCount:421, isOrganic:true, images:["https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=400&q=80"] },
  { _id:"p7",  name:"Paddy Seeds PR-126 (1kg)",          slug:"paddy-seeds-pr-126",       category:{name:"Seeds"},       price:199,  rating:4.4, reviewCount:89,  isNew:true, images:["https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80"] },
  { _id:"p8",  name:"Calcium Nitrate Fertilizer 2kg",   slug:"calcium-nitrate-2kg",      category:{name:"Fertilizers"}, price:279,  originalPrice:349,  rating:4.6, reviewCount:175, images:["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80"] },
  { _id:"p9",  name:"Sprinkler Irrigation Set",          slug:"sprinkler-irrigation-set", category:{name:"Irrigation"},  price:1299, originalPrice:1699, rating:4.5, reviewCount:62,  images:["https://images.unsplash.com/photo-1563514227147-6d2af9a0c3b5?w=400&q=80"] },
  { _id:"p10", name:"Imidacloprid 17.8% SL 250ml",       slug:"imidacloprid-sl-250ml",    category:{name:"Pesticides"},  price:620,  rating:4.3, reviewCount:310, images:["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80"] },
  { _id:"p11", name:"Compost Bio Culture 1kg",           slug:"compost-bio-culture",      category:{name:"Organic"},     price:249,  rating:4.6, reviewCount:198, isOrganic:true, images:["https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=400&q=80"] },
  { _id:"p12", name:"DAP Fertilizer (50kg)",             slug:"dap-fertilizer-50kg",      category:{name:"Fertilizers"}, price:1400, rating:4.7, reviewCount:88, images:["https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80"] },
];


const SORT_OPTIONS = [
  { value:"featured",   label:"Featured"           },
  { value:"price-asc",  label:"Price: Low to High" },
  { value:"price-desc", label:"Price: High to Low" },
  { value:"rating",     label:"Highest Rated"      },
  { value:"new",        label:"Newest First"       },
];

export default function SiteProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery    = searchParams.get("q")        || "";
  const urlCategory = searchParams.get("category") || "All";
  const urlSort     = searchParams.get("sort")     || "featured";

  const [query,          setQuery]          = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sort,           setSort]           = useState(urlSort);
  const [priceMax,       setPriceMax]       = useState(5000);
  const [allProducts,    setAllProducts]    = useState(DEMO_PRODUCTS);
  const [apiLoading,     setApiLoading]     = useState(true);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [categories,     setCategories]     = useState(["All", "Seeds", "Fertilizers", "Pesticides", "Irrigation", "Tools", "Organic"]);

  /* ── Fetch categories ── */
  useEffect(() => {
    API.get("/categories").then(res => {
      if (res.data && res.data.length > 0) {
        setCategories(["All", ...res.data.map(c => c.name)]);
      }
    }).catch(() => {});
  }, []);

  /* ── Fetch real products ── */
  useEffect(() => {
    setApiLoading(true);
    API.get("/products")
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products) ? res.data.products : [];
        if (list.length > 0) setAllProducts(list);
      })
      .catch(() => {})
      .finally(() => setApiLoading(false));
  }, []);

  /* ── URL sync ── */
  useEffect(() => { setQuery(prev => prev !== urlQuery ? urlQuery : prev); }, [urlQuery]);
  useEffect(() => { 
    const newCat = categories.includes(urlCategory) ? urlCategory : "All";
    setActiveCategory(prev => prev !== newCat ? newCat : prev); 
  }, [urlCategory, categories]);
  useEffect(() => { setSort(prev => prev !== urlSort ? urlSort : prev); }, [urlSort]);

  const pushURL = useCallback((q, cat, s) => {
    const p = {};
    if (q)              p.q        = q;
    if (cat && cat !== "All") p.category = cat;
    if (s && s !== "featured")  p.sort    = s;
    setSearchParams(p, { replace: true });
  }, [setSearchParams]);

  const handleSearch       = (e) => { e.preventDefault(); pushURL(query, activeCategory, sort); };
  const handleCategory     = (cat) => { setActiveCategory(cat); pushURL(query, cat, sort); };
  const handleSort         = (s)   => { setSort(s); pushURL(query, activeCategory, s); };
  const handleClearSearch  = ()    => { setQuery(""); pushURL("", activeCategory, sort); };
  const handleClearAll     = ()    => { setQuery(""); setActiveCategory("All"); setSort("featured"); setPriceMax(5000); setSearchParams({}); };

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    let result = allProducts
      .filter(p => {
        const cat = p.category?.name || p.category || "";
        return activeCategory === "All" || cat === activeCategory;
      })
      .filter(p => !p.price || p.price <= priceMax)
      .filter(p => {
        if (!urlQuery) return true;
        const q = urlQuery.toLowerCase();
        return (p.name || "").toLowerCase().includes(q)
            || (p.category?.name || p.category || "").toLowerCase().includes(q)
            || (p.description || "").toLowerCase().includes(q);
      });

    if (sort === "price-asc")  result.sort((a,b) => (a.price || 0) - (b.price || 0));
    if (sort === "price-desc") result.sort((a,b) => (b.price || 0) - (a.price || 0));
    if (sort === "rating")     result.sort((a,b) => (b.rating || 4.5) - (a.rating || 4.5));
    if (sort === "new")        result.sort((a,b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));

    return result;
  }, [allProducts, activeCategory, priceMax, urlQuery, sort]);

  const catCount = (cat) => cat === "All"
    ? allProducts.length
    : allProducts.filter(p => (p.category?.name || p.category) === cat).length;

  return (
    <div className="site-root">
      <Navbar />

      {/* ── Page header ── */}
      <div className="plp-header">
        <div className="site-container">
          <h1 className="plp-header-title">
            {urlQuery
              ? <>Results for <em>"{urlQuery}"</em></>
              : activeCategory === "All" ? "All Products" : activeCategory}
          </h1>
          <p className="plp-header-meta">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" && ` in ${activeCategory}`}
          </p>
        </div>
      </div>

      <div className="site-container">
        <div className="plp-layout">

          {/* ── SIDEBAR ── */}
          <aside className={`plp-sidebar${sidebarOpen ? " open" : ""}`}>

            <div className="plp-sidebar-head">
              <span style={{fontWeight:700, fontSize:16}}>Filters</span>
              <button onClick={() => setSidebarOpen(false)} className="plp-sidebar-close">✕</button>
            </div>

            {/* Search */}
            <div className="plp-filter-group">
              <div className="plp-filter-label">Search</div>
              <form className="plp-search-box" onSubmit={handleSearch}>
                <FiSearch size={14} />
                <input placeholder="Search products…" value={query} onChange={e => setQuery(e.target.value)} />
                {query && <button type="button" onClick={handleClearSearch}><FiX size={13} /></button>}
              </form>
            </div>

            {/* Categories */}
            <div className="plp-filter-group">
              <div className="plp-filter-label">Category</div>
              {categories.map(cat => (
                <div key={cat}
                  className={`plp-filter-row${activeCategory === cat ? " active" : ""}`}
                  onClick={() => handleCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="plp-filter-count">{catCount(cat)}</span>
                </div>
              ))}
            </div>

            {/* Price Range */}
            <div className="plp-filter-group">
              <div className="plp-filter-label">Max Price: <strong>₹{priceMax.toLocaleString("en-IN")}</strong></div>
              <input type="range" min={0} max={5000} step={100}
                value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
                className="plp-slider" />
              <div className="plp-slider-row"><span>₹0</span><span>₹5,000</span></div>
            </div>

            {/* Certifications */}
            <div className="plp-filter-group">
              <div className="plp-filter-label">Certifications</div>
              {["Organic Certified","ISI Certified","Govt Approved"].map(c => (
                <label key={c} className="plp-check-row">
                  <input type="checkbox" style={{accentColor:"var(--site-primary)"}} />
                  <span>{c}</span>
                </label>
              ))}
            </div>

            <button className="plp-clear-btn" onClick={handleClearAll}>Clear All Filters</button>
          </aside>

          {/* ── MAIN ── */}
          <main className="plp-main">

            {/* Toolbar */}
            <div className="plp-toolbar">
              <div className="plp-cats">
                {categories.map(cat => (
                  <button key={cat}
                    className={`plp-cat-chip${activeCategory === cat ? " active" : ""}`}
                    onClick={() => handleCategory(cat)}>
                    {cat}
                    <span className="plp-chip-count">{catCount(cat)}</span>
                  </button>
                ))}
              </div>
              <div className="plp-toolbar-right">
                <button className="plp-filter-toggle" onClick={() => setSidebarOpen(p => !p)}>
                  <FiFilter size={15} /> Filters
                </button>
                <div className="plp-sort">
                  <label>Sort by:</label>
                  <select value={sort} onChange={e => handleSort(e.target.value)}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Search indicator */}
            {urlQuery && (
              <div className="plp-search-bar">
                <FiSearch size={13} />
                Showing results for <strong>"{urlQuery}"</strong>
                <button onClick={handleClearSearch} className="plp-search-bar-clear">
                  <FiX size={13} /> Clear
                </button>
              </div>
            )}

            {/* Product Grid */}
            {apiLoading ? (
              <div className="plp-grid">
                {Array.from({length:8}).map((_,i) => (
                  <div key={i} className="plp-skeleton" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="plp-grid">
                {filtered.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div className="plp-empty">
                <div style={{fontSize:64}}>🔍</div>
                <h3>No products found</h3>
                <p>{urlQuery ? `No results for "${urlQuery}". Try a different term.` : "Try adjusting your filters."}</p>
                <button className="site-btn-primary" onClick={handleClearAll}>Clear Filters</button>
              </div>
            )}

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
