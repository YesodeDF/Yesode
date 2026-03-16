import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './LeadCapture.scss';

export const LeadCapture: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Lead Captured:', formData);
  };

  return (
    <section className="ys-capture">
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
                required 
              />
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon"><i className="pi prime-building"></i></span>
              <InputText 
                placeholder="Empresa" 
                value={formData.company} 
                onChange={(e) => setFormData({...formData, company: e.target.value})} 
                required 
              />
            </div>
            <Button type="submit" label="Solicitar Consultoria Estratégica" className="p-button-primary" />
          </form>
        </div>
      </div>
    </section>
  );
};
