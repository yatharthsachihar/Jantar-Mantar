import { useSettings } from '../hooks/useSettings';

export default function About() {
  const { data: s } = useSettings();
  return (
    <div className="container section" style={{ maxWidth: 820 }}>
      <h1>About {s?.storeName || 'Jantar-Mantar'}</h1>
      <p className="muted">{s?.tagline}</p>
      <p>{s?.footerAbout || 'We bring you pure, authentic spices, dry fruits and herbal powders sourced directly from trusted farms. Every product is selected for freshness, aroma and natural goodness — packed to preserve quality from our shelf to your kitchen.'}</p>
      <p>Our mission is simple: make wholesome, honest pantry staples accessible to every home. No fillers, no shortcuts — just real ingredients you can trust.</p>
    </div>
  );
}
