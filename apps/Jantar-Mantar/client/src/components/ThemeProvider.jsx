import { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

// Maps a settings field -> CSS custom property on :root. Changing theme values
// in the admin panel updates these live (after the settings query refetches).
const VAR_MAP = {
  colorPrimary: '--green',
  colorPrimaryDark: '--green-dark',
  colorText: '--navy',
  colorBg: '--bg',
  colorSurface: '--surface',
  colorBorder: '--border',
  colorAccent: '--red',
  radius: '--radius-lg',
  buttonRadius: '--radius',
};

// Load a Google font once per family.
function ensureFont(family) {
  if (!family || family === 'Inter') return; // Inter is the baseline default
  const id = `gf-${family.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

export default function ThemeProvider({ children }) {
  const { data: s } = useSettings();

  useEffect(() => {
    if (!s) return;
    const root = document.documentElement;
    for (const [field, cssVar] of Object.entries(VAR_MAP)) {
      if (s[field]) root.style.setProperty(cssVar, s[field]);
    }
    // Derive a soft tint of the primary for hover backgrounds.
    if (s.colorPrimary) root.style.setProperty('--green-soft', hexToSoft(s.colorPrimary));

    ensureFont(s.fontBody);
    ensureFont(s.fontHeading);
    if (s.fontBody) root.style.setProperty('--font-body', `'${s.fontBody}', system-ui, sans-serif`);
    if (s.fontHeading) root.style.setProperty('--font-heading', `'${s.fontHeading}', system-ui, sans-serif`);
  }, [s]);

  return children;
}

// 12%-opacity tint of a hex color for soft backgrounds.
function hexToSoft(hex) {
  const m = hex.replace('#', '');
  if (m.length !== 6) return 'rgba(31,157,85,.12)';
  const r = parseInt(m.slice(0, 2), 16), g = parseInt(m.slice(2, 4), 16), b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r},${g},${b},.12)`;
}
