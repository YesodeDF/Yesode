import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, FileText, Globe, ArrowRight, Sparkles, Zap, GraduationCap, FileDown } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const modules = [
    {
      id: 'invite',
      title: 'Yesod Meetings — Criador de Convites',
      description: 'Gerador inteligente de e-mails de agendamento de reuniões (presencial e online), com suporte a preview rich-html e envio por e-mail.',
      icon: <Mail size={32} style={{ color: '#C4A962' }} />,
      tag: 'Ferramenta Interna',
      link: '/admin/invite',
      buttonText: 'Acessar Gerador de Convites',
      accentColor: '#C4A962'
    },
    {
      id: 'global-developer',
      title: 'Proposta Global Developer (Novo)',
      description: 'Plataforma de ensino digital. Duas abordagens estratégicas: Plataforma All-in-One (WebRTC + VoD) vs Orquestrador Inteligente Google.',
      icon: <GraduationCap size={32} style={{ color: '#818cf8' }} />,
      tag: 'Educação B2B',
      link: '/admin/proposals/global-developer',
      buttonText: 'Ver Proposta Global Dev',
      accentColor: '#818cf8'
    },
    {
      id: 'mi-abuela',
      title: 'Proposta Mi Abuela',
      description: 'Transformação digital para marca de alimentação premium acessível, franquias e e-commerce.',
      icon: <FileText size={32} style={{ color: '#8B5CF6' }} />,
      tag: 'Varejo & Franquias',
      link: '/admin/proposals/mi-abuela',
      buttonText: 'Ver Proposta Mi Abuela',
      accentColor: '#8B5CF6'
    },
    {
      id: 'pdf',
      title: 'Gerador de PDFs Comerciais',
      description: 'Gere versões PDF das propostas comerciais seguindo o template corporativo padrão Yesode.',
      icon: <FileDown size={32} style={{ color: '#F59E0B' }} />,
      tag: 'Documentos B2B',
      link: '/admin/pdf',
      buttonText: 'Gerar PDFs das Propostas',
      accentColor: '#F59E0B'
    },
    {
      id: 'page',
      title: 'Landing Page Institucional',
      description: 'Plataforma pública da Yesode com suporte a i18n (PT/EN/ES), captura automatizada de leads B2B e otimização para motores de busca.',
      icon: <Globe size={32} style={{ color: '#38BDF8' }} />,
      tag: 'Público',
      link: '/en',
      buttonText: 'Visualizar Landing Page',
      accentColor: '#38BDF8'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(196, 169, 98, 0.15) 0%, rgba(18, 20, 26, 0.9) 100%)',
        border: '1px solid rgba(196, 169, 98, 0.25)',
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 169, 98, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', backgroundColor: 'rgba(196, 169, 98, 0.2)', border: '1px solid rgba(196, 169, 98, 0.4)', color: '#C4A962', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          <Sparkles size={14} /> Yesode Modular OS
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.75rem 0', letterSpacing: '-0.03em' }}>
          Painel de Controle Unificado
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#9CA3AF', maxWidth: '680px', margin: 0, lineHeight: '1.6' }}>
          Selecione o módulo operacional que deseja utilizar. Todas as ferramentas e propostas da Yesode integradas e modularizadas.
        </p>
      </div>

      {/* Modules Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Zap size={20} style={{ color: '#C4A962' }} /> Módulos Operacionais
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {modules.map((mod) => (
          <div
            key={mod.id}
            style={{
              backgroundColor: '#12141A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {mod.icon}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: mod.accentColor,
                  backgroundColor: `${mod.accentColor}15`,
                  border: `1px solid ${mod.accentColor}30`,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px'
                }}>
                  {mod.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.65rem 0' }}>
                {mod.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF', lineHeight: '1.55', margin: '0 0 1.5rem 0' }}>
                {mod.description}
              </p>
            </div>

            <Link
              to={mod.link}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              {mod.buttonText} <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
