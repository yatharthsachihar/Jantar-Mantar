import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';

export default function AdminLogin() {
  const { register, handleSubmit } = useForm({ defaultValues: { email: 'admin@jantar-mantar.com', password: '' } });
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setSession(data.token, data.admin);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Login failed'),
  });

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <h1>Admin Login</h1>
        <p>Sign in to manage Jantar-Mantar</p>
        <div className="field"><label>Email</label><input type="email" {...register('email', { required: true })} /></div>
        <div className="field"><label>Password</label><input type="password" {...register('password', { required: true })} /></div>
        <button className="btn btn-primary btn-block" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
