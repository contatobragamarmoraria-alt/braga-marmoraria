
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, UserPermissions } from '../types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PERMISSIONS: UserPermissions = {
  canViewFinancials: true,
  canViewTechnical: true,
  canViewCalendar: true,
  canViewOccurrences: true,
  canEditProjects: true,
  canDeleteProjects: true,
  canManageUsers: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.isAuthenticated) {
          // If authenticated via Google, we'd ideally fetch user info here
          // For now, we'll keep the mock/session logic but aware of the server status
          const savedUser = localStorage.getItem('bm-local-user');
          if (savedUser) setUser(JSON.parse(savedUser));
        } else {
          const savedUser = localStorage.getItem('bm-local-user');
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Auth check error:', e);
      } finally {
        setLoading(false);
        setIsAuthReady(true);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    const response = await fetch('/api/auth/google/url');
    const { url } = await response.json();
    window.location.href = url;
  };

  const loginWithEmail = async (email: string, password: string) => {
    // Mock Email Login
    const mockUser: AppUser = {
      id: 'email-user-' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`,
      createdAt: new Date().toISOString(),
      permissions: ADMIN_PERMISSIONS
    };
    setUser(mockUser);
    localStorage.setItem('bm-local-user', JSON.stringify(mockUser));
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const mockUser: AppUser = {
      id: 'new-user-' + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      createdAt: new Date().toISOString(),
      permissions: ADMIN_PERMISSIONS
    };
    setUser(mockUser);
    localStorage.setItem('bm-local-user', JSON.stringify(mockUser));
  };

  const loginAsGuest = async () => {
    setLoading(true);
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const guestUser: AppUser = {
      id: 'guest-' + Math.random().toString(36).substr(2, 9),
      name: 'Visitante (Demo)',
      email: 'convidado@atelierbraga.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar: '/logo.png',
      createdAt: new Date().toISOString(),
      permissions: ADMIN_PERMISSIONS
    };
    setUser(guestUser);
    localStorage.setItem('bm-local-user', JSON.stringify(guestUser));
    setLoading(false);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('bm-local-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, signUpWithEmail, loginAsGuest, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
