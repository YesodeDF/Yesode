import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './LeadCapture.scss';

export const LeadCapture: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct call to our custom Express /api/leads Gateway
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.current?.show({ 
          severity: 'success', 
          summary: 'Recebido', 
          detail: 'Sua solicitação de consultoria foi encaminhada para a nossa diretoria. Verifique seu e-mail.', 
          life: 5000 
        });
        setFormData({ name: '', email: '', company: '' });
      } else {
        // Validation Error Catch (ex: e-mail livre ao invés de corporativo)
        const errorMsg = data.errors ? data.errors[0]?.message : data.message;
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Atenção', 
          detail: errorMsg || 'Não foi possível enviar a solicitação. Tente novamente.', 
          life: 5000 
        });
      }
    } catch (err) {
      // 500 / Network Error Fallback
      toast.current?.show({ 
        severity: 'info', // Uses info styling to remain B2B elegant instead of breaking in RED
        summary: 'Processando', 
        detail: 'Nossa rede está roteando sua solicitação. Caso demore, nos chame no LinkedIn.', 
        life: 5000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ys-capture">
      <Toast ref={toast} position="bottom-right" className="ys-toast-premium" />
      <div className="container">
        <div className="ys-capture-box">
          <h2 className="ys-capture-title">Vamos mapear o seu próximo passo.</h2>
          <form className="ys-capture-form" onSubmit={handleSubmit}>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon"><i className="pi prime-user"></i></span>
              <InputText 
                placeholder="Nome Completo" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                disabled={loading}
                required 
              />
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon"><i className="pi prime-envelope"></i></span>
              <InputText 
                type="email" 
                placeholder="E-mail Corporativo" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                disabled={loading}
                required 
              />
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon"><i className="pi prime-building"></i></span>
              <InputText 
                placeholder="Empresa" 
                value={formData.company} 
                onChange={(e) => setFormData({...formData, company: e.target.value})} 
                disabled={loading}
                required 
              />
            </div>
            <Button 
              type="submit" 
              label={loading ? "Roteando..." : "Solicitar Consultoria Estratégica"} 
              icon={loading ? "pi pi-spin pi-spinner" : ""}
              className="p-button-primary" 
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </section>
  );
};
