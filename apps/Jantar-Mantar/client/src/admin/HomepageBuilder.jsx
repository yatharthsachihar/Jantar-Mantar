import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsApi } from '../api';

const SOURCES = [
  { value: 'isBestSeller', label: 'Best Sellers' },
  { value: 'isTrending', label: 'Trending' },
  { value: 'isNewArrival', label: 'New Arrivals' },
  { value: 'isFeatured', label: 'Featured' },
];

export default function HomepageBuilder() {
  const { data } = useQuery({ queryKey: ['adm-settings'], queryFn: settingsApi.get });
  if (!data) return <div className="empty">Loading…</div>;
  return <BuilderForm initial={data} />;
}

function BuilderForm({ initial }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(initial);

  const saveMut = useMutation({
    mutationFn: (payload) => settingsApi.update(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); qc.invalidateQueries({ queryKey: ['adm-settings'] }); toast.success('Saved'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sections = form.homeSections || [];
  const setSection = (i, k, v) => set('homeSections', sections.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));
  const addSection = () => set('homeSections', [...sections, { key: `section-${Date.now()}`, title: 'New Section', subtitle: '', source: 'isFeatured', visible: true, order: sections.length }]);
  const delSection = (i) => set('homeSections', sections.filter((_, idx) => idx !== i));

  const nav = form.navItems || [];
  const setNav = (i, k, v) => set('navItems', nav.map((n, idx) => (idx === i ? { ...n, [k]: v } : n)));
  const addNav = () => set('navItems', [...nav, { label: 'New', to: '/' }]);
  const delNav = (i) => set('navItems', nav.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 820 }}>
      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Store Identity</h3>
        <div className="grid2">
          <div className="field"><label>Store Name</label><input value={form.storeName || ''} onChange={(e) => set('storeName', e.target.value)} /></div>
          <div className="field"><label>Tagline</label><input value={form.tagline || ''} onChange={(e) => set('tagline', e.target.value)} /></div>
        </div>
        <div className="grid2">
          <div className="field"><label>Announcement Bar</label><input value={form.announcementBar || ''} onChange={(e) => set('announcementBar', e.target.value)} /></div>
          <div className="field"><label>Announcement Active</label>
            <label className="switch"><input type="checkbox" checked={!!form.announcementActive} onChange={(e) => set('announcementActive', e.target.checked)} /><span /></label>
          </div>
        </div>
        <div className="row" style={{ gap: 24, flexWrap: 'wrap' }}>
          <label className="row" style={{ alignItems: 'center' }}><span>Show Category Row</span>
            <label className="switch"><input type="checkbox" checked={form.showCategoryRow !== false} onChange={(e) => set('showCategoryRow', e.target.checked)} /><span /></label>
          </label>
          <label className="row" style={{ alignItems: 'center' }}><span>Show Top Categories</span>
            <label className="switch"><input type="checkbox" checked={form.showTopCategories !== false} onChange={(e) => set('showTopCategories', e.target.checked)} /><span /></label>
          </label>
        </div>
      </div>

      <div className="adm-card">
        <div className="spread"><h3 style={{ margin: 0 }}>Homepage Sections</h3><button className="adm-btn-sm" onClick={addSection}>+ Add Section</button></div>
        {sections.map((s, i) => (
          <div key={i} className="adm-card" style={{ marginTop: 12, background: 'var(--surface)' }}>
            <div className="grid2">
              <div className="field"><label>Title</label><input value={s.title} onChange={(e) => setSection(i, 'title', e.target.value)} /></div>
              <div className="field"><label>Subtitle</label><input value={s.subtitle} onChange={(e) => setSection(i, 'subtitle', e.target.value)} /></div>
            </div>
            <div className="grid2">
              <div className="field"><label>Product Source</label>
                <select value={s.source} onChange={(e) => setSection(i, 'source', e.target.value)}>
                  {SOURCES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="field"><label>Order</label><input type="number" value={s.order} onChange={(e) => setSection(i, 'order', Number(e.target.value))} /></div>
            </div>
            <div className="spread">
              <label className="row" style={{ alignItems: 'center' }}><span>Visible</span>
                <label className="switch"><input type="checkbox" checked={s.visible} onChange={(e) => setSection(i, 'visible', e.target.checked)} /><span /></label>
              </label>
              <button className="adm-btn-sm danger" onClick={() => delSection(i)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <div className="spread"><h3 style={{ margin: 0 }}>Header Navigation</h3><button className="adm-btn-sm" onClick={addNav}>+ Add Link</button></div>
        {nav.map((n, i) => (
          <div className="row" key={i} style={{ marginTop: 10, alignItems: 'center' }}>
            <input placeholder="Label" value={n.label} onChange={(e) => setNav(i, 'label', e.target.value)} />
            <input placeholder="/path" value={n.to} onChange={(e) => setNav(i, 'to', e.target.value)} />
            <button className="adm-btn-sm danger" onClick={() => delNav(i)}>✕</button>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <h3 style={{ marginTop: 0 }}>Footer</h3>
        <div className="field"><label>About Text</label><textarea rows={2} value={form.footerAbout || ''} onChange={(e) => set('footerAbout', e.target.value)} /></div>
        <div className="field"><label>Copyright Text</label><input value={form.footerText || ''} onChange={(e) => set('footerText', e.target.value)} /></div>
        <div className="grid2">
          <div className="field"><label>Phone</label><input value={form.storePhone || ''} onChange={(e) => set('storePhone', e.target.value)} /></div>
          <div className="field"><label>Email</label><input value={form.storeEmail || ''} onChange={(e) => set('storeEmail', e.target.value)} /></div>
        </div>
        <div className="field"><label>Address</label><input value={form.storeAddress || ''} onChange={(e) => set('storeAddress', e.target.value)} /></div>
      </div>

      <div>
        <button className="btn btn-primary" onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending}>
          {saveMut.isPending ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
