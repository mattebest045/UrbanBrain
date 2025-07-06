import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthUser {
  id: string;
  tipo: string;
  luogo: string;
  nome?: string;
  cognome?: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<Omit<AuthState, 'login' | 'logout'>>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  const decodeToken = (token: string): AuthUser | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) return null;
      return {
        id: payload.id,
        tipo: payload.tipo,
        luogo: payload.luogo,
        nome: payload.nome,
        cognome: payload.cognome,
        email: payload.email,
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const user = decodeToken(token);
      console.log('Decoded user from token:', user);
      if (user) {
        setAuthState({ isAuthenticated: true, user, token, isLoading: false });
        return;
      }
      localStorage.removeItem('accessToken');
    }
    setAuthState({ isAuthenticated: false, user: null, token: null, isLoading: false });
  }, []);

  const login = useCallback((token: string) => {
    const user = decodeToken(token);
    if (user) {
      localStorage.setItem('accessToken', token);
      setAuthState({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return context;
};
