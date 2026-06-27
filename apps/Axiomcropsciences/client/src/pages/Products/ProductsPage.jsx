import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiGrid } from "react-icons/fi";
import Navbar       from "../../components/navigation/Navbar";
import Footer       from "../../components/navigation/Footer";
import ProductCard  from "../../components/product/ProductCard";
import SearchDropdown from "../../components/common/SearchDropdown";
import API, { mediaUrl } from "../../api/axios";
import "../../styles/site.css";
import "./ProductsPage.css";

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
  const [allProducts,    setAllProducts]    = useState([]);
  const [apiLoading,     setApiLoading]     = useState(true);
  const [categories,     setCategories]     = useState([
    { name: "All", isAll: true }
  ]);

  /* ── Fetch categories ── */
  useEffect(() => {
    API.get("/categories").then(res => {
      if (res.data && res.data.length > 0) {
        setCategories([{ name: "All", isAll: true }, ...res.data]);
      }
    }).catch(() => {});
  }, []);

  /* ── Fetch real products ── */
  useEffect(() => {
    setApiLoading(true);
    // Request a high limit: this page filters & sorts the full catalog
    // client-side, so it needs every product, not just the default first 20.
    API.get("/products?limit=1000")
      .then(res => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.products) ? res.data.products : [];
        setAllProducts(list);
      })
      .catch(() => {})
      .finally(() => setApiLoading(false));
  }, []);

  /* ── URL sync ── */
  useEffect(() => { setQuery(prev => prev !== urlQuery ? urlQuery : prev); }, [urlQuery]);
  useEffect(() => { 
    const catNames = categories.map(c => typeof c === 'string' ? c : c.name);
    const newCat = catNames.includes(urlCategory) ? urlCategory : "All";
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
  const handleClearAll     = ()    => { setQuery(""); setActiveCategory("All"); setSort("featured"); setSearchParams({}); };

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    let result = allProducts
      .filter(p => {
        const cat = p.category?.name || p.category || "";
        return activeCategory === "All" || cat === activeCategory;
      })
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
  }, [allProducts, activeCategory, urlQuery, sort]);

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
        {/* ── Toolbar ── */}
        <div className="plp-toolbar" style={{ justifyContent: "center" }}>
          {/* Category circles */}
          <div className="plp-cats">
            {categories.map(catObj => {
              const catName = typeof catObj === 'string' ? catObj : catObj.name;
              const catImage = typeof catObj === 'string' ? null : catObj.image;
              const isAll = typeof catObj === 'string' ? false : catObj.isAll;
              
              return (
                <button key={catName}
                  className={`plp-cat-item${activeCategory === catName ? " active" : ""}`}
                  onClick={() => handleCategory(catName)}>
                  <div className="plp-cat-circle">
                    {catImage ? (
                      <img src={mediaUrl(catImage)} alt={catName} loading="lazy" />
                    ) : (
                      isAll ? <FiGrid size={24} color="#777" /> : <span style={{ fontSize: 24 }}>📦</span>
                    )}
                  </div>
                  <span className="plp-cat-name">{catName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {apiLoading ? (
          <div className="plp-grid">
            {Array.from({length:10}).map((_,i) => (
              <div key={i} className="plp-skeleton" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="plp-grid">
            {filtered.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="plp-empty">
            <div style={{fontSize:64}}>🌱</div>
            <h3>No products available right now</h3>
            <p>Our catalogue is being stocked. Please check back soon.</p>
          </div>
        ) : (
          <div className="plp-empty">
            <div style={{fontSize:64}}>🔍</div>
            <h3>No products found</h3>
            <p>{urlQuery ? `No results for “${urlQuery}”. Try a different term.` : "Try a different category."}</p>
            <button className="site-btn-primary" onClick={handleClearAll}>Clear Filters</button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
