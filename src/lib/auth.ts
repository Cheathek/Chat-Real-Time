import { User } from '@/types';

// Mock authentication functions - in a real app, these would connect to a backend API
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // This would be an API call in a real application
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        // Mock successful login
        const user: User = {
          id: '1',
          username: email.split('@')[0],
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          status: 'online',
          lastSeen: new Date().toISOString(),
        };
        
        const token = `mock-jwt-token-${Math.random().toString(36).substring(2, 15)}`;
        
        // Store in localStorage
        localStorage.setItem('chat-auth-token', token);
        localStorage.setItem('chat-user', JSON.stringify(user));
        
        resolve({ user, token });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800); // Simulate network delay
  });
};

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // This would be an API call in a real application
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && email && password) {
        // Mock successful registration
        const user: User = {
          id: Math.random().toString(36).substring(2, 10),
          username,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          status: 'online',
          lastSeen: new Date().toISOString(),
        };
        
        const token = `mock-jwt-token-${Math.random().toString(36).substring(2, 15)}`;
        
        // Store in localStorage
        localStorage.setItem('chat-auth-token', token);
        localStorage.setItem('chat-user', JSON.stringify(user));
        
        resolve({ user, token });
      } else {
        reject(new Error('Invalid registration data'));
      }
    }, 800); // Simulate network delay
  });
};

export const logout = () => {
  localStorage.removeItem('chat-auth-token');
  localStorage.removeItem('chat-user');
  window.location.href = '/';
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('chat-user');
  if (userJson) {
    return JSON.parse(userJson) as User;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('chat-auth-token');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('chat-auth-token');
};