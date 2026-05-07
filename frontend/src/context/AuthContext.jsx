import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import api, { setAuthToken } from '../api/client.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'hn-bookmarks-auth';

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch (_error) {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  useEffect(() => {
    setAuthToken(auth.token);

    if (auth.token && auth.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [auth]);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null });
  }, []);

  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const completeAuth = useCallback((payload) => {
    setAuth({
      user: payload.user,
      token: payload.token
    });
  }, []);

  const login = useCallback(
    async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      completeAuth(response.data.data);
      return response.data.data.user;
    },
    [completeAuth]
  );

  const register = useCallback(
    async (values) => {
      const response = await api.post('/auth/register', values);
      completeAuth(response.data.data);
      return response.data.data.user;
    },
    [completeAuth]
  );

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token && auth.user),
      login,
      register,
      logout
    }),
    [auth, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
