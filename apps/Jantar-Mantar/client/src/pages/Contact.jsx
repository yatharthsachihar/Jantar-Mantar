import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
  const { data: s } = useSettings();
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = () => { toast.success('Thanks! We will get back to you soon.'); reset(); };

  return (
    <div className="container section cart-grid">
      <form className="cart-items" style={{ padding: 18 }} onSubmit={handleSubmit(onSubmit)}>
        <h1 style={{ marginTop: 0 }}>Contact Us</h1>
        <p className="muted">Have a question about an order or a product? Send us a message.</p>
        <div className="field"><label>Name</label><input {...register('name', { required: true })} /></div>
        <div className="field"><label>Email</label><input type="email" {...register('email', { required: true })} /></div>
        <div className="field"><label>Message</label><textarea rows={4} {...register('message', { required: true })} /></div>
        <button className="btn btn-primary">Send Message</button>
      </form>
      <aside className="cart-summary">
        <h3>Reach Us</h3>
        {s?.storePhone && <p className="muted">📞 {s.storePhone}</p>}
        {s?.storeEmail && <p className="muted">✉️ {s.storeEmail}</p>}
        {s?.storeAddress && <p className="muted">📍 {s.storeAddress}</p>}
        {!s?.storePhone && !s?.storeEmail && <p className="muted">Contact details coming soon.</p>}
      </aside>
    </div>
  );
}
