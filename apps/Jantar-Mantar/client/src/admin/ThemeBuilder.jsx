import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '../api';

const COLORS = [
  ['colorPrimary', 'Primary / CTA'],
  ['colorPrimaryDark', 'Primary (hover)'],
  ['colorAccent', 'Accent / Sale'],
  ['colorText', 'Text'],
  ['colorBg', 'Background'],
  ['colorSurface', 'Surface'],
  ['colorBorder', 'Border'],
];

const FONTS = ['Inter', 'Poppins', 'Montserrat', 'Lato', 'Roboto', 'Nunito Sans', 'Work Sans', 'Playfair Display', 'DM Sans', 'Manrope'];

const PRESETS = {
  'Sagat Green': { colorPrimary: '#1f9d55', colorPrimaryDark: '#178045', colorAccent: '#e3342f', fontBody: 'Inter', fontHeading: 'Inter' },
  'Saffron': { colorPrimary: '#e0681a', colorPrimaryDark: '#b9540f', colorAccent: '#c81e1e', fontBody: 'Poppins', fontHeading: 'Poppins' },
  'Royal Purple': { colorPrimary: '#6d28d9', colorPrimaryDark: '#5b21b6', colorAccent: '#db2777', fontBody: 'DM Sans', fontHeading: 'Playfair Display' },
  'Midnight': { colorPrimary: '#2563eb', colorPrimaryDark: '#1d4ed8', colorAccent: '#f59e0b', fontBody: 'Manrope', fontHeading: 'Manrope' },
};

export default function ThemeBuilder() {
  const { data } = useQuery({ queryKey: ['adm-theme'], queryFn: settingsApi.get });
  if (!data) return <div className="empty">Loading…</div>;
  return <ThemeForm initial={data} />;
}

function ThemeForm({ initial }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const saveMut = useMutation({
    mutationFn: (payload) => settingsApi.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      qc.invalidateQueries({ queryKey: ['adm-theme'] });
      toast.success('Theme saved — open the storefront to see it live');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const applyPreset = (name) => setForm((f) => ({ ...f, ...PRESETS[name] }));

  return (
    <div style={{ maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="spread">
        <div><h2 style={{ margin: 0 }}>Theme Builder</h2><p className="muted">Colours, fonts and shape for the storefront.</p></div>
        <button className="btn btn-primary" onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending}>
          {saveMut.isPending ? 'Saving…' : 'Save Theme'}
        </button>
      </div>

      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Presets</h3>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          {Object.keys(PRESETS).map((name) => (
            <button key={name} type="button" className="pill" onClick={() => applyPreset(name)}>{name}</button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Colours</h3>
        <div className="grid2">
          {COLORS.map(([key, label]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <div className="row" style={{ alignItems: 'center' }}>
                <input type="color" value={form[key] || '#000000'} onChange={(e) => set(key, e.target.value)}
                  style={{ width: 46, height: 38, padding: 2, borderRadius: 8 }} />
                <input value={form[key] || ''} onChange={(e) => set(key, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Typography</h3>
        <div className="grid2">
          <div className="field"><label>Body Font</label>
            <select value={form.fontBody || 'Inter'} onChange={(e) => set('fontBody', e.target.value)}>
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="field"><label>Heading Font</label>
            <select value={form.fontHeading || 'Inter'} onChange={(e) => set('fontHeading', e.target.value)}>
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Shape</h3>
        <div className="grid2">
          <div className="field"><label>Card Radius (e.g. 20px)</label><input value={form.radius || ''} onChange={(e) => set('radius', e.target.value)} /></div>
          <div className="field"><label>Button Radius (e.g. 14px)</label><input value={form.buttonRadius || ''} onChange={(e) => set('buttonRadius', e.target.value)} /></div>
        </div>
      </div>

      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Live Preview</h3>
        <div style={{
          border: `1px solid ${form.colorBorder}`, borderRadius: form.radius, padding: 18,
          background: form.colorBg, color: form.colorText, fontFamily: `'${form.fontBody}', sans-serif`,
        }}>
          <div style={{ fontFamily: `'${form.fontHeading}', sans-serif`, fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Sample Heading</div>
          <p style={{ marginTop: 0 }}>This is how body copy looks on your storefront.</p>
          <div className="row">
            <button style={{ background: form.colorPrimary, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: form.buttonRadius, fontWeight: 600 }}>Add to Cart</button>
            <span style={{ background: form.colorAccent, color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700, alignSelf: 'center' }}>30% OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
