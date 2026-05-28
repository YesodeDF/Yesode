import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { User, Mail, Building2, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import './LeadCapture.scss';

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.com.br',
  'live.com', 'msn.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com',
  'bol.com.br', 'uol.com.br', 'terra.com.br', 'ig.com.br',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Partial<Record<'name' | 'email' | 'company', string>>;

function validate(data: { name: string; email: string; company: string }): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = 'Informe seu nome.';
  else if (data.name.trim().length < 2) errors.name = 'Nome muito curto.';

  if (!data.email.trim()) errors.email = 'Informe seu e-mail corporativo.';
  else if (!EMAIL_RE.test(data.email)) errors.email = 'Formato de e-mail inválido.';
  else {
    const domain = data.email.split('@')[1]?.toLowerCase();
    if (domain && FREE_EMAIL_DOMAINS.has(domain)) {
      errors.email = 'Use um e-mail corporativo (não pessoal).';
    }
  }

  if (!data.company.trim()) errors.company = 'Informe a empresa.';
  return errors;
}

export const LeadCapture: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const fieldError = (key: 'name' | 'email' | 'company') =>
    touched[key] ? errors[key] : undefined;

  const onChange = (key: 'name' | 'email' | 'company', value: string) => {
    const next = { ...formData, [key]: value };
    setFormData(next);
    if (touched[key]) setErrors(validate(next));
  };

  const onBlur = (key: 'name' | 'email' | 'company') => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(formData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate(formData);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        trackEvent('form_submit_success');
        toast.current?.show({
          severity: 'success',
          summary: 'Recebido',
          detail: 'Sua solicitação foi encaminhada para a diretoria. Verifique seu e-mail.',
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
          summary: 'Atenção',
          detail: errorMsg || 'Não foi possível enviar a solicitação. Tente novamente.',
          life: 5000,
        });
      }
    } catch (err) {
      trackEvent('form_submit_error', { reason: 'network' });
      toast.current?.show({
        severity: 'info',
        summary: 'Processando',
        detail: 'Nossa rede está roteando sua solicitação. Caso demore, nos chame no LinkedIn.',
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
            <span className="ys-eyebrow">Próximo Passo</span>
            <h2 className="ys-capture-headline">
              Vamos mapear o seu <span className="gradient-text-gold">próximo passo</span>.
            </h2>
            <p className="ys-capture-pitch">
              Uma sessão de 45 minutos com a engenharia. Sem comercial, sem proposta
              padrão. Você sai com um diagnóstico técnico real do seu cenário.
            </p>

            <ul className="ys-capture-perks">
              <li>
                <span className="ys-capture-perk-icon"><Clock size={14} strokeWidth={2.5} /></span>
                <span>Resposta em até <strong>24h úteis</strong></span>
              </li>
              <li>
                <span className="ys-capture-perk-icon"><ShieldCheck size={14} strokeWidth={2.5} /></span>
                <span>NDA mútuo desde a primeira mensagem</span>
              </li>
              <li>
                <span className="ys-capture-perk-icon"><Sparkles size={14} strokeWidth={2.5} /></span>
                <span>Diagnóstico técnico, não pitch comercial</span>
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
              <span className="ys-capture-box-title font-code">request.consultoria.ts</span>
            </div>

            <form className="ys-capture-form" onSubmit={handleSubmit}>
              <div className={`ys-field ${fieldError('name') ? 'has-error' : ''}`}>
                <label className="ys-field-label" htmlFor="lead-name">
                  <User size={14} strokeWidth={2} />
                  Nome Completo
                </label>
                <InputText
                  id="lead-name"
                  placeholder="Diretor, CTO, Lead..."
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
                  E-mail Corporativo
                </label>
                <InputText
                  id="lead-email"
                  type="email"
                  placeholder="voce@empresa.com.br"
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
                  Empresa
                </label>
                <InputText
                  id="lead-company"
                  placeholder="Razão social ou marca"
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
                <span>{loading ? 'Roteando...' : 'Solicitar Consultoria Estratégica'}</span>
                {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
                {loading && <i className="pi pi-spin pi-spinner" />}
              </Button>

              <p className="ys-capture-disclaimer">
                Ao enviar, você concorda com a nossa política de privacidade e contato.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
