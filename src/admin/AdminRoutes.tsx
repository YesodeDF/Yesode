import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import MiAbuelaProposal from './pages/proposals/MiAbuelaProposal';
import GlobalDeveloperProposal from './pages/proposals/GlobalDeveloperProposal';
import { ProposalPdfPage } from './pages/ProposalPdfPage';
import { AdminLayout } from './components/AdminLayout';
import InviteRoutes from '@invite/InviteRoutes';

const DynamicProposal: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  if (slug === 'mi-abuela') {
    return <MiAbuelaProposal />;
  }
  if (slug === 'global-developer') {
    return <GlobalDeveloperProposal />;
  }
  return <MiAbuelaProposal />;
};

export const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/invite/*" element={<InviteRoutes />} />
        <Route path="/proposals/:slug" element={<DynamicProposal />} />
        <Route path="/proposals/mi-abuela" element={<MiAbuelaProposal />} />
        <Route path="/proposals/global-developer" element={<GlobalDeveloperProposal />} />
        <Route path="/pdf" element={<ProposalPdfPage />} />
        <Route path="/pdf/:slug" element={<ProposalPdfPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
