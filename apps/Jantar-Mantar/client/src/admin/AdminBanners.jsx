import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bannerApi } from '../api';
import { mediaUrl } from '../api/axios';
import Modal from './Modal';
import ImageUpload from './ImageUpload';

const BLANK = { title: '', subtitle: '', image: '', mobileImage: '', link: '/shop', badge: '', ctaText: 'Shop Now', displayOrder: 0, status: 'active' };

export default function AdminBanners() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const { data: banners = [], isLoading } = useQuery({ queryKey: ['adm-banners-list'], queryFn: () => bannerApi.list({ all: true }) });
  const invalidate = () => { qc.invalidateQueries({ queryKey: ['adm-banners-list'] }); qc.invalidateQueries({ queryKey: ['banners'] }); };

  const saveMut = useMutation({
    mutationFn: (b) => (b._id ? bannerApi.update(b._id, b) : bannerApi.create(b)),
    onSuccess: () => { invalidate(); setEditing(null); toast.success('Banner saved'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });
  const delMut = useMutation({
    mutationFn: (id) => bannerApi.remove(id),
    onSuccess: () => { invalidate(); toast.success('Banner deleted'); },
  });

  return (
    <div>
      <div className="spread" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Banners</h2>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}>+ New Banner</button>
      </div>
      {isLoading ? <div className="empty">Loading…</div> : (
        <table className="adm-table">
          <thead><tr><th>Image</th><th>Title</th><th>Badge</th><th>Order</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b._id}>
                <td><img className="adm-thumb" style={{ width: 80, height: 44 }} src={mediaUrl(b.image) || 'https://placehold.co/80x44'} alt="" /></td>
                <td>{b.title}</td><td>{b.badge}</td><td>{b.displayOrder}</td>
                <td><span className={`tag ${b.status === 'active' ? 'green' : 'grey'}`}>{b.status}</span></td>
                <td><div className="adm-actions">
                  <button className="adm-btn-sm" onClick={() => setEditing({ ...b })}>Edit</button>
                  <button className="adm-btn-sm danger" onClick={() => { if (confirm('Delete banner?')) delMut.mutate(b._id); }}>Delete</button>
                </div></td>
              </tr>
            ))}
            {!banners.length && <tr><td colSpan={6} className="empty">No banners yet.</td></tr>}
          </tbody>
        </table>
      )}
      {editing && <BannerForm banner={editing} onClose={() => setEditing(null)} onSave={(b) => saveMut.mutate(b)} saving={saveMut.isPending} />}
    </div>
  );
}

function BannerForm({ banner, onClose, onSave, saving }) {
  const [form, setForm] = useState(banner);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.title.trim()) return toast.error('Title is required');
    onSave({ ...form, displayOrder: Number(form.displayOrder) });
  };
  return (
    <Modal title={banner._id ? 'Edit Banner' : 'New Banner'} onClose={onClose}
      footer={<>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </>}>
      <div className="field"><label>Title *</label><input value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
      <div className="field"><label>Subtitle</label><input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></div>
      <div className="field"><label>Desktop Image</label><ImageUpload single value={form.image ? [form.image] : []} onChange={(v) => set('image', v[0] || '')} /></div>
      <div className="field"><label>Mobile Image (optional)</label><ImageUpload single value={form.mobileImage ? [form.mobileImage] : []} onChange={(v) => set('mobileImage', v[0] || '')} /></div>
      <div className="grid2">
        <div className="field"><label>Badge</label><input value={form.badge} onChange={(e) => set('badge', e.target.value)} /></div>
        <div className="field"><label>CTA Text</label><input value={form.ctaText} onChange={(e) => set('ctaText', e.target.value)} /></div>
      </div>
      <div className="grid2">
        <div className="field"><label>Link</label><input value={form.link} onChange={(e) => set('link', e.target.value)} /></div>
        <div className="field"><label>Display Order</label><input type="number" value={form.displayOrder} onChange={(e) => set('displayOrder', e.target.value)} /></div>
      </div>
      <div className="field"><label>Status</label>
        <select value={form.status} onChange={(e) => set('status', e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>
    </Modal>
  );
}
