import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { 
  LayoutDashboard, 
  Mail, 
  FileText, 
  LogOut, 
  Globe 
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Gerador de Convites', path: '/admin/invite', icon: <Mail size={18} /> },
    { label: 'Proposta Mi Abuela', path: '/admin/proposals/mi-abuela', icon: <FileText size={18} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08090C', color: '#F3F4F6', fontFamily: 'Inter, sans-serif' }}>
      {/* Admin Top Navigation */}
      <header style={{
        backgroundColor: '#12141A',
        borderBottom: '1px solid rgba(196, 169, 98, 0.2)',
        padding: '0.85rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #C4A962 0%, #E0C277 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A0F1C',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                Y
              </div>
              <div>
                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                  Yesode <span style={{ color: '#C4A962', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '0.3rem', padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(196, 169, 98, 0.15)', border: '1px solid rgba(196, 169, 98, 0.3)' }}>Internal OS</span>
                </span>
              </div>
            </Link>

            {/* Nav Menu */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#C4A962' : '#9CA3AF',
                      backgroundColor: isActive ? 'rgba(196, 169, 98, 0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(196, 169, 98, 0.25)' : '1px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/en"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.825rem',
                color: '#9CA3AF',
                textDecoration: 'none',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <Globe size={14} /> Site Público
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.825rem',
                color: '#F87171',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 65px)' }}>
        {children}
      </main>
    </div>
  );
};
