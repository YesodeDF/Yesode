import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';
import { trackEvent } from '@shared/utils/analytics';
import './FAQ.scss';

const FAQ_COUNT = 8;
const ITEMS = Array.from({ length: FAQ_COUNT });

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    const willOpen = openIdx !== idx;
    setOpenIdx(willOpen ? idx : null);
    if (willOpen) {
      trackEvent('faq_open', { index: idx, question: t(`faq.items.${idx}.q`) });
    }
  };

  return (
    <section className="ys-faq ys-section" id="faq" aria-label="Perguntas frequentes">
      <div className="container">
        <div className="ys-faq-grid">
          <div className="ys-faq-head">
            <span className="ys-eyebrow">{t('faq.eyebrow')}</span>
            <h2 className="ys-section-title">
              {t('faq.title')}<span className="gradient-text-gold">{t('faq.title_highlight')}</span>{t('faq.title_suffix')}
            </h2>
            <p className="ys-section-subtitle">
              {t('faq.subtitle')}
            </p>
          </div>

          <ul className="ys-faq-list">
            {ITEMS.map((_, i) => {
              const isOpen = openIdx === i;
              const Icon = isOpen ? Minus : Plus;
              const questionKey = `faq.items.${i}.q`;
              const answerKey = `faq.items.${i}.a`;
              
              return (
                <li
                  key={i}
                  className={`ys-faq-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="ys-faq-trigger"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                  >
                    <span className="ys-faq-q">{t(questionKey)}</span>
                    <span className="ys-faq-icon" aria-hidden="true">
                      <Icon size={16} strokeWidth={2.5} />
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    className="ys-faq-panel"
                    role="region"
                    aria-hidden={!isOpen}
                  >
                    <p>{t(answerKey)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
