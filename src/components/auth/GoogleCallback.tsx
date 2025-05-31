import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api, { endpoints } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const GoogleCallback: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const processAuthCode = async () => {
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setError('No authorization code found');
          return;
        }
        
        // Exchange code for token through your backend
        const response = await api.post(endpoints.googleCallback, { code });
        
        // Store token and user data
        const { token, user } = response.data;
        localStorage.setItem('customerconnect_token', token);
        localStorage.setItem('customerconnect_user', JSON.stringify(user));
        
        toast({
          title: "Login Successful",
          description: "You've successfully logged in with Google",
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Error processing Google callback:', err);
        setError('Failed to authenticate with Google');
        toast({
          title: "Authentication Failed",
          description: "Could not complete Google authentication",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setIsProcessing(false);
      }
    };
    
    processAuthCode();
  }, [navigate, toast]);
  
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Completing your sign-in...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate('/auth')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Back to Login
        </button>
      </div>
    );
  }
  
  return null;
};

export default GoogleCallback;