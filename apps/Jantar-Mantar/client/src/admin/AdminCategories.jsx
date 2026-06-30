import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoryApi } from '../api';
import { mediaUrl } from '../api/axios';
import Modal from './Modal';
import ImageUpload from './ImageUpload';

const BLANK = { name: '', icon: '', image: '', description: '', displayOrder: 0, status: 'active' };

export default function AdminCategories() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const { data: categories = [], isLoading } = useQuery({ queryKey: ['adm-categories-list'], queryFn: () => categoryApi.list({ all: true }) });
  const invalidate = () => { qc.invalidateQueries({ queryKey: ['adm-categories-list'] }); qc.invalidateQueries({ queryKey: ['categories'] }); };

  const saveMut = useMutation({
    mutationFn: (c) => (c._id ? categoryApi.update(c._id, c) : categoryApi.create(c)),
    onSuccess: () => { invalidate(); setEditing(null); toast.success('Category saved'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });
  const delMut = useMutation({
    mutationFn: (id) => categoryApi.remove(id),
    onSuccess: () => { invalidate(); toast.success('Category deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Delete failed'),
  });

  return (
    <div>
      <div className="spread" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Categories</h2>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}>+ New Category</button>
      </div>
      {isLoading ? <div className="empty">Loading…</div> : (
        <table className="adm-table">
          <thead><tr><th>Image</th><th>Name</th><th>Icon</th><th>Order</th><th>Products</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.image ? <img className="adm-thumb" src={mediaUrl(c.image)} alt="" /> : <span style={{ fontSize: 24 }}>{c.icon || '🛍️'}</span>}</td>
                <td>{c.name}</td>
                <td>{c.icon}</td>
                <td>{c.displayOrder}</td>
                <td>{c.productCount ?? 0}</td>
                <td><span className={`tag ${c.status === 'active' ? 'green' : 'grey'}`}>{c.status}</span></td>
                <td><div className="adm-actions">
                  <button className="adm-btn-sm" onClick={() => setEditing({ ...c })}>Edit</button>
                  <button className="adm-btn-sm danger" onClick={() => { if (confirm(`Delete "${c.name}"?`)) delMut.mutate(c._id); }}>Delete</button>
                </div></td>
              </tr>
            ))}
            {!categories.length && <tr><td colSpan={7} className="empty">No categories yet.</td></tr>}
          </tbody>
        </table>
      )}
      {editing && <CategoryForm category={editing} onClose={() => setEditing(null)} onSave={(c) => saveMut.mutate(c)} saving={saveMut.isPending} />}
    </div>
  );
}

function CategoryForm({ category, onClose, onSave, saving }) {
  const [form, setForm] = useState(category);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name.trim()) return toast.error('Name is required');
    onSave({ ...form, displayOrder: Number(form.displayOrder) });
  };
  return (
    <Modal title={category._id ? 'Edit Category' : 'New Category'} onClose={onClose}
      footer={<>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </>}>
      <div className="field"><label>Name *</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div className="grid2">
        <div className="field"><label>Icon / Emoji</label><input value={form.icon} onChange={(e) => set('icon', e.target.value)} placeholder="🌶️" /></div>
        <div className="field"><label>Display Order</label><input type="number" value={form.displayOrder} onChange={(e) => set('displayOrder', e.target.value)} /></div>
      </div>
      <div className="field"><label>Image</label><ImageUpload single value={form.image ? [form.image] : []} onChange={(v) => set('image', v[0] || '')} /></div>
      <div className="field"><label>Description</label><textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
      <div className="field"><label>Status</label>
        <select value={form.status} onChange={(e) => set('status', e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </div>
    </Modal>
  );
}
