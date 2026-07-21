import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <section className="ys-social-proof" aria-label={t('social.aria_label')}>
      <div className="container">
        <p className="ys-social-proof-label">
          {t('social.label')}
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
