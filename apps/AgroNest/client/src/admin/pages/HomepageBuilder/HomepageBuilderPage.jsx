import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import {
  FiSave, FiRefreshCw, FiHome, FiPackage, FiStar,
  FiMessageSquare, FiTag, FiInfo, FiCheck
} from "react-icons/fi";
import { settingsApi } from "../../../api/settingsApi";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";

/* ── Reusable Field ─────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, hint, type = "text" }) {
  const base = {
    padding: "10px 14px", background: "var(--bg)",
    border: "1px solid var(--border)", borderRadius: 10,
    color: "var(--text)", fontSize: 14, outline: "none",
    fontFamily: "inherit", width: "100%", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</label>
      <input type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder}
        style={base}
        onFocus={e => e.target.style.borderColor = "var(--primary)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
      {hint && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</span>}
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, hint, rows = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
        textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</label>
      <textarea rows={rows} value={value ?? ""} onChange={onChange} placeholder={placeholder}
        style={{
          padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)",
          borderRadius: 10, color: "var(--text)", fontSize: 14, outline: "none",
          fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "var(--primary)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
      {hint && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</span>}
    </div>
  );
}

function Toggle({ label, checked, onChange, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--border)",
      borderRadius: 10 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{hint}</div>}
      </div>
      <div onClick={() => onChange(!checked)} style={{
        width: 48, height: 26, borderRadius: 13, cursor: "pointer",
        background: checked ? "var(--primary)" : "var(--border)",
        position: "relative", transition: "background 0.25s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 3, left: checked ? 25 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "white",
          transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
    </div>
  );
}

/* ── Tab nav ─────────────────────────────────────────────────── */
const TABS = [
  { id: "hero",         label: "Hero",          icon: <FiHome /> },
  { id: "announcement", label: "Announcement",  icon: <FiTag /> },
  { id: "sections",    label: "Sections",       icon: <FiPackage /> },
  { id: "stats",       label: "Stats & Trust",  icon: <FiStar /> },
  { id: "cta",         label: "CTA Banners",    icon: <FiMessageSquare /> },
];

export default function HomepageBuilderPage() {
  const pageRef     = useRef();
  const queryClient = useQueryClient();
  const [tab, setTab]   = useState("hero");
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useGSAP(() => {
    gsap.from(".page-header", { opacity: 0, y: -20, duration: 0.5 });
    gsap.from(".hpb-card",    { opacity: 0, y: 30, stagger: 0.08, duration: 0.5, delay: 0.1 });
  }, { scope: pageRef, dependencies: [tab] });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then(r => r.data),
  });

  useEffect(() => {
    if (settings && !form) setForm(JSON.parse(JSON.stringify(settings)));
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data) => settingsApi.update(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Homepage updated! Changes are live.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => toast.error("Failed to save"),
  });

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  if (isLoading || !form) {
    return (
      <div className="dash-section">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[1,2,3].map(i => <Skeleton key={i} height={160} radius={20} />)}
        </div>
      </div>
    );
  }

  const cardStyle = {
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 20, padding: 26, marginBottom: 20,
  };
  const cardHeadStyle = {
    fontWeight: 700, fontSize: 15, color: "var(--text)",
    marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", gap: 10,
  };

  return (
    <div ref={pageRef} className="dash-section">

      <PageHeader
        title="Homepage Builder"
        subtitle="Edit every section of your homepage — changes are live after saving"
        actions={
          <>
            <Button variant="ghost" size="sm"
              onClick={() => { setForm(JSON.parse(JSON.stringify(settings))); toast("Reset to saved"); }}>
              <FiRefreshCw /> Reset
            </Button>
            <Button size="sm" loading={saveMutation.isPending}
              onClick={() => saveMutation.mutate(form)}
              style={saved ? { background: "#16a34a" } : {}}>
              {saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save Changes</>}
            </Button>
          </>
        }
      />

      {/* ── Tab Bar ────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap",
        padding: "6px", background: "var(--card)", borderRadius: 16,
        border: "1px solid var(--border)",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 18px", borderRadius: 12, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 13, fontFamily: "inherit",
            background: tab === t.id ? "var(--primary)" : "transparent",
            color: tab === t.id ? "white" : "var(--text-muted)",
            transition: "all 0.2s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Hero Tab ─────────────────────────────────────── */}
      {tab === "hero" && (
        <>
          <div className="hpb-card" style={cardStyle}>
            <div style={cardHeadStyle}><FiHome /> Hero Headline & Subtitle</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field
                label="Hero Headline"
                value={form.heroTitle}
                onChange={e => set("heroTitle", e.target.value)}
                placeholder="Grow More. Worry Less. Harvest Better."
                hint="Use '. ' (period + space) to split into separate lines on the site"
              />
              <Textarea
                label="Hero Subtitle"
                value={form.heroSubtitle}
                onChange={e => set("heroSubtitle", e.target.value)}
                placeholder="From certified seeds to organic fertilizers — everything your farm needs."
                rows={2}
              />
            </div>
          </div>

          <div className="hpb-card" style={cardStyle}>
            <div style={cardHeadStyle}><FiTag /> CTA Buttons</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <Field label="Primary Button Text" value={form.heroCTA1Text} onChange={e => set("heroCTA1Text", e.target.value)} placeholder="Shop Now" />
              <Field label="Primary Button Link" value={form.heroCTA1Link} onChange={e => set("heroCTA1Link", e.target.value)} placeholder="/products" />
              <Field label="Secondary Button Text" value={form.heroCTA2Text} onChange={e => set("heroCTA2Text", e.target.value)} placeholder="Explore Categories" />
              <Field label="Secondary Button Link" value={form.heroCTA2Link} onChange={e => set("heroCTA2Link", e.target.value)} placeholder="/categories" />
            </div>
          </div>
        </>
      )}

      {/* ── Announcement Tab ─────────────────────────────── */}
      {tab === "announcement" && (
        <div className="hpb-card" style={cardStyle}>
          <div style={cardHeadStyle}><FiTag /> Top Announcement Bar</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Toggle
              label="Show Announcement Bar"
              checked={!!form.announcementActive}
              onChange={v => set("announcementActive", v)}
              hint="Hides or shows the scrolling bar at the very top of every page"
            />
            <Field
              label="Announcement Text"
              value={form.announcementBar}
              onChange={e => set("announcementBar", e.target.value)}
              placeholder="🌾 Free delivery above ₹999 | Certified organic products | Support: 1800-XXX-XXXX"
              hint="Use | to separate multiple messages. Emojis are supported."
            />
            {form.announcementBar && (
              <div style={{
                padding: "10px 18px", background: "var(--primary)", borderRadius: 10,
                fontSize: 13, color: "white", textAlign: "center",
              }}>
                Preview: {form.announcementBar}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sections Tab ─────────────────────────────────── */}
      {tab === "sections" && (
        <div className="hpb-card" style={cardStyle}>
          <div style={cardHeadStyle}><FiPackage /> Homepage Section Visibility</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
              Toggle which sections appear on the homepage. Sections are rendered in the order shown.
            </div>
            {[
              { key: "showFeaturedCategories", label: "Featured Categories", hint: "Grid of product categories" },
              { key: "showFeaturedProducts",   label: "Featured Products",   hint: "Hand-picked product carousel" },
              { key: "showSeasonalBanner",     label: "Seasonal Sale Banner", hint: "Kharif/Rabi season promo" },
              { key: "showBestSellers",        label: "Best Selling Products", hint: "Top-selling items" },
              { key: "showBrandsSection",      label: "Trusted Brands",       hint: "Brand logo ticker" },
              { key: "showTestimonials",       label: "Testimonials",         hint: "Farmer reviews" },
              { key: "showBlogSection",        label: "Blog / Knowledge Hub", hint: "Latest articles" },
              { key: "showNewsletter",         label: "Newsletter Signup",    hint: "Email subscription form" },
            ].map(({ key, label, hint }) => (
              <Toggle
                key={key}
                label={label}
                checked={form[key] !== false}
                onChange={v => set(key, v)}
                hint={hint}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Stats Tab ────────────────────────────────────── */}
      {tab === "stats" && (
        <>
          <div className="hpb-card" style={cardStyle}>
            <div style={cardHeadStyle}><FiStar /> Hero Floating Stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
              <Field label="Farmers Count" value={form.statFarmers} onChange={e => set("statFarmers", e.target.value)} placeholder="50K+" hint="Label: Happy Farmers" />
              <Field label="Products Count" value={form.statProducts} onChange={e => set("statProducts", e.target.value)} placeholder="2K+" hint="Label: Products" />
              <Field label="Satisfaction" value={form.statSatisfaction} onChange={e => set("statSatisfaction", e.target.value)} placeholder="98%" hint="Label: Satisfaction" />
            </div>
          </div>

          <div className="hpb-card" style={cardStyle}>
            <div style={cardHeadStyle}><FiInfo /> Store Mode Display</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                These control how products appear to visitors. Go to <strong>Settings</strong> to change the store mode.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { mode: "b2c", label: "B2C / Retail", desc: "Prices shown, cart enabled" },
                  { mode: "b2b", label: "B2B / Wholesale", desc: "Quote-based, enquiries only" },
                  { mode: "hybrid", label: "Hybrid", desc: "Both modes with visitor toggle" },
                ].map(({ mode, label, desc }) => (
                  <div key={mode} style={{
                    padding: 16, borderRadius: 14, cursor: "pointer",
                    border: `2px solid ${form.storeMode === mode ? "var(--primary)" : "var(--border)"}`,
                    background: form.storeMode === mode ? "rgba(var(--primary-rgb), 0.08)" : "var(--bg)",
                    transition: "all 0.2s",
                  }} onClick={() => set("storeMode", mode)}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: form.storeMode === mode ? "var(--primary)" : "var(--text)" }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── CTA Tab ──────────────────────────────────────── */}
      {tab === "cta" && (
        <div className="hpb-card" style={cardStyle}>
          <div style={cardHeadStyle}><FiMessageSquare /> Enquiry & Retail CTAs</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "12px 16px",
              background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
              💡 These CTAs appear throughout the site based on the current store mode.
              The B2B enquiry CTA shows when mode is B2B or Hybrid. The retail CTA shows in B2C or Hybrid.
            </div>
            <Field
              label="B2B Enquiry CTA Text"
              value={form.b2bCtaText}
              onChange={e => set("b2bCtaText", e.target.value)}
              placeholder="Request a Quote"
              hint="Button shown on product pages in B2B mode"
            />
            <Field
              label="B2B Enquiry CTA Sub-text"
              value={form.b2bCtaSubtext}
              onChange={e => set("b2bCtaSubtext", e.target.value)}
              placeholder="Bulk orders | Custom pricing | Dedicated support"
              hint="Small text shown below the B2B CTA button"
            />
            <Field
              label="Retail CTA Text"
              value={form.retailCtaText}
              onChange={e => set("retailCtaText", e.target.value)}
              placeholder="Add to Cart"
              hint="Button shown on product pages in B2C mode"
            />
          </div>
        </div>
      )}

      {/* ── Sticky save ──────────────────────────────────── */}
      <div style={{ position: "sticky", bottom: 24, zIndex: 10,
        display: "flex", justifyContent: "flex-end" }}>
        <Button size="sm" loading={saveMutation.isPending}
          onClick={() => saveMutation.mutate(form)}
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)", ...(saved ? { background: "#16a34a" } : {}) }}>
          {saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save Changes</>}
        </Button>
      </div>

    </div>
  );
}
