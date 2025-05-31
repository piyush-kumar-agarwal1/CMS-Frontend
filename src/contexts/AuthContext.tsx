import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api, { endpoints } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post(endpoints.login, { email, password });
      const { _id, name, email: userEmail, token, isAdmin, picture } = response.data;

      const userData: User = {
        id: _id,
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        const response = await api.post(endpoints.googleAuth || '/auth/google', {
          accessToken: codeResponse.access_token
        });
        
        const { _id, name, email, token, isAdmin, picture } = response.data;
        
        const userData: User = {
          id: _id,
          email,
          name,
          avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff`,
          role: isAdmin ? 'admin' : 'user'
        };
        
        setUser(userData);
        localStorage.setItem('customerconnect_token', token);
        localStorage.setItem('customerconnect_user', JSON.stringify(userData));
      } catch (error: any) {
        console.error('Google login error:', error);
        throw new Error(error.response?.data?.message || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
    }
  });

  const loginWithGoogle = () => {
    googleLogin();
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
        avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=ffffff`,
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

  useEffect(() => {
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
