import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ── Axios interceptor ────────────────────────────────────────────────────────
// Runs before EVERY request — always picks the latest token from localStorage.
// This is the only reliable way to handle token injection regardless of
// React render order or context initialization timing.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      // Fetch user profile — interceptor will attach the token automatically
      axios.get(apiUrl('/me/'))
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token invalid/expired — clear everything
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setToken(null);
          setUser(null);
        });
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(apiUrl('/auth/login/'), { email, password });
    // dj-rest-auth with USE_JWT=True returns { access, refresh }
    const access = response.data.access;
    const refresh = response.data.refresh;
    if (!access) throw new Error('No access token in login response');
    if (refresh) localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('authToken', access);
    setToken(access);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};