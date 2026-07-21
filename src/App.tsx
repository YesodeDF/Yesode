import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PageRoutes } from '@page/PageRoutes';
import AdminRoutes from '@admin/AdminRoutes';
import { LoginPage } from '@admin/pages/LoginPage';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';

export const App: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }
  }, [location.pathname, location.hash]);

  return (
    <Routes>
      {/* Standalone Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Internal Admin Routes (gated by auth) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* Public Landing Page Routes */}
      <Route path="/:lang/*" element={<PageRoutes />} />
      <Route path="*" element={<PageRoutes />} />
    </Routes>
  );
};

export default App;
