import React, { useState } from 'react';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      {isLogin ? (
        <LoginPage onToggleMode={toggleMode} />
      ) : (
        <RegisterPage onToggleMode={toggleMode} />
      )}
    </>
  );
};

export default AuthPage;
