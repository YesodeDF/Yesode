import React from 'react';
import './SocialProof.scss';

const LOGOS = [
  'Nubank',
  'Stone',
  'iFood',
  'RD Station',
  'Loft',
  'QuintoAndar',
];

export const SocialProof: React.FC = () => {
  return (
    <section className="ys-social-proof" aria-label="Clientes e parceiros">
      <div className="container">
        <p className="ys-social-proof-label">
          Engenharia entregue a times de produto que já confiam em arquiteturas críticas
        </p>
        <div className="ys-social-proof-strip">
          {LOGOS.map((name) => (
            <div key={name} className="ys-social-proof-logo" aria-label={name}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
