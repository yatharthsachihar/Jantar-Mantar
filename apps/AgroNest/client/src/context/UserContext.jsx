import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAuthApi } from '../api/authApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Rehydrate session on mount
  useEffect(() => {
    const token = localStorage.getItem('agronest_user_token');
    if (!token) { setLoading(false); return; }
    userAuthApi.me()
      .then(res => {
        if (res.data && res.data.isActive === false) {
          localStorage.removeItem('agronest_user_token');
          setUser(null);
          navigate('/deactivated', { replace: true });
        } else {
          setUser(res.data);
        }
      })
      .catch((err) => {
        localStorage.removeItem('agronest_user_token');
        setUser(null);
        if (err?.response?.status === 403) {
          navigate('/deactivated', { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // Poll server every 5 seconds to ensure immediate deactivation if admin changes status
  useEffect(() => {
    if (!user) return; // only poll if logged in

    const interval = setInterval(() => {
      userAuthApi.status()
        .then(res => {
          if (res.data && res.data.isActive === false) {
            logout();
            navigate('/deactivated', { replace: true });
          }
        })
        .catch(err => {
          if (err?.response?.status === 403) {
            logout();
            navigate('/deactivated', { replace: true });
          }
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  // Listen for global axios 403 intercepts
  useEffect(() => {
    const handleAuthError = () => {
      logout();
      navigate('/deactivated', { replace: true });
    };
    window.addEventListener('auth-error-403', handleAuthError);
    return () => window.removeEventListener('auth-error-403', handleAuthError);
  }, [navigate]);

  const login = async (identifier, password) => {
    const res = await userAuthApi.login({ identifier, password });
    localStorage.setItem('agronest_user_token', res.data.token);
    // Patch axios default header for this session
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (formData) => {
    const res = await userAuthApi.register(formData);
    localStorage.setItem('agronest_user_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('agronest_user_token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
