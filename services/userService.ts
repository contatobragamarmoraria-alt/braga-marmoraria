
import { AppUser, UserRole, UserPermissions } from '../types';

const STATIC_USERS: AppUser[] = [
  {
    id: 'tm1',
    name: 'Braga',
    email: 'braga@bragamarmoraria.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://i.pravatar.cc/150?u=brn',
    createdAt: '2026-03-29T18:35:00.000Z',
    pin: '1234',
    password: 'password123',
    permissions: {
      canViewFinancials: true,
      canViewTechnical: true,
      canViewCalendar: true,
      canViewOccurrences: true,
      canEditProjects: true,
      canDeleteProjects: true,
      canManageUsers: true
    }
  },
  {
    id: 'tm2',
    name: 'Jamile',
    email: 'jamile@bragamarmoraria.com',
    role: 'MANAGER',
    status: 'ACTIVE',
    avatar: 'https://i.pravatar.cc/150?u=jml',
    createdAt: '2026-03-29T18:35:00.000Z',
    pin: '1234',
    password: 'password123',
    permissions: {
      canViewFinancials: true,
      canViewTechnical: true,
      canViewCalendar: true,
      canViewOccurrences: true,
      canEditProjects: true,
      canDeleteProjects: false,
      canManageUsers: false
    }
  },
  {
    id: 'tm3',
    name: 'Léo',
    email: 'leo@bragamarmoraria.com',
    role: 'TEAM_MEMBER',
    status: 'ACTIVE',
    avatar: 'https://i.pravatar.cc/150?u=leo',
    createdAt: '2026-03-29T18:35:00.000Z',
    pin: '1234',
    password: 'password123',
    permissions: {
      canViewFinancials: false,
      canViewTechnical: true,
      canViewCalendar: true,
      canViewOccurrences: true,
      canEditProjects: false,
      canDeleteProjects: false,
      canManageUsers: false
    }
  }
];

export const userService = {
  getUsers: async (): Promise<AppUser[]> => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) return response.json();
      return STATIC_USERS;
    } catch (e) {
      return STATIC_USERS;
    }
  },
  
  subscribeToUsers: (callback: (users: AppUser[]) => void) => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          callback(users);
        } else {
          callback(STATIC_USERS);
        }
      } catch (error) {
        callback(STATIC_USERS);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  },

  addUser: async (user: AppUser) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return response.json();
  },

  updateUser: async (userId: string, updates: Partial<AppUser>) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  deleteUser: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
