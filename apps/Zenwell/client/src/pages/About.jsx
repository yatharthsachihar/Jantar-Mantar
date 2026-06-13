function About() {
  return (
    <>
      <section className="about-hero-large">
        <div className="about-hero-content">
          <p className="about-eyebrow">✦ ABOUT ZENWELL</p>
          <h1>Rooted in mindfulness.<br /><span className="green-text">Built for well-being.</span></h1>
          <p className="about-hero-text">
            At ZenWell, we believe wellness is a way of life. Our mission is to bring you thoughtfully crafted yoga and meditation essentials that help you slow down, breathe deeper, and reconnect with yourself.
          </p>

          <div className="about-features">
            <div className="about-feature">
              <div className="feature-icon">🌿</div>
              <h4>Mindful by design</h4>
              <p>Every product is chosen with intention.</p>
            </div>
            <div className="about-feature">
              <div className="feature-icon">❤️</div>
              <h4>Trusted quality</h4>
              <p>We partner with brands that value purity and purpose.</p>
            </div>
            <div className="about-feature">
              <div className="feature-icon">🌱</div>
              <h4>Sustainable always</h4>
              <p>Eco-friendly choices for a better tomorrow.</p>
            </div>
          </div>
        </div>

        <div className="about-hero-image">
          <div className="image-box">
            <img src="https://cdn.pixabay.com/photo/2024/06/21/07/46/yoga-8843808_1280.jpg" alt="Yoga setup" />
          </div>
          <div className="stats-overlay">
            <div className="stat-card">
              <span className="stat-icon">🪷</span>
              <strong>10K+</strong>
              <p>Happy Customers</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <strong>4.9/5</strong>
              <p>Average Rating</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🌍</span>
              <strong>5+</strong>
              <p>Premium Products</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <h2>Our Values</h2>
        <p className="values-subtitle">Simple principles that guide everything we do.</p>
        
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🪴</div>
            <h3>Authenticity</h3>
            <p>We stay true to what works—simple, natural, and effective.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🧘</div>
            <h3>Mindfulness</h3>
            <p>We promote products and practices that bring presence to everyday life.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h3>Compassion</h3>
            <p>We care for our customers, communities, and the planet we share.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🛡️</div>
            <h3>Quality</h3>
            <p>We never compromise on materials, craftsmanship, or safety.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⚖️</div>
            <h3>Balance</h3>
            <p>We believe in balance—in your routine, your space, and your life.</p>
          </div>
        </div>

        <div className="values-leaf">🌿</div>
      </section>

      <section className="about-cta-section">
        <div className="container">
          <h2>Ready to start your wellness journey?</h2>
          <p>Join thousands of customers who've transformed their daily practice with ZenWell.</p>
          <a href="/products" className="primary-button">Explore Products</a>
        </div>
      </section>
    </>
  );
}

export default About;