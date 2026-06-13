import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">✦ Your Wellness Journey</p>
          <h1>Find balance.<br />Live well.</h1>
          <p className="hero-text">
            Thoughtfully crafted yoga and meditation essentials to help you slow down, breathe deeper, and create a more mindful life.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="primary-button">Explore Products →</Link>
            <Link to="/enquiry" className="secondary-button">💬 Ask a Question</Link>
          </div>
          <div className="hero-badges">
            <div className="hero-badge">🧘 Mindful Living <span>Curated for peace</span></div>
            <div className="hero-badge">🌿 Sustainable <span>Eco-friendly choices</span></div>
            <div className="hero-badge">✓ Trusted Quality <span>Loved by thousands</span></div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stat-item"><span>🪷</span><strong>10K+</strong><p>Happy Customers</p></div>
        <div className="stat-item"><span>🌿</span><strong>100%</strong><p>Natural & Safe</p></div>
        <div className="stat-item"><span>⭐</span><strong>4.9</strong><p>Average Rating</p></div>
        <div className="stat-item"><span>🌍</span><strong>50+</strong><p>Products</p></div>
      </section>

      <section className="home-feature-section">
        <div className="feature-card">
          <span className="feature-num">01</span>
          <h3>Yoga Comfort</h3>
          <p>Soft mats, blocks, and support tools for daily movement.</p>
        </div>
        <div className="feature-card">
          <span className="feature-num">02</span>
          <h3>Meditation Focus</h3>
          <p>Cushions, bells, and calm accessories for deeper stillness.</p>
        </div>
        <div className="feature-card">
          <span className="feature-num">03</span>
          <h3>Natural Products</h3>
          <p>Herbal remedies and organic essentials for healthier living.</p>
        </div>
      </section>

      <section className="home-about">
        <div className="about-container">
          <div className="about-content">
            <h2>The ZenWell Story</h2>
            <p>Founded in 2020, ZenWell emerged from a simple belief: true wellness requires authentic products that honor both your practice and our planet.</p>
            <p>Today, our collection spans yoga essentials, herbal supplements, meditation tools, and natural remedies—each carefully selected to support your daily ritual.</p>
            <p>Our mission: make mindful living accessible. Whether you're starting your first yoga class or deepening a lifelong practice, ZenWell is here.</p>
          </div>
          <div className="about-stats">
            <div className="stat">
              <h3>10K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat">
              <h3>5+</h3>
              <p>Curated Products</p>
            </div>
            <div className="stat">
              <h3>100%</h3>
              <p>Natural & Organic</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <h2>Why ZenWell Customers Choose Us</h2>
        <div className="benefits-grid">
          <div className="benefit-card"><div className="benefit-icon">🌱</div><h3>Sourced with Care</h3><p>Every product is sourced from certified organic farms and ethical suppliers.</p></div>
          <div className="benefit-card"><div className="benefit-icon">✓</div><h3>Quality Tested</h3><p>Third-party lab tested for purity, potency, and safety.</p></div>
          <div className="benefit-card"><div className="benefit-icon">♻️</div><h3>Eco-Conscious</h3><p>Sustainable packaging, minimal waste, and carbon-neutral shipping.</p></div>
          <div className="benefit-card"><div className="benefit-icon">🤝</div><h3>Community Driven</h3><p>Join thousands of yoga practitioners and wellness seekers.</p></div>
        </div>
      </section>

      <section className="home-categories">
        <h2>Explore Our Collections</h2>
        <div className="categories-grid">
          <div className="category-showcase"><h3>Yoga & Movement</h3><p>Premium mats, blocks, straps, and props for every level.</p><Link to="/products" className="category-link">Shop Yoga →</Link></div>
          <div className="category-showcase"><h3>Meditation & Calm</h3><p>Singing bowls, incense, and bells for your sacred space.</p><Link to="/products" className="category-link">Shop Meditation →</Link></div>
          <div className="category-showcase"><h3>Herbal & Wellness</h3><p>Organic supplements, oils, and natural remedies.</p><Link to="/products" className="category-link">Shop Wellness →</Link></div>
        </div>
      </section>

      <section className="home-testimonials">
        <h2>Trusted by Wellness Seekers</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card"><p className="stars">★★★★★</p><p className="quote">"The yoga mat quality is exceptional. It's transformed my home practice."</p><p className="author">— Priya M., Yoga Instructor</p></div>
          <div className="testimonial-card"><p className="stars">★★★★★</p><p className="quote">"Best meditation cushion I've tried. Highly recommend to anyone serious about their practice."</p><p className="author">— Raj K., Meditation Practitioner</p></div>
          <div className="testimonial-card"><p className="stars">★★★★★</p><p className="quote">"The ashwagandha powder is pure and potent. ZenWell is my go-to wellness brand."</p><p className="author">— Amit S., Wellness Enthusiast</p></div>
        </div>
      </section>

      <section className="home-newsletter">
        <h2>Join the ZenWell Community</h2>
        <p>Get wellness tips, product updates, and exclusive offers.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button className="primary-button">Subscribe</button>
        </div>
      </section>
    </>
  );
}

export default Home;