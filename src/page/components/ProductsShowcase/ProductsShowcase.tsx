import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { CheckCircle2, ExternalLink, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { trackEvent } from '@shared/utils/analytics';
import './ProductsShowcase.scss';

export const ProductsShowcase: React.FC = () => {
  const { t } = useTranslation();

  const handleProductClick = (productName: string) => {
    trackEvent('cta_hero_secondary_click', { target: `product_${productName}` });
  };

  return (
    <section className="ys-products ys-section" id="products" aria-label="Nossos Produtos e SaaS">
      <div className="container">
        <div className="ys-products-head">
          <span className="ys-eyebrow">{t('products.eyebrow')}</span>
          <h2 className="ys-section-title">
            {t('products.title')}
            <span className="gradient-text-gold">{t('products.title_highlight')}</span>
            {t('products.title_suffix')}
          </h2>
          <p className="ys-section-subtitle">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="ys-products-grid">
          {/* Main Product Card */}
          <article className="ys-product-card">
            <div className="ys-product-body">
              <div className="ys-product-header">
                <div className="ys-product-badge">
                  <span className="ys-badge-dot" />
                  {t('products.badge_live')}
                </div>
              </div>

              <h3 className="ys-product-title">{t('products.item_1.title')}</h3>
              <div className="ys-product-tagline">{t('products.item_1.tagline')}</div>
              <p className="ys-product-desc">{t('products.item_1.desc')}</p>

              <ul className="ys-product-features">
                <li>
                  <CheckCircle2 size={16} strokeWidth={2.25} />
                  <span>{t('products.item_1.features.0')}</span>
                </li>
                <li>
                  <CheckCircle2 size={16} strokeWidth={2.25} />
                  <span>{t('products.item_1.features.1')}</span>
                </li>
                <li>
                  <CheckCircle2 size={16} strokeWidth={2.25} />
                  <span>{t('products.item_1.features.2')}</span>
                </li>
              </ul>
            </div>

            <div className="ys-product-footer">
              <span className="ys-product-stack">
                {t('products.item_1.stack')}
              </span>
              <Button
                className="p-button-primary"
                onClick={() => handleProductClick('yesode_hub')}
              >
                <span>{t('products.item_1.cta')}</span>
                <ExternalLink size={15} strokeWidth={2.25} />
              </Button>
            </div>
          </article>

          {/* Coming Soon / Roadmap Card */}
          <article className="ys-product-card--coming-soon">
            <div>
              <div className="ys-product-header">
                <div className="ys-product-badge-coming">
                  <Sparkles size={13} strokeWidth={2} />
                  {t('products.badge_coming_soon')}
                </div>
              </div>

              <div className="ys-coming-icon">
                <Layers size={22} strokeWidth={2} />
              </div>

              <h3 className="ys-coming-title">{t('products.coming_soon.title')}</h3>
              <p className="ys-coming-desc">{t('products.coming_soon.desc')}</p>
            </div>

            <div className="ys-coming-footer">
              <span className="ys-coming-tag">{t('products.coming_soon.tag')}</span>
              <Button
                className="p-button-outlined"
                style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
                onClick={() => handleProductClick('labs_roadmap')}
              >
                <span>{t('products.coming_soon.cta')}</span>
                <ArrowUpRight size={14} strokeWidth={2} />
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
