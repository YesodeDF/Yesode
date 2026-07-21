import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, X, ArrowRight, KeyRound } from 'lucide-react';

export const SecretLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
      setPassword('');
      closeLoginModal();
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(8, 9, 12, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#12141A',
        border: '1px solid rgba(196, 169, 98, 0.25)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(196, 169, 98, 0.15)',
        color: '#FFFFFF'
      }}>
        <button
          onClick={closeLoginModal}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(196, 169, 98, 0.2) 0%, rgba(224, 194, 119, 0.05) 100%)',
            border: '1px solid rgba(196, 169, 98, 0.3)',
            marginBottom: '1rem',
            color: '#C4A962'
          }}>
            <Lock size={26} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
            Acesso Restrito
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: 0 }}>
            Digite a chave de acesso interna para liberar os módulos.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 2.75rem',
                backgroundColor: '#08090C',
                border: error ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.8rem', color: '#EF4444', margin: '-0.5rem 0 0 0', textAlign: 'center' }}>
              Chave incorreta. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '10px',
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
              boxShadow: '0 4px 14px rgba(196, 169, 98, 0.3)'
            }}
          >
            Entrar no Sistema <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
