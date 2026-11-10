import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pass: string) => boolean;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HARDCODED_PASS = import.meta.env.VITE_ADMIN_PASS || 'yesode2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('yesod-auth') === 'true';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('yesod-auth', 'true');
    } else {
      sessionStorage.removeItem('yesod-auth');
    }
  }, [isAuthenticated]);

  const login = (pass: string): boolean => {
    const trimmed = (pass || '').trim();
    if (trimmed === HARDCODED_PASS || (import.meta.env.DEV && (trimmed === 'admin' || trimmed === 'yesode'))) {
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      sessionStorage.setItem('yesod-admin-token', trimmed);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('yesod-auth');
    sessionStorage.removeItem('yesod-admin-token');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
