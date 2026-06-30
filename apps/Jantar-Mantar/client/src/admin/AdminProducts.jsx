import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productApi, categoryApi } from '../api';
import { mediaUrl } from '../api/axios';
import { inr } from '../utils/format';
import Modal from './Modal';
import ImageUpload from './ImageUpload';

const BLANK = {
  name: '', category: '', shortDescription: '', description: '', images: [],
  price: 0, compareAtPrice: 0, rating: 0, reviewsCount: 0, sku: '', stock: 0,
  badges: [], variations: [], status: 'active',
  isBestSeller: false, isTrending: false, isNewArrival: false, isFeatured: false,
};
const FLAGS = [['isBestSeller', 'Best Seller'], ['isTrending', 'Trending'], ['isNewArrival', 'New Arrival'], ['isFeatured', 'Featured']];

export default function AdminProducts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // product object or null
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['adm-products', search],
    queryFn: () => productApi.list({ page: 1, limit: 100, search }),
  });
  const { data: categories = [] } = useQuery({ queryKey: ['adm-cats-all'], queryFn: () => categoryApi.list({ all: true }) });
  const products = data?.products || [];

  const invalidate = () => qc.invalidateQueries({ queryKey: ['adm-products'] });

  const saveMut = useMutation({
    mutationFn: (p) => (p._id ? productApi.update(p._id, p) : productApi.create(p)),
    onSuccess: () => { invalidate(); setEditing(null); toast.success('Product saved'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });
  const delMut = useMutation({
    mutationFn: (id) => productApi.remove(id),
    onSuccess: () => { invalidate(); toast.success('Product deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Delete failed'),
  });
  const flagMut = useMutation({
    mutationFn: ({ id, flags }) => productApi.setFlags(id, flags),
    onSuccess: () => invalidate(),
  });

  return (
    <div>
      <div className="spread" style={{ marginBottom: 16 }}>
        <input className="input" style={{ maxWidth: 280 }} placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK, category: categories[0]?._id || '' })}>+ New Product</button>
      </div>

      {isLoading ? <div className="empty">Loading…</div> : (
        <table className="adm-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Flags</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img className="adm-thumb" src={mediaUrl(p.images?.[0]) || 'https://placehold.co/60'} alt="" /></td>
                <td>{p.name}</td>
                <td>{p.category?.name || '—'}</td>
                <td>{inr(p.price)}</td>
                <td>{p.stock}</td>
                <td>
                  <div className="adm-actions">
                    {FLAGS.map(([k, label]) => (
                      <button key={k} title={label} className="adm-btn-sm" style={{ background: p[k] ? 'var(--green-soft)' : '#fff', color: p[k] ? 'var(--green-dark)' : 'var(--navy-soft)' }}
                        onClick={() => flagMut.mutate({ id: p._id, flags: { [k]: !p[k] } })}>{label[0]}</button>
                    ))}
                  </div>
                </td>
                <td><span className={`tag ${p.status === 'active' ? 'green' : 'grey'}`}>{p.status}</span></td>
                <td>
                  <div className="adm-actions">
                    <button className="adm-btn-sm" onClick={() => setEditing({ ...BLANK, ...p, category: p.category?._id || p.category })}>Edit</button>
                    <button className="adm-btn-sm danger" onClick={() => { if (confirm(`Delete "${p.name}"?`)) delMut.mutate(p._id); }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!products.length && <tr><td colSpan={8} className="empty">No products yet.</td></tr>}
          </tbody>
        </table>
      )}

      {editing && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={(p) => saveMut.mutate(p)}
          saving={saveMut.isPending}
        />
      )}
    </div>
  );
}

function ProductForm({ product, categories, onClose, onSave, saving }) {
  const [form, setForm] = useState(product);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addVariation = () => set('variations', [...form.variations, { weight: '', price: 0, compareAtPrice: 0, stock: 0 }]);
  const setVar = (i, k, v) => set('variations', form.variations.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
  const delVar = (i) => set('variations', form.variations.filter((_, idx) => idx !== i));

  const submit = () => {
    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.category) return toast.error('Category is required');
    onSave({
      ...form,
      price: Number(form.price), compareAtPrice: Number(form.compareAtPrice),
      rating: Number(form.rating), reviewsCount: Number(form.reviewsCount), stock: Number(form.stock),
      badges: typeof form.badges === 'string' ? form.badges.split(',').map((s) => s.trim()).filter(Boolean) : form.badges,
      variations: form.variations.map((v) => ({ ...v, price: Number(v.price), compareAtPrice: Number(v.compareAtPrice), stock: Number(v.stock) })),
    });
  };

  return (
    <Modal title={product._id ? 'Edit Product' : 'New Product'} onClose={onClose}
      footer={<>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save Product'}</button>
      </>}>
      <div className="field"><label>Name *</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div className="grid2">
        <div className="field"><label>Category *</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Select…</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field"><label>Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="field"><label>Images</label><ImageUpload value={form.images} onChange={(v) => set('images', v)} /></div>
      <div className="field"><label>Short Description</label><input value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} /></div>
      <div className="field"><label>Description</label><textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
      <div className="grid2">
        <div className="field"><label>Price (₹)</label><input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} /></div>
        <div className="field"><label>Compare-at / MRP (₹)</label><input type="number" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} /></div>
      </div>
      <div className="grid2">
        <div className="field"><label>Rating (0-5)</label><input type="number" step="0.1" value={form.rating} onChange={(e) => set('rating', e.target.value)} /></div>
        <div className="field"><label>Reviews Count</label><input type="number" value={form.reviewsCount} onChange={(e) => set('reviewsCount', e.target.value)} /></div>
      </div>
      <div className="grid2">
        <div className="field"><label>SKU</label><input value={form.sku} onChange={(e) => set('sku', e.target.value)} /></div>
        <div className="field"><label>Stock</label><input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></div>
      </div>
      <div className="field"><label>Badges (comma separated)</label>
        <input value={Array.isArray(form.badges) ? form.badges.join(', ') : form.badges} onChange={(e) => set('badges', e.target.value)} />
      </div>

      <div className="field"><label>Collection Flags</label>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          {FLAGS.map(([k, label]) => (
            <button key={k} type="button" className={`pill ${form[k] ? 'active' : ''}`} onClick={() => set(k, !form[k])}>{label}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <div className="spread"><label>Variants (weights)</label><button type="button" className="adm-btn-sm" onClick={addVariation}>+ Add</button></div>
        {form.variations.map((v, i) => (
          <div className="row" key={i} style={{ marginBottom: 8, alignItems: 'center' }}>
            <input placeholder="250g" value={v.weight} onChange={(e) => setVar(i, 'weight', e.target.value)} />
            <input type="number" placeholder="Price" value={v.price} onChange={(e) => setVar(i, 'price', e.target.value)} />
            <input type="number" placeholder="MRP" value={v.compareAtPrice} onChange={(e) => setVar(i, 'compareAtPrice', e.target.value)} />
            <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => setVar(i, 'stock', e.target.value)} />
            <button type="button" className="adm-btn-sm danger" onClick={() => delVar(i)}>✕</button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
