import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { User, Mail, Building2, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import './LeadCapture.scss';

export const LeadCapture: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Recebido',
          detail: 'Sua solicitação foi encaminhada para a diretoria. Verifique seu e-mail.',
          life: 5000,
        });
        setFormData({ name: '', email: '', company: '' });
      } else {
        const errorMsg = data.errors ? data.errors[0]?.message : data.message;
        toast.current?.show({
          severity: 'error',
          summary: 'Atenção',
          detail: errorMsg || 'Não foi possível enviar a solicitação. Tente novamente.',
          life: 5000,
        });
      }
    } catch (err) {
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
              <div className="ys-field">
                <label className="ys-field-label" htmlFor="lead-name">
                  <User size={14} strokeWidth={2} />
                  Nome Completo
                </label>
                <InputText
                  id="lead-name"
                  placeholder="Diretor, CTO, Lead..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="ys-field">
                <label className="ys-field-label" htmlFor="lead-email">
                  <Mail size={14} strokeWidth={2} />
                  E-mail Corporativo
                </label>
                <InputText
                  id="lead-email"
                  type="email"
                  placeholder="voce@empresa.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="ys-field">
                <label className="ys-field-label" htmlFor="lead-company">
                  <Building2 size={14} strokeWidth={2} />
                  Empresa
                </label>
                <InputText
                  id="lead-company"
                  placeholder="Razão social ou marca"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  disabled={loading}
                  required
                />
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
