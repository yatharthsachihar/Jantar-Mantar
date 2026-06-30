import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import Modal from './Modal';

const ROLES = ['super_admin', 'admin', 'editor', 'support', 'viewer'];
const BLANK = { name: '', email: '', password: '', role: 'editor', isActive: true };

export default function AdminUsers() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const { data: users = [], isLoading } = useQuery({ queryKey: ['adm-users'], queryFn: authApi.listUsers });
  const invalidate = () => qc.invalidateQueries({ queryKey: ['adm-users'] });

  const saveMut = useMutation({
    mutationFn: (u) => (u._id ? authApi.updateUser(u._id, u) : authApi.createUser(u)),
    onSuccess: () => { invalidate(); setEditing(null); toast.success('User saved'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });
  const delMut = useMutation({
    mutationFn: (id) => authApi.deleteUser(id),
    onSuccess: () => { invalidate(); toast.success('User deleted'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Delete failed'),
  });

  return (
    <div>
      <div className="spread" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Users</h2>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}>+ New User</button>
      </div>
      {isLoading ? <div className="empty">Loading…</div> : (
        <table className="adm-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td>
                <td><span className="tag grey">{u.role}</span></td>
                <td><span className={`tag ${u.isActive ? 'green' : 'grey'}`}>{u.isActive ? 'Yes' : 'No'}</span></td>
                <td><div className="adm-actions">
                  <button className="adm-btn-sm" onClick={() => setEditing({ ...u, password: '' })}>Edit</button>
                  <button className="adm-btn-sm danger" onClick={() => { if (confirm(`Delete ${u.name}?`)) delMut.mutate(u._id); }}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editing && <UserForm user={editing} onClose={() => setEditing(null)} onSave={(u) => saveMut.mutate(u)} saving={saveMut.isPending} />}
    </div>
  );
}

function UserForm({ user, onClose, onSave, saving }) {
  const [form, setForm] = useState(user);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email required');
    if (!form._id && !form.password) return toast.error('Password required for new users');
    onSave(form);
  };
  return (
    <Modal title={user._id ? 'Edit User' : 'New User'} onClose={onClose}
      footer={<>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </>}>
      <div className="field"><label>Name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div className="field"><label>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
      <div className="field"><label>Password {user._id && '(leave blank to keep)'}</label><input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} /></div>
      <div className="grid2">
        <div className="field"><label>Role</label>
          <select value={form.role} onChange={(e) => set('role', e.target.value)}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select>
        </div>
        <div className="field"><label>Active</label>
          <label className="switch"><input type="checkbox" checked={!!form.isActive} onChange={(e) => set('isActive', e.target.checked)} /><span /></label>
        </div>
      </div>
    </Modal>
  );
}
