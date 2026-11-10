import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { User, Mail, Building2, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { trackEvent } from '@shared/utils/analytics';
import { Lead } from '@/modules/leads/domain/entities/Lead';
import { DomainError } from '@/modules/leads/domain/exceptions/LeadErrors';
import './LeadCapture.scss';

type Errors = Partial<Record<'name' | 'email' | 'company', string>>;

function validateWithDomain(data: { name: string; email: string; company: string }): Errors {
  const errors: Errors = {};
  try {
    Lead.create(data);
  } catch (err: any) {
    if (err instanceof DomainError) {
      const msg = err.message.toLowerCase();
      if (msg.includes('nome')) errors.name = err.message;
      else if (msg.includes('e-mail') || msg.includes('email')) errors.email = err.message;
      else if (msg.includes('empresa')) errors.company = err.message;
      else errors.name = err.message;
    }
  }
  return errors;
}

export const LeadCapture: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [honeypot, setHoneypot] = useState('');
  const [mountedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const fieldError = (key: 'name' | 'email' | 'company') =>
    touched[key] ? errors[key] : undefined;

  const onChange = (key: 'name' | 'email' | 'company', value: string) => {
    const next = { ...formData, [key]: value };
    setFormData(next);
    if (touched[key]) setErrors(validateWithDomain(next));
  };

  const onBlur = (key: 'name' | 'email' | 'company') => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validateWithDomain(formData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateWithDomain(formData);
    setErrors(validation);
    setTouched({ name: true, email: true, company: true });
    if (Object.keys(validation).length > 0) {
      trackEvent('form_submit_error', { reason: 'client_validation' });
      return;
    }

    setLoading(true);
    trackEvent('form_submit_attempt', { company: formData.company });

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Timestamp': String(mountedAt),
        },
        body: JSON.stringify({
          ...formData,
          website_url: honeypot, // Campo invisível anti-bot
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        trackEvent('form_submit_success');
        toast.current?.show({
          severity: 'success',
          summary: t('capture.toast_success_summary'),
          detail: t('capture.toast_success_detail'),
          life: 5000,
        });
        setFormData({ name: '', email: '', company: '' });
        setTouched({});
        setErrors({});
      } else {
        const errorMsg = data.errors ? data.errors[0]?.message : data.message;
        trackEvent('form_submit_error', { reason: 'server', message: errorMsg ?? null });
        toast.current?.show({
          severity: 'error',
          summary: t('capture.toast_error_summary'),
          detail: errorMsg || t('capture.toast_error_detail'),
          life: 5000,
        });
      }
    } catch (err) {
      trackEvent('form_submit_error', { reason: 'network' });
      toast.current?.show({
        severity: 'info',
        summary: t('capture.toast_network_summary'),
        detail: t('capture.toast_network_detail'),
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ys-capture ys-section" id="contact">
      <div className="ys-orb ys-orb--gold-soft" />
      <Toast ref={toast} position="bottom-right" className="ys-toast-premium" />
      <div className="container">
        <div className="ys-capture-grid">
          {/* Context Panel */}
          <aside className="ys-capture-context">
            <span className="ys-eyebrow">{t('capture.eyebrow')}</span>
            <h2 className="ys-capture-headline">
              {t('capture.headline')}<span className="gradient-text-gold">{t('capture.headline_highlight')}</span>{t('capture.headline_suffix')}
            </h2>
            <p className="ys-capture-pitch">
              {t('capture.pitch')}
            </p>

            <ul className="ys-capture-perks">
              <li>
                <span className="ys-capture-perk-icon"><Clock size={14} strokeWidth={2.5} /></span>
                <span>{t('capture.perk_response')}<strong>{t('capture.perk_response_bold')}</strong></span>
              </li>
              <li>
                <span className="ys-capture-perk-icon"><ShieldCheck size={14} strokeWidth={2.5} /></span>
                <span>{t('capture.perk_nda')}</span>
              </li>
              <li>
                <span className="ys-capture-perk-icon"><Sparkles size={14} strokeWidth={2.5} /></span>
                <span>{t('capture.perk_diag')}</span>
              </li>
            </ul>
          </aside>

          {/* Form Card */}
          <div className="ys-capture-box">
            <div className="ys-capture-box-head">
              <span className="ys-capture-dots">
                <span className="ys-dot ys-dot--red" />
                <span className="ys-dot ys-dot--yellow" />
                <span className="ys-dot ys-dot--green" />
              </span>
              <span className="ys-capture-box-title font-code">{t('capture.box_title')}</span>
            </div>

            <form className="ys-capture-form" onSubmit={handleSubmit}>
              {/* Anti-Bot Honeypot (Invisível para humanos, preenchido por scrapers) */}
              <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, overflow: 'hidden' }} aria-hidden="true">
                <label htmlFor="website_url">Website</label>
                <input
                  type="text"
                  id="website_url"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className={`ys-field ${fieldError('name') ? 'has-error' : ''}`}>
                <label className="ys-field-label" htmlFor="lead-name">
                  <User size={14} strokeWidth={2} />
                  {t('capture.label_name')}
                </label>
                <InputText
                  id="lead-name"
                  placeholder={t('capture.placeholder_name')}
                  value={formData.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  onBlur={() => onBlur('name')}
                  disabled={loading}
                  aria-invalid={!!fieldError('name')}
                  aria-describedby={fieldError('name') ? 'lead-name-error' : undefined}
                  required
                />
                {fieldError('name') && (
                  <span id="lead-name-error" className="ys-field-error" role="alert">
                    {fieldError('name')}
                  </span>
                )}
              </div>

              <div className={`ys-field ${fieldError('email') ? 'has-error' : ''}`}>
                <label className="ys-field-label" htmlFor="lead-email">
                  <Mail size={14} strokeWidth={2} />
                  {t('capture.label_email')}
                </label>
                <InputText
                  id="lead-email"
                  type="email"
                  placeholder={t('capture.placeholder_email')}
                  value={formData.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  onBlur={() => onBlur('email')}
                  disabled={loading}
                  aria-invalid={!!fieldError('email')}
                  aria-describedby={fieldError('email') ? 'lead-email-error' : undefined}
                  required
                />
                {fieldError('email') && (
                  <span id="lead-email-error" className="ys-field-error" role="alert">
                    {fieldError('email')}
                  </span>
                )}
              </div>

              <div className={`ys-field ${fieldError('company') ? 'has-error' : ''}`}>
                <label className="ys-field-label" htmlFor="lead-company">
                  <Building2 size={14} strokeWidth={2} />
                  {t('capture.label_company')}
                </label>
                <InputText
                  id="lead-company"
                  placeholder={t('capture.placeholder_company')}
                  value={formData.company}
                  onChange={(e) => onChange('company', e.target.value)}
                  onBlur={() => onBlur('company')}
                  disabled={loading}
                  aria-invalid={!!fieldError('company')}
                  aria-describedby={fieldError('company') ? 'lead-company-error' : undefined}
                  required
                />
                {fieldError('company') && (
                  <span id="lead-company-error" className="ys-field-error" role="alert">
                    {fieldError('company')}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                className="p-button-primary ys-capture-submit"
                disabled={loading}
              >
                <span>{loading ? t('capture.submit_loading') : t('capture.submit')}</span>
                {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
                {loading && <i className="pi pi-spin pi-spinner" />}
              </Button>

              <p className="ys-capture-disclaimer">
                {t('capture.disclaimer')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
