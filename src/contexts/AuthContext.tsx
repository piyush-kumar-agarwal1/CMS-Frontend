import React, { createContext, useContext, useState, ReactNode } from 'react';
import api, { endpoints } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post(endpoints.login, { email, password });
      // Handle the actual response structure from your backend
      const { _id, name, email: userEmail, token, isAdmin, picture } = response.data;
      
      const userData: User = {
        id: _id, // Convert _id to id for frontend consistency
        email: userEmail,
        name,
        avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff`,
        role: isAdmin ? 'admin' : 'user'
      };

      setUser(userData);
      localStorage.setItem('customerconnect_token', token);
      localStorage.setItem('customerconnect_user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // This will be handled by Google OAuth redirect
      // For now, create a mock implementation
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Google User',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        role: 'user'
      };
      setUser(mockUser);
      localStorage.setItem('customerconnect_user', JSON.stringify(mockUser));
    } catch (error: any) {
      throw new Error('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await api.post(endpoints.register, { email, password, name });
      const { _id, name: userName, email: userEmail, token, isAdmin, picture } = response.data;
      
      const userData: User = {
        id: _id,
        email: userEmail,
        name: userName,
        avatar: picture,
        role: isAdmin ? 'admin' : 'user'
      };
      
      setUser(userData);
      localStorage.setItem('customerconnect_user', JSON.stringify(userData));
      localStorage.setItem('customerconnect_token', token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customerconnect_user');
    localStorage.removeItem('customerconnect_token');
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('customerconnect_user');
    const storedToken = localStorage.getItem('customerconnect_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('customerconnect_user');
        localStorage.removeItem('customerconnect_token');
      }
    }
  }, []);

  const value = {
    user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
