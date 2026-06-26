import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiYoutube, FiTwitter, FiLinkedin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa"; // Importing FaWhatsapp for the whatsapp icon
import { useSettings } from "../../context/SettingsContext";
import { mediaUrl } from "../../api/axios";
import logo from "/uploads/LOGO.png";
import "./Footer.css";

const BRAND_LINKS = [
  { label: "About us",    to: "/about" },
  { label: "Shop",        to: "/products" },
  { label: "Categories",  to: "/categories" },
  { label: "Blog",        to: "/blog" },
  { label: "Contact",     to: "/contact" },
];

const USEFUL_LINKS = [
  { label: "Privacy policy",   to: "/policies/privacy" },
  { label: "Terms of service", to: "/policies/terms" },
  { label: "Shipping info",    to: "/policies/shipping" },
  { label: "Track order",      to: "/account/orders" },
  { label: "Wishlist",         to: "/account/wishlist" },
  { label: "My account",       to: "/account" },
];

// Map each settings key → its react-icon component
const SOCIAL_ICONS = {
  socialFacebook:  { icon: <FiFacebook />,  label: "Facebook",  color: "#1877F2" },
  socialInstagram: { icon: <FiInstagram />, label: "Instagram", color: "#E4405F" },
  socialWhatsapp:  { icon: <FaWhatsapp />,  label: "WhatsApp",  color: "#25D366" },
  socialYoutube:   { icon: <FiYoutube />,   label: "YouTube",   color: "#FF0000" },
  socialLinkedin:  { icon: <FiLinkedin />,  label: "LinkedIn",  color: "#0A66C2" },
  socialTwitter:   { icon: <FiTwitter />,   label: "Twitter",   color: "#1DA1F2" },
};

export default function Footer() {
  const { settings } = useSettings();

  const name    = settings.storeName    || "Axiom Seeds";
  const tagline = settings.footerTagline || settings.tagline || "The Ancient Remedy brings time-tested natural ingredients into everyday wellness with care, purity, and simplicity.";
  
  const brandLinks = settings.footerCompanyLinks?.length ? settings.footerCompanyLinks : BRAND_LINKS;
  const usefulLinks = settings.footerSupportLinks?.length ? settings.footerSupportLinks : USEFUL_LINKS;
  const copyright = settings.footerCopyright || `© ${new Date().getFullYear()} ${name} Pvt. Ltd. All rights reserved.`;

  const getSocialUrl = (key) => {
    return settings[key] || (settings.socialLinks && settings.socialLinks[key.replace('social', '').toLowerCase()]);
  };

  // Only render social links where admin has entered a URL
  const activeSocials = Object.entries(SOCIAL_ICONS).filter(([key]) => !!getSocialUrl(key));

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">

        {/* ── Top Center Brand Area ── */}
        <div className="site-footer-brand">
          <div className="site-footer-logo" style={{ position: "relative", left: `${settings.footerLogoXOffset || 0}px` }}>
            <img src={settings.storeLogo ? mediaUrl(settings.storeLogo) : logo} alt={name}
              style={{ height: `${settings.footerLogoHeight || 150}px`, width: "auto", objectFit: "contain" }}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = logo; }} />
          </div>

          <div className="site-footer-script">
            Stay radiant
          </div>

          <h2 className="site-footer-giant-heading">
            RITUAL-LED BOTANICAL CARE FOR MODERN LIVING
          </h2>

          <p className="site-footer-desc">
            {tagline}
          </p>
        </div>

        <div className="site-footer-divider"></div>

        {/* ── Links Grid ── */}
        <div className="site-footer-grid">
          {/* BRAND */}
          <div>
            <div className="site-footer-col-head">BRAND</div>
            <ul className="site-footer-links">
              {brandLinks.map((l, idx) => (
                <li key={`${l.label}-${l.href || l.to}-${idx}`}><Link to={l.href || l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* USEFUL LINKS */}
          <div>
            <div className="site-footer-col-head">USEFUL LINKS</div>
            <ul className="site-footer-links">
              {usefulLinks.map((l, idx) => (
                <li key={`${l.label}-${l.href || l.to}-${idx}`}><Link to={l.href || l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Follow Us ── */}
        <div className="site-footer-follow">
          <div className="site-footer-follow-head">FOLLOW US</div>
          {activeSocials.length > 0 && (
            <div className="site-footer-socials-wrapper">
              <div className="site-footer-socials">
                {activeSocials.map(([key, { icon, label, color }]) => (
                  <a key={key} href={getSocialUrl(key)} target="_blank" rel="noopener noreferrer"
                    className="site-footer-social" aria-label={label}
                    style={{ color: color }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
}
