import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderApi } from '../api';
import { inr } from '../utils/format';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['adm-orders-list'], queryFn: orderApi.list });

  const updMut = useMutation({
    mutationFn: ({ id, data }) => orderApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['adm-orders-list'] }); toast.success('Order updated'); },
  });

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Orders</h2>
      {isLoading ? <div className="empty">Loading…</div> : (
        <table className="adm-table">
          <thead><tr><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>{o.customerName}<br /><span className="muted" style={{ fontSize: 12 }}>{o.customerPhone}</span></td>
                <td>{o.items?.length || 0}</td>
                <td>{inr(o.totalAmount)}</td>
                <td><span className="tag grey">{o.paymentMethod}</span></td>
                <td>
                  <select value={o.status} onChange={(e) => updMut.mutate({ id: o._id, data: { status: e.target.value } })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={6} className="empty">No orders yet.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
