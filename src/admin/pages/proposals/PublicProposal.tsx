import React from 'react';
import { useParams } from 'react-router-dom';
import GlobalDeveloperProposal from './GlobalDeveloperProposal';
import MiAbuelaProposal from './MiAbuelaProposal';

export const PublicProposal: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug === 'global-developer') {
    return <GlobalDeveloperProposal />;
  }
  if (slug === 'mi-abuela') {
    return <MiAbuelaProposal />;
  }

  return <GlobalDeveloperProposal />;
};

export default PublicProposal;
