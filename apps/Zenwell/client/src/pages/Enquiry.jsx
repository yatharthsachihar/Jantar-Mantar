import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Enquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    product: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✓ Your enquiry has been submitted. We\'ll get back to you soon!');
        setFormData({ name: '', email: '', phone: '', product: '', message: '' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <section className="enquiry-section">
      <div className="enquiry-container">
        <div className="enquiry-header">
          <h1>Get in Touch</h1>
          <p>Have questions about our products? We're here to help.</p>
        </div>

        <form onSubmit={handleSubmit} className="enquiry-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="product">Product Interest</label>
              <input
                type="text"
                id="product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="e.g., Yoga Mat, Meditation Cushion"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              placeholder="Tell us what you'd like to know..."
              required
            ></textarea>
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Send Enquiry'}
          </button>
        </form>

        <div className="enquiry-info">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p>support@zenwell.com</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>Phone</h3>
            <p>+91 7000-ZENWELL</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🕒</div>
            <h3>Response Time</h3>
            <p>Within 24 hours</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Enquiry;