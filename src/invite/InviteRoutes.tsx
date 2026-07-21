import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SendInvitePage from './pages/SendInvitePage';

export const InviteRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SendInvitePage />} />
    </Routes>
  );
};

export default InviteRoutes;
