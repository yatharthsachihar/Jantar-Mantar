import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FiArrowRight, FiUsers, FiPackage, FiGlobe, FiAward,
  FiChevronDown, FiChevronUp, FiTruck, FiShield, FiHeart,
  FiTrendingUp, FiCheckCircle, FiMapPin, FiPhoneCall,
} from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/navigation/Footer";
import { pageApi } from "../../api/pageApi";
import "../../styles/site.css";
import "../../components/homepage/HomeSections.css";
import "./AboutPage.css";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: <FiUsers size={28} />,   value: "50,000+", label: "Farmers Served"        },
  { icon: <FiPackage size={28} />, value: "2,000+",  label: "Products Available"    },
  { icon: <FiGlobe size={28} />,   value: "28",      label: "States Covered"        },
  { icon: <FiAward size={28} />,   value: "98%",     label: "Customer Satisfaction" },
];

const TEAM = [
  { name: "Arjun Mehta",  role: "Founder & CEO",      avatar: "A", bio: "Agricultural engineer turned entrepreneur with 15 years of field experience across Gujarat & Punjab." },
  { name: "Priya Sharma", role: "Chief Agronomist",   avatar: "P", bio: "PhD in Soil Science from PAU Ludhiana. Advises 10,000+ farmers on crop nutrition every season." },
  { name: "Rahul Verma",  role: "Head of Operations", avatar: "R", bio: "Logistics expert who built our pan-India same-day dispatch network across 500+ pin codes." },
  { name: "Sneha Patel",  role: "Head of Technology", avatar: "S", bio: "Ex-Flipkart engineer who designed our farmer-first e-commerce platform and mobile app." },
];

const MILESTONES = [
  { year: "2018", title: "Founded in Jaipur",         desc: "AgroNest started with 50 products and a single warehouse in Rajasthan." },
  { year: "2019", title: "Pan-India Expansion",        desc: "Crossed 10,000 registered farmers and opened fulfilment centres in Punjab & Maharashtra." },
  { year: "2021", title: "Organic Certification",      desc: "Became India's first agri e-commerce platform to achieve NPOP organic certification for all listed products." },
  { year: "2022", title: "B2B Wholesale Launch",       desc: "Launched dedicated wholesale portal for cooperatives, agri-businesses and distributors." },
  { year: "2024", title: "50,000 Farmers Strong",      desc: "Surpassed 50K active farmers and ₹100 Cr in annual GMV — growing 3× year-on-year." },
  { year: "2026", title: "AI Crop Advisory Platform",  desc: "Launched AI-powered soil analysis and personalised crop-input recommendations." },
];

const WHY_US = [
  { icon: <FiShield size={26} />,    title: "Certified & Tested",   desc: "Every batch verified against ISI, NPOP and state agriculture board standards before it ships." },
  { icon: <FiTruck size={26} />,     title: "48-Hour Delivery",      desc: "8 regional warehouses and 500+ serviceable pin codes mean your order lands before the planting window closes." },
  { icon: <FiPhoneCall size={26} />, title: "Agronomist Helpline",   desc: "Real agronomists, not chatbots. Call our toll-free line in 12 regional languages, 7 days a week." },
  { icon: <FiTrendingUp size={26} />,title: "Fair, Transparent Pricing", desc: "Direct-from-manufacturer sourcing cuts out 3-4 layers of middlemen markup on every product." },
  { icon: <FiHeart size={26} />,     title: "Farmer-First Returns",  desc: "7-day no-questions-asked returns on unopened products — because trust matters more than a sale." },
  { icon: <FiCheckCircle size={26} />, title: "Quality Guarantee",   desc: "If a product underperforms its label claim, we replace it free — backed by our manufacturer partnerships." },
];

const PROCESS_STEPS = [
  { num: "01", title: "Source",  desc: "We partner directly with ISI & NPOP certified manufacturers — no resellers, no grey-market stock." },
  { num: "02", title: "Test",    desc: "Every incoming batch is lab-tested for purity, germination rate, and nutrient composition." },
  { num: "03", title: "Stock",   desc: "Climate-controlled warehouses across 8 states keep seeds and fertilizers at peak viability." },
  { num: "04", title: "Deliver", desc: "Same-day dispatch with real-time tracking — most orders arrive within 24–48 hours." },
];

const IMPACT_STATS = [
  { value: 1.2, suffix: "M+",  label: "Acres of farmland served" },
  { value: 35,  suffix: "%",   label: "Avg. cost saved vs. local dealers" },
  { value: 12,  suffix: "",    label: "Regional languages supported" },
  { value: 4.8, suffix: "/5",  label: "Average product rating" },
];

/* ── Count-up number that animates when scrolled into view ── */
function CountUp({ value, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = obj.val.toFixed(decimals) + suffix;
      },
    });
  }, { scope: ref });
  return <span ref={ref} className="about-impact-value">0{suffix}</span>;
}

/* ── Dynamic section renderers ── */
function SectionHero({ data }) {
  return (
    <section className="about-hero" style={data.image ? { backgroundImage: `url(${data.image})` } : {}}>
      <div className="about-hero-overlay" />
      <div className="about-hero-inner site-container">
        {data.badge && <div className="about-hero-label site-section-label">{data.badge}</div>}
        <h1 className="about-hero-title" dangerouslySetInnerHTML={{ __html: data.heading || "" }} />
        <p className="about-hero-sub">{data.subheading}</p>
        {(data.btnText || data.btn2Text) && (
          <div className="about-hero-actions">
            {data.btnText  && <Link to={data.btnLink  || "/products"} className="site-btn-primary">{data.btnText} <FiArrowRight /></Link>}
            {data.btn2Text && <Link to={data.btn2Link || "/contact"}  className="site-btn-secondary">{data.btn2Text}</Link>}
          </div>
        )}
      </div>
    </section>
  );
}

function SectionStats({ data }) {
  return (
    <section className="about-stats-section">
      <div className="site-container">
        <div className="about-stats-grid">
          {(data.items || []).map((s, i) => (
            <div key={i} className="about-stat-card">
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionValues({ data }) {
  return (
    <section className="about-mission home-section">
      <div className="site-container about-mission-inner">
        <div className="about-mission-text">
          <div className="site-section-label">Our Values</div>
          <h2 className="site-section-heading">{data.heading || "What We Stand For"}</h2>
          {data.subheading && <p className="about-body-text">{data.subheading}</p>}
        </div>
        <div className="about-mission-visual">
          {(data.items || []).map((item, i) => (
            <div key={i} className="about-mission-card">
              <div className="about-mission-card-icon">{item.icon || "🌱"}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionTeam({ data }) {
  return (
    <section className="home-section">
      <div className="site-container">
        <div className="home-section-head center">
          <div className="site-section-label">Our Team</div>
          <h2 className="site-section-heading">{data.heading || "Meet the Team"}</h2>
        </div>
        <div className="about-team-grid">
          {(data.members || []).map((m, i) => (
            <div key={i} className="about-team-card">
              <div className="about-team-avatar">
                {m.avatar
                  ? <img src={m.avatar} alt={m.name} style={{ width:"100%", height:"100%", borderRadius:"50%", objectFit:"cover" }} />
                  : (m.name ? m.name[0] : "?")}
              </div>
              <h3 className="about-team-name">{m.name}</h3>
              <div className="about-team-role">{m.role}</div>
              <p className="about-team-bio">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionFAQ({ data }) {
  const [activeIdx, setActiveIdx] = useState(null);
  return (
    <section className="home-section alt-bg">
      <div className="site-container" style={{ maxWidth: 800 }}>
        <div className="home-section-head center">
          <div className="site-section-label">FAQ</div>
          <h2 className="site-section-heading">{data.heading || "Frequently Asked Questions"}</h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:32 }}>
          {(data.items || []).map((item, i) => {
            const open = activeIdx === i;
            return (
              <div key={i} style={{ background:"var(--site-card)", border:"1.5px solid var(--site-border)", borderRadius:16, overflow:"hidden" }}>
                <div onClick={() => setActiveIdx(open ? null : i)}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", cursor:"pointer", fontWeight:600, color:"var(--site-text)" }}>
                  <span>{item.q}</span>
                  {open ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {open && (
                  <div style={{ padding:"0 24px 20px", color:"var(--site-text-muted)", fontSize:14, lineHeight:1.6 }}>{item.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectionContactInfo({ data }) {
  return (
    <section className="contact-chips-section" style={{ padding:"40px 0" }}>
      <div className="site-container contact-chips-grid">
        {(data.cards || []).map((c, i) => (
          <div key={i} className="contact-chip">
            <div className="contact-chip-icon" style={{ fontSize:22 }}>{c.icon || "📞"}</div>
            <div>
              <div className="contact-chip-label">{c.title}</div>
              <div className="contact-chip-value">{c.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionRichText({ data }) {
  return (
    <section className="home-section">
      <div className="site-container" style={{ maxWidth:800 }}>
        <div dangerouslySetInnerHTML={{ __html: data.content || "" }}
          style={{ lineHeight:1.8, fontSize:15, color:"var(--site-text)" }} />
      </div>
    </section>
  );
}

function SectionCTA({ data }) {
  return (
    <section className="about-cta-section">
      <div className="site-container about-cta-inner">
        <h2 className="about-cta-title">{data.heading}</h2>
        <p className="about-cta-sub">{data.subheading}</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:24, flexWrap:"wrap" }}>
          {data.btnText  && <Link to={data.btnLink  || "/products"} className="site-btn-primary">{data.btnText} <FiArrowRight /></Link>}
          {data.btn2Text && <Link to={data.btn2Link || "/contact"}  className="site-btn-secondary">{data.btn2Text}</Link>}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = "About AgroNest — India's Trusted AgriStore";
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    // Hero Animation
    gsap.from(".about-hero-label", { y: 20, opacity: 0, duration: 0.6, delay: 0.1 });
    gsap.from(".about-hero-title", { y: 30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from(".about-hero-sub", { y: 20, opacity: 0, duration: 0.8, delay: 0.4 });
    gsap.from(".about-hero-actions", { y: 20, opacity: 0, duration: 0.8, delay: 0.5 });

    // Hero background parallax — image drifts slower than scroll
    gsap.to(".about-hero", {
      backgroundPositionY: "30%",
      ease: "none",
      scrollTrigger: { trigger: ".about-hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Stats Grid
    gsap.from(".about-stat-card", {
      scrollTrigger: { trigger: ".about-stats-section", start: "top 80%" },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.15
    });

    // Mission Cards
    gsap.from(".about-mission-text", {
      scrollTrigger: { trigger: ".about-mission", start: "top 75%" },
      x: -40, opacity: 0, duration: 0.8
    });
    gsap.from(".about-mission-card", {
      scrollTrigger: { trigger: ".about-mission", start: "top 75%" },
      x: 40, opacity: 0, duration: 0.8, stagger: 0.2
    });

    // Why Us cards — scale + fade pop-in
    gsap.from(".about-whyus-card", {
      scrollTrigger: { trigger: ".about-whyus-grid", start: "top 82%" },
      y: 50, opacity: 0, scale: 0.92, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)"
    });

    // Process steps — sequential reveal with connector line draw
    gsap.from(".about-process-step", {
      scrollTrigger: { trigger: ".about-process-row", start: "top 80%" },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.18
    });
    gsap.fromTo(".about-process-connector", 
      { scaleX: 0 },
      {
        scaleX: 1, duration: 0.5, stagger: 0.18, ease: "power2.out",
        scrollTrigger: { trigger: ".about-process-row", start: "top 80%" },
      }
    );

    // Impact section — image slides in from left, text from right
    gsap.from(".about-impact-image", {
      scrollTrigger: { trigger: ".about-impact-section", start: "top 75%" },
      x: -50, opacity: 0, duration: 0.9, ease: "power3.out"
    });
    gsap.from(".about-impact-text > *", {
      scrollTrigger: { trigger: ".about-impact-section", start: "top 75%" },
      y: 30, opacity: 0, duration: 0.7, stagger: 0.1
    });
    gsap.from(".about-impact-stat", {
      scrollTrigger: { trigger: ".about-impact-stats", start: "top 85%" },
      scale: 0.85, opacity: 0, duration: 0.5, stagger: 0.12, ease: "back.out(1.5)"
    });

    // Timeline Items
    gsap.utils.toArray(".about-timeline-item").forEach(item => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: "top 85%" },
        y: 50, opacity: 0, duration: 0.7
      });
    });

    // Team Cards
    gsap.from(".about-team-card", {
      scrollTrigger: { trigger: ".about-team-grid", start: "top 80%" },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.1
    });

    // CTA
    gsap.from(".about-cta-inner", {
      scrollTrigger: { trigger: ".about-cta-section", start: "top 85%" },
      scale: 0.95, opacity: 0, duration: 0.8
    });
  }, { scope: containerRef });

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["page-about"],
    queryFn: () => pageApi.getOne("about").then(r => r.data),
    staleTime: 1000 * 60 * 5,
  });

  const sections = pageData?.sections ? pageData.sections.filter(s => s.visible !== false) : [];

  /* ── Static fallback ── */
  if (!isLoading && sections.length === 0) {
    return (
      <div className="site-root site-root-hero" ref={containerRef}>
        <Navbar />

        <section className="about-hero">
          <div className="about-hero-overlay" />
          <div className="about-hero-inner site-container">
            <div className="about-hero-label site-section-label">Our Story</div>
            <h1 className="about-hero-title">
              Growing India's Agriculture,<br />One Farm at a Time
            </h1>
            <p className="about-hero-sub">
              AgroNest was born from a simple belief — every Indian farmer deserves access to
              certified, quality agricultural inputs at fair prices, delivered fast.
            </p>
            <div className="about-hero-actions">
              <Link to="/products" className="site-btn-primary">Shop Our Range <FiArrowRight /></Link>
              <Link to="/contact"  className="site-btn-secondary">Contact Us</Link>
            </div>
          </div>
        </section>

        <section className="about-stats-section">
          <div className="site-container">
            <div className="about-stats-grid">
              {STATS.map(s => (
                <div key={s.label} className="about-stat-card">
                  <div className="about-stat-icon">{s.icon}</div>
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-mission home-section">
          <div className="site-container about-mission-inner">
            <div className="about-mission-text">
              <div className="site-section-label">Our Mission</div>
              <h2 className="site-section-heading">Empowering India's 140 Million Farming Families</h2>
              <p className="about-body-text">
                We exist to solve agriculture's most persistent problem — the gap between what farmers
                need and what they can easily access. Fake pesticides, substandard seeds, and
                exploitative middlemen cost Indian farmers billions every year.
              </p>
              <p className="about-body-text">
                AgroNest cuts through this by sourcing directly from certified manufacturers, running
                rigorous quality checks, and delivering to farms across all 28 states within 48 hours.
                No middlemen. No compromise.
              </p>
              <Link to="/products" className="site-btn-primary" style={{ marginTop:12, display:"inline-flex" }}>
                Explore Products <FiArrowRight />
              </Link>
            </div>
            <div className="about-mission-visual">
              <div className="about-mission-card">
                <div className="about-mission-card-icon">🌱</div>
                <h3>Certified Quality</h3>
                <p>Every product tested, every batch documented. ISI, NPOP & state board certifications across the catalogue.</p>
              </div>
              <div className="about-mission-card accent">
                <div className="about-mission-card-icon">🚚</div>
                <h3>48hr Delivery</h3>
                <p>8 warehouses, 500+ pin codes, next-day dispatch. Because missed planting windows cost harvests.</p>
              </div>
              <div className="about-mission-card">
                <div className="about-mission-card-icon">💬</div>
                <h3>Expert Agri Support</h3>
                <p>Toll-free helpline staffed by agronomists. Available in 12 regional languages, 7 days a week.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Farmers Choose Us ── */}
        <section className="home-section alt-bg">
          <div className="site-container">
            <div className="home-section-head center">
              <div className="site-section-label">Why AgroNest</div>
              <h2 className="site-section-heading">Why 50,000+ Farmers Choose Us</h2>
              <p className="site-section-sub">
                We built AgroNest around the things that actually matter on a farm —
                trust, timing, and transparent pricing.
              </p>
            </div>
            <div className="about-whyus-grid">
              {WHY_US.map((item) => (
                <div key={item.title} className="about-whyus-card">
                  <div className="about-whyus-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Process ── */}
        <section className="home-section">
          <div className="site-container">
            <div className="home-section-head center">
              <div className="site-section-label">How It Works</div>
              <h2 className="site-section-heading">From Lab to Land in 4 Steps</h2>
            </div>
            <div className="about-process-row">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.num} className="about-process-step">
                  <div className="about-process-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  {i < PROCESS_STEPS.length - 1 && <div className="about-process-connector" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Impact / Sustainability ── */}
        <section className="about-impact-section">
          <div className="site-container about-impact-inner">
            <div className="about-impact-image">
              <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80" alt="Sustainable farming" />
              <div className="about-impact-badge">
                <FiGlobe size={20} />
                <span>NPOP Certified Since 2021</span>
              </div>
            </div>
            <div className="about-impact-text">
              <div className="site-section-label">Our Impact</div>
              <h2 className="site-section-heading">Sustainability Isn't a Buzzword Here</h2>
              <p className="about-body-text">
                Every organic product on AgroNest is independently certified, and we actively
                guide farmers toward lower-input, higher-yield practices through our agronomist
                network — reducing chemical runoff while improving margins.
              </p>
              <div className="about-impact-stats">
                {IMPACT_STATS.map((s) => (
                  <div key={s.label} className="about-impact-stat">
                    <CountUp value={s.value} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
                    <div className="about-impact-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="home-section alt-bg">
          <div className="site-container">
            <div className="home-section-head center">
              <div className="site-section-label">Our Journey</div>
              <h2 className="site-section-heading">Building AgroNest Year by Year</h2>
            </div>
            <div className="about-timeline">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`about-timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
                  <div className="about-timeline-year">{m.year}</div>
                  <div className="about-timeline-dot" />
                  <div className="about-timeline-card">
                    <h3 className="about-timeline-title">{m.title}</h3>
                    <p className="about-timeline-desc">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="site-container">
            <div className="home-section-head center">
              <div className="site-section-label">The People</div>
              <h2 className="site-section-heading">Meet the AgroNest Team</h2>
              <p className="site-section-sub">
                A diverse team of agronomists, engineers and logistics experts united by one goal —
                making Indian agriculture more efficient and prosperous.
              </p>
            </div>
            <div className="about-team-grid">
              {TEAM.map(m => (
                <div key={m.name} className="about-team-card">
                  <div className="about-team-avatar">{m.avatar}</div>
                  <h3 className="about-team-name">{m.name}</h3>
                  <div className="about-team-role">{m.role}</div>
                  <p className="about-team-bio">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta-section">
          <div className="site-container about-cta-inner">
            <h2 className="about-cta-title">Ready to Grow More with AgroNest?</h2>
            <p className="about-cta-sub">
              Join 50,000+ farmers who trust AgroNest for certified seeds, fertilizers, and
              crop protection products delivered to their farm.
            </p>
            <div className="about-hero-actions">
              <Link to="/products" className="site-btn-primary">Start Shopping <FiArrowRight /></Link>
              <Link to="/contact"  className="site-btn-secondary">Talk to an Agronomist</Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  /* ── Dynamic layout ── */
  return (
    <div className="site-root site-root-hero" ref={containerRef}>
      <Navbar />
      {isLoading ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", color:"var(--site-primary)" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid var(--site-border)", borderTopColor:"var(--site-primary)", animation:"spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : sections.map((sec, i) => {
        switch (sec.type) {
          case "hero":         return <SectionHero        key={i} data={sec.data} />;
          case "stats":        return <SectionStats       key={i} data={sec.data} />;
          case "values":       return <SectionValues      key={i} data={sec.data} />;
          case "team":         return <SectionTeam        key={i} data={sec.data} />;
          case "faq":          return <SectionFAQ         key={i} data={sec.data} />;
          case "contact_info": return <SectionContactInfo key={i} data={sec.data} />;
          case "rich_text":    return <SectionRichText    key={i} data={sec.data} />;
          case "cta":          return <SectionCTA         key={i} data={sec.data} />;
          default:             return null;
        }
      })}
      <Footer />
    </div>
  );
}
