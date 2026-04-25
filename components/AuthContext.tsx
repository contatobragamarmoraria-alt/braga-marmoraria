import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, UserPermissions, UserRole } from '../types';
import { userService } from '../services/userService';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginWithRole: (name: string, role: UserRole) => Promise<void>;
  loginWithPin: (name: string, pin: string) => Promise<void>;
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
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated && data.user) {
            setUser(data.user);
            localStorage.setItem('bm-local-user', JSON.stringify(data.user));
          } else {
            const savedUser = localStorage.getItem('bm-local-user');
            if (savedUser) setUser(JSON.parse(savedUser));
          }
        } else {
          // API exists but returned error or not authenticated
          const savedUser = localStorage.getItem('bm-local-user');
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        // API probably doesn't exist (static hosting)
        console.warn('Auth API not available, using local session');
        const savedUser = localStorage.getItem('bm-local-user');
        if (savedUser) setUser(JSON.parse(savedUser));
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
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('bm-local-user', JSON.stringify(data.user));
      } else {
        throw new Error(data.error || 'Erro ao realizar login.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
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
    throw new Error('O acesso como convidado foi desativado. Por favor, use suas credenciais.');
  };

  const loginWithRole = async (name: string, role: UserRole) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const assignedPermissions: UserPermissions = {
      canViewFinancials: role === 'ADMIN' || role === 'MANAGER',
      canViewTechnical: role !== 'CLIENT',
      canViewCalendar: role !== 'CLIENT',
      canViewOccurrences: role !== 'CLIENT',
      canEditProjects: role === 'ADMIN' || role === 'MANAGER',
      canDeleteProjects: role === 'ADMIN',
      canManageUsers: role === 'ADMIN'
    };
    
    const configuredUser: AppUser = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@bragamarmoraria.com.br`,
      role: role,
      status: 'ACTIVE',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      createdAt: new Date().toISOString(),
      permissions: assignedPermissions
    };
    
    setUser(configuredUser);
    localStorage.setItem('bm-local-user', JSON.stringify(configuredUser));
    setLoading(false);
  };

  const loginWithPin = async (name: string, pin: string) => {
    setLoading(true);
    try {
      const users = await userService.getUsers();
      const foundUser = users.find(u => u.name === name);

      if (!foundUser) {
        throw new Error('Usuário não encontrado.');
      }

      if (foundUser.pin !== pin) {
        throw new Error('Código (PIN) incorreto.');
      }

      setUser(foundUser);
      localStorage.setItem('bm-local-user', JSON.stringify(foundUser));
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('bm-local-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, signUpWithEmail, loginAsGuest, loginWithRole, loginWithPin, logout, isAuthReady }}>
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
