import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/context/AuthContext';
import { Lock, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
      navigate(from, { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08090C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#12141A',
        border: '1px solid rgba(196, 169, 98, 0.25)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(196, 169, 98, 0.12)',
        color: '#FFFFFF'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(196, 169, 98, 0.25) 0%, rgba(224, 194, 119, 0.05) 100%)',
            border: '1px solid rgba(196, 169, 98, 0.35)',
            marginBottom: '1.25rem',
            color: '#C4A962'
          }}>
            <Lock size={30} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '999px', backgroundColor: 'rgba(196, 169, 98, 0.15)', border: '1px solid rgba(196, 169, 98, 0.3)', color: '#C4A962', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            <ShieldCheck size={14} /> Câmara Secreta Yesode
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Login Interno
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', margin: 0, lineHeight: '1.5' }}>
            Informe a credencial de segurança para acessar a plataforma modular.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input
              type="password"
              placeholder="Senha de operador"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 2.8rem',
                backgroundColor: '#08090C',
                border: error ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.825rem', color: '#EF4444', margin: '-0.5rem 0 0 0', textAlign: 'center' }}>
              Senha incorreta. Verifique suas credenciais.
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #C4A962 0%, #E0C277 100%)',
              color: '#0A0F1C',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(196, 169, 98, 0.3)'
            }}
          >
            Acessar Sistema <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
