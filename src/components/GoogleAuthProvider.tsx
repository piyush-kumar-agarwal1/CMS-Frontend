import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}
const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({ children }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.error('Google Client ID not found in environment variables');
    return <>{children}</>;
  }
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;