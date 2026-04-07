
import { AppUser, UserRole, UserPermissions } from '../types';

export const userService = {
  getUsers: async (): Promise<AppUser[]> => {
    const response = await fetch('/api/users');
    return response.json();
  },
  
  subscribeToUsers: (callback: (users: AppUser[]) => void) => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          callback(users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
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
