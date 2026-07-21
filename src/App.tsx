import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PageRoutes } from '@page/PageRoutes';
import AdminRoutes from '@admin/AdminRoutes';
import { LoginPage } from '@admin/pages/LoginPage';
import PublicProposal from '@admin/pages/proposals/PublicProposal';
import GlobalDeveloperProposal from '@admin/pages/proposals/GlobalDeveloperProposal';
import MiAbuelaProposal from '@admin/pages/proposals/MiAbuelaProposal';
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

      {/* Public Proposal Routes (Direct access without login) */}
      <Route path="/proposta/global-developer" element={<GlobalDeveloperProposal />} />
      <Route path="/proposta/mi-abuela" element={<MiAbuelaProposal />} />
      <Route path="/proposta/:slug" element={<PublicProposal />} />
      <Route path="/proposal/:slug" element={<PublicProposal />} />

      {/* Localized Public Proposal Routes (Direct access with lang prefix) */}
      <Route path="/:lang/proposta/global-developer" element={<GlobalDeveloperProposal />} />
      <Route path="/:lang/proposta/mi-abuela" element={<MiAbuelaProposal />} />
      <Route path="/:lang/proposta/:slug" element={<PublicProposal />} />
      <Route path="/:lang/proposal/:slug" element={<PublicProposal />} />

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
