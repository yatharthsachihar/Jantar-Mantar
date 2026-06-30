import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { roleApi } from '../api';

const ROLES = ['super_admin', 'admin', 'editor', 'support', 'viewer'];
const LEVELS = ['full', 'view', 'none'];

export default function AdminRoles() {
  const { data } = useQuery({ queryKey: ['adm-roles'], queryFn: roleApi.get });
  if (!data) return <div className="empty">Loading…</div>;
  return <RolesEditor initial={data} />;
}

function RolesEditor({ initial }) {
  const qc = useQueryClient();
  const [matrix, setMatrix] = useState(initial);

  const saveMut = useMutation({
    mutationFn: (m) => roleApi.update(m),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['adm-roles'] }); toast.success('Roles updated'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const setLevel = (mi, role, level) =>
    setMatrix(matrix.map((m, i) => (i === mi ? { ...m, permissions: { ...m.permissions, [role]: level } } : m)));

  return (
    <div>
      <div className="spread" style={{ marginBottom: 16 }}>
        <div><h2 style={{ margin: 0 }}>Roles & Permissions</h2><p className="muted">Controls write access per module. super_admin always has full access.</p></div>
        <button className="btn btn-primary" onClick={() => saveMut.mutate(matrix)} disabled={saveMut.isPending}>{saveMut.isPending ? 'Saving…' : 'Save'}</button>
      </div>
      <table className="adm-table">
        <thead><tr><th>Module</th>{ROLES.map((r) => <th key={r}>{r}</th>)}</tr></thead>
        <tbody>
          {matrix.map((m, mi) => (
            <tr key={m.key}>
              <td><strong>{m.label}</strong></td>
              {ROLES.map((r) => (
                <td key={r}>
                  <select value={m.permissions?.[r] || 'none'} disabled={r === 'super_admin'} onChange={(e) => setLevel(mi, r, e.target.value)}>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
