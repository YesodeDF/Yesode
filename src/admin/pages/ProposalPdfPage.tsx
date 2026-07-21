import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import GlobalDeveloperPdf from '../components/pdf/GlobalDeveloperPdf';
import MiAbuelaPdf from '../components/pdf/MiAbuelaPdf';
import { FileText, GraduationCap, Download, ArrowLeft, Eye, Sparkles } from 'lucide-react';

interface ProposalInfo {
  slug: string;
  name: string;
  accentColor: string;
  pdfComponent: React.ComponentType;
  fileName: string;
  icon: React.ReactNode;
  tag: string;
}

export const ProposalPdfPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedProposal, setSelectedProposal] = useState<string | null>(slug || null);

  const proposals: ProposalInfo[] = [
    {
      slug: 'global-developer',
      name: 'Global Developer',
      accentColor: '#6366f1',
      pdfComponent: GlobalDeveloperPdf,
      fileName: 'Yesode_Proposta_GlobalDeveloper.pdf',
      icon: <GraduationCap size={24} style={{ color: '#6366f1' }} />,
      tag: 'Plataforma EAD'
    },
    {
      slug: 'mi-abuela',
      name: 'Mi Abuela',
      accentColor: '#0ea5e9',
      pdfComponent: MiAbuelaPdf,
      fileName: 'Yesode_Proposta_MiAbuela.pdf',
      icon: <FileText size={24} style={{ color: '#0ea5e9' }} />,
      tag: 'Varejo & Franquias'
    }
  ];

  const currentProposal = proposals.find(p => p.slug === selectedProposal);
  const PDFDocument = currentProposal ? currentProposal.pdfComponent : null;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Navigation / Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#9CA3AF',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
        >
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>

        {selectedProposal && (
          <button
            onClick={() => setSelectedProposal(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#C4A962',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            Selecionar outra proposta
          </button>
        )}
      </div>

      {!selectedProposal ? (
        // Listing view
        <div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(196, 169, 98, 0.1) 0%, rgba(18, 20, 26, 0.8) 100%)',
            border: '1px solid rgba(196, 169, 98, 0.2)',
            borderRadius: '20px',
            padding: '2.5rem',
            marginBottom: '2.5rem'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(196, 169, 98, 0.15)',
              border: '1px solid rgba(196, 169, 98, 0.3)',
              color: '#C4A962',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              <Sparkles size={12} /> Template Padrão Yesode
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
              Gerador de PDF de Propostas
            </h1>
            <p style={{ fontSize: '1rem', color: '#9CA3AF', margin: 0, lineHeight: '1.5' }}>
              Todas as propostas geradas seguem a mesma identidade de marca (Capa Premium, sidebar dourada Yesode e grid corporativo), variando apenas a cor de destaque de cada cliente.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {proposals.map((p) => (
              <div
                key={p.slug}
                style={{
                  backgroundColor: '#12141A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {p.icon}
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: p.accentColor,
                      backgroundColor: `${p.accentColor}12`,
                      border: `1px solid ${p.accentColor}25`,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}>
                      {p.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    Gere a proposta em PDF de alta resolução com tons de <span style={{ color: p.accentColor, fontWeight: 'bold' }}>{p.name === 'Mi Abuela' ? 'Azul Celeste' : 'Índigo'}</span>.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProposal(p.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                >
                  <Eye size={16} /> Abrir Preview PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Preview and Download view
        <div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            
            {/* Sidebar Control Panel */}
            <div style={{ flex: '1 1 300px', maxWidth: '350px' }}>
              <div style={{
                backgroundColor: '#12141A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: currentProposal?.accentColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {currentProposal?.tag}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0 1rem 0' }}>
                  {currentProposal?.name}
                </h2>
                
                <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  A proposta foi gerada utilizando a cor institucional <span style={{ color: currentProposal?.accentColor, fontWeight: 'bold' }}>{currentProposal?.accentColor}</span> para tabelas, títulos e destaques.
                </p>

                {PDFDocument && (
                  <PDFDownloadLink
                    document={<PDFDocument />}
                    fileName={currentProposal?.fileName}
                    style={{ textDecoration: 'none' }}
                  >
                    {({ loading }) => (
                      <button
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '1rem',
                          borderRadius: '12px',
                          backgroundColor: '#C4A962',
                          color: '#0A0F1C',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        disabled={loading}
                      >
                        <Download size={18} />
                        {loading ? 'Preparando arquivo...' : 'Download PDF'}
                      </button>
                    )}
                  </PDFDownloadLink>
                )}
              </div>
            </div>

            {/* Live PDF Viewer */}
            <div style={{ flex: '2 1 600px', minHeight: '75vh', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {PDFDocument && (
                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                  <PDFDocument />
                </PDFViewer>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalPdfPage;
