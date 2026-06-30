import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderApi } from '../api';
import { useCartStore, selectTotal } from '../store/cartStore';
import { inr } from '../utils/format';

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore(selectTotal);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const shipping = total >= 499 ? 0 : 49;
  const grand = total + shipping;

  const mutation = useMutation({
    mutationFn: (form) => orderApi.create({
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      notes: form.notes,
      paymentMethod: 'COD',
      items: items.map((i) => ({ product: i.product, name: i.name, price: i.price, quantity: i.quantity, image: i.image, variationWeight: i.variationWeight })),
      totalAmount: grand,
    }),
    onSuccess: (order) => {
      clear();
      toast.success('Order placed successfully!');
      navigate('/track-order', { state: { orderId: order._id } });
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Could not place order'),
  });

  if (!items.length) {
    return <div className="container section empty"><h3>Your cart is empty</h3><Link to="/shop" className="btn btn-primary">Browse Products</Link></div>;
  }

  return (
    <div className="container section">
      <h1>Checkout</h1>
      <form className="cart-grid" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <div className="cart-items" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Delivery Details</h3>
          <div className="field"><label>Full Name *</label><input {...register('name', { required: true })} />{errors.name && <small style={{ color: 'var(--red)' }}>Required</small>}</div>
          <div className="row">
            <div className="field" style={{ flex: 1 }}><label>Phone *</label><input {...register('phone', { required: true })} />{errors.phone && <small style={{ color: 'var(--red)' }}>Required</small>}</div>
            <div className="field" style={{ flex: 1 }}><label>Email</label><input type="email" {...register('email')} /></div>
          </div>
          <div className="field"><label>Address *</label><textarea rows={3} {...register('address', { required: true })} />{errors.address && <small style={{ color: 'var(--red)' }}>Required</small>}</div>
          <div className="row">
            <div className="field" style={{ flex: 1 }}><label>City</label><input {...register('city')} /></div>
            <div className="field" style={{ flex: 1 }}><label>State</label><input {...register('state')} /></div>
            <div className="field" style={{ flex: 1 }}><label>Pincode</label><input {...register('pincode')} /></div>
          </div>
          <div className="field"><label>Notes (optional)</label><textarea rows={2} {...register('notes')} /></div>
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div key={i.key} className="spread" style={{ fontSize: 14 }}>
              <span className="muted">{i.name}{i.variationWeight ? ` (${i.variationWeight})` : ''} × {i.quantity}</span>
              <span>{inr(i.price * i.quantity)}</span>
            </div>
          ))}
          <hr />
          <div className="spread"><span className="muted">Subtotal</span><span>{inr(total)}</span></div>
          <div className="spread"><span className="muted">Shipping</span><span>{shipping ? inr(shipping) : 'Free'}</span></div>
          <div className="spread"><strong>Total</strong><strong className="now">{inr(grand)}</strong></div>
          <p className="muted" style={{ fontSize: 13 }}>Payment: Cash on Delivery</p>
          <button type="submit" className="btn btn-primary btn-block" disabled={mutation.isPending}>
            {mutation.isPending ? 'Placing order…' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  );
}
