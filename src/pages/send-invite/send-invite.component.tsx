import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  FileText, 
  Copy, 
  CheckCircle2,
  Building2,
  MapPin,
  Globe,
  Palette,
  Send,
  Users
} from 'lucide-react';

import "./send-invite.component.scss";

// Tipagens do Formulário
interface FormData {
  clientName: string;
  clientEmail: string;
  clientCopyEmail: string;
  subject: string;
  date: string;
  time: string;
  agenda: string;
  meetingType: 'online' | 'presencial';
  location: string;
  buttonColor: string;
  accentColor: string;
}

interface GeneratedData {
  meetLink: string | null;
  emailSubject: string;
  htmlEmail: string;
  isOnline: boolean;
  ccEmail:string | null;
}

const SendInvite: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    clientCopyEmail: '',
    subject: 'Apresentação Yesod',
    date: '',
    time: '',
    agenda: 'Discutiremos como as soluções da Yesod podem ajudar nos seus desafios atuais.',
    meetingType: 'online',
    location: '',
    buttonColor: '#111827', // Preto estilo modern/print
    accentColor: '#F59E0B' // Amarelo/Laranja Yesod
  });

  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const generateMeetLink = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const getSegment = (len: number) => Array.from({length: len}).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `https://meet.google.com/${getSegment(3)}-${getSegment(4)}-${getSegment(3)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isOnline = formData.meetingType === 'online';
    const meetLink = isOnline ? generateMeetLink() : null;
    const formattedDate = formatDate(formData.date);
    const emailSubject = `Convite: ${formData.subject} - Yesod`;

    const formattedAgenda = formData.agenda ? formData.agenda.replace(/\n/g, '<br/>') : '';

    const htmlEmail = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; color: #111827;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header Logo -->
          <div style="display: flex; align-items: center; margin-bottom: 40px;">
            <div style="display: flex; gap: 4px; align-items: center;">
              <div style="width: 16px; height: 16px; border-radius: 100%; background-color: ${formData.accentColor};"></div>
              <div style="width: 16px; height: 16px; border-radius: 100%; background-color: #111827; margin-left: -6px;"></div>
            </div>
            <strong style="font-size: 18px; color: #111827; margin-left: 10px; letter-spacing: -0.5px;">Yesod</strong>
          </div>
          
          <!-- Big Title -->
          <h1 style="font-size: 32px; font-weight: 800; color: #111827; margin: 0 0 20px 0; line-height: 1.1; letter-spacing: -1px;">
            Reunião Confirmada! 🎉
          </h1>
          
          <!-- Description -->
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            Olá, <strong>${formData.clientName || 'Cliente'}</strong>! Sua reunião referente ao tema "<strong>${formData.subject}</strong>" está agendada. Estamos animados para o nosso encontro.
          </p>

          <!-- Details Card -->
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #374151;">
              <span style="display: inline-block; width: 24px;">🗓️</span> <strong>Data:</strong> ${formattedDate}
            </p>
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #374151;">
              <span style="display: inline-block; width: 24px;">⏰</span> <strong>Horário:</strong> ${formData.time}
            </p>
            <p style="margin: 0; font-size: 15px; color: #374151;">
              <span style="display: inline-block; width: 24px;">${isOnline ? '🌐' : '📍'}</span> <strong>Local:</strong> ${isOnline ? 'Google Meet' : formData.location}
            </p>
          </div>
          
          <!-- Call to Action -->
          ${isOnline ? `
          <div style="margin-bottom: 30px;">
            <a href="${meetLink}" style="display: inline-block; background-color: ${formData.buttonColor}; color: #ffffff; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 8px; font-size: 16px;">
              Acessar Google Meet
            </a>
          </div>
          ` : ''}

          <!-- Agenda/Notes -->
          ${formattedAgenda ? `
          <div style="margin-bottom: 30px;">
            <div style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0; background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px;">
              <strong>Pauta:</strong><br/>
              ${formattedAgenda}
            </div>
          </div>
          ` : ''}

          <!-- Footer Divider -->
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0 30px 0;" />
          
          <!-- Footer -->
          <p style="font-size: 13px; color: #9ca3af; line-height: 1.5; margin: 0;">
            Você está recebendo este e-mail pois agendou um encontro com a equipe Yesod. Se precisar alterar o horário ou tiver imprevistos, fique à vontade para responder a esta mensagem.<br/><br/>
            <strong>Yesod</strong> • Inovação e Soluções
          </p>
        </div>
      </div>
    `;

    setGeneratedData({
      meetLink,
      emailSubject,
      htmlEmail,
      isOnline,
      ccEmail: formData.clientCopyEmail
    });
    setCopiedHtml(false);
    setEmailStatus('idle');
  };

  const handleCopyRichText = () => {
    if (!generatedData) return;

    const container = document.createElement('div');
    container.innerHTML = generatedData.htmlEmail;
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNode(container);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      document.execCommand('copy');
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 3000);
    } catch (err) {
      console.error('Falha ao copiar HTML', err);
    }
    
    selection?.removeAllRanges();
    document.body.removeChild(container);
  };

  const handleSendEmail = async () => {
    if (!generatedData) return;
    
    setIsSending(true);
    setEmailStatus('idle');

    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.clientEmail,
          cc: formData.clientCopyEmail || undefined,
          subject: generatedData.emailSubject,
          html: generatedData.htmlEmail,
        }),
      });

      if (response.ok) {
        setEmailStatus('success');
        setTimeout(() => setEmailStatus('idle'), 4000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email send error:', error);
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 4000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="yesod-app">
      <style>{`
        .yesod-app { min-height: 100vh; background-color: #f1f5f9; color: #1e293b; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 1rem; }
        @media (min-width: 768px) { .yesod-app { padding: 2rem; } }
        .yesod-header { max-width: 72rem; margin: 0 auto 2rem auto; display: flex; align-items: center; justify-content: space-between; }
        .header-brand { display: flex; align-items: center; gap: 0.75rem; }
        .header-icon { background-color: #0f172a; padding: 0.5rem; border-radius: 0.5rem; color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header-text h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; letter-spacing: -0.025em; margin: 0; }
        .header-text p { font-size: 0.875rem; color: #64748b; margin: 0; }
        .yesod-main { max-width: 72rem; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .yesod-main { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .yesod-section { background-color: #ffffff; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; padding: 1.5rem; }
        @media (min-width: 768px) { .yesod-section { padding: 2rem; } }
        .section-title { font-size: 1.25rem; font-weight: 600; margin: 0 0 1.5rem 0; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; color: #0f172a; }
        .yesod-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 768px) { .form-row { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .form-group label { font-size: 0.875rem; font-weight: 500; color: #334155; display: flex; align-items: center; gap: 0.5rem; }
        .form-group label svg { color: #94a3b8; }
        .yesod-input, .yesod-textarea { width: 100%; padding: 0.625rem 1rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; outline: none; transition: all 0.2s; box-sizing: border-box; font-family: inherit; }
        .yesod-input:focus, .yesod-textarea:focus { border-color: #0f172a; box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.2); }
        .yesod-textarea { resize: none; }
        .radio-group { display: flex; gap: 1rem; }
        .radio-label { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s; color: #475569; }
        .hidden-radio { display: none; }
        .radio-label:hover { background-color: #f8fafc; }
        .radio-label.is-active { background-color: #0f172a; border-color: #0f172a; color: #ffffff; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        .submit-btn { width: 100%; padding: 0.875rem 1rem; background-color: #0f172a; color: #ffffff; font-weight: 600; border-radius: 0.5rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.125rem; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .submit-btn:hover { background-color: #1e293b; }
        .preview-section { display: flex; flex-direction: column; transition: all 0.3s; }
        .preview-section.is-empty { opacity: 0.5; filter: grayscale(100%); pointer-events: none; }
        .preview-content { display: flex; flex-direction: column; height: 100%; gap: 1rem; }
        .preview-header { background-color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .preview-header p { font-size: 0.875rem; color: #475569; margin: 0; }
        .preview-html { flex: 1; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 0.75rem; background-color: #f1f5f9; min-height: 400px; }
        .preview-actions { padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .copy-btn { width: 100%; padding: 1rem; font-weight: 600; border-radius: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.125rem; transition: all 0.2s; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .copy-btn.is-copied { background-color: #16a34a; color: #ffffff; }
        .copy-btn.is-copied:hover { background-color: #15803d; }
        .copy-btn:not(.is-copied) { background-color: #2563eb; color: #ffffff; }
        .copy-btn:not(.is-copied):hover { background-color: #1d4ed8; }
        .copy-hint { font-size: 0.75rem; text-align: center; color: #64748b; margin: 0; font-weight: 500; }
        .empty-state { flex: 1; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; background-color: #f8fafc; border-radius: 0.75rem; border: 1px dashed #e2e8f0; color: #94a3b8; }
        .empty-state svg { opacity: 0.2; }
        .empty-state p { text-align: center; max-width: 20rem; font-size: 0.875rem; margin: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <header className="yesod-header">
        <div className="header-brand">
          <div className="header-icon">
            <Building2 size={28} />
          </div>
          <div className="header-text">
            <h1>Yesod Meetings</h1>
            <p>Criador de Convites Inteligente</p>
          </div>
        </div>
      </header>

      <main className="yesod-main">
        
        {/* Formulário */}
        <div className="yesod-form-container">
          <section className="yesod-section">
            <h2 className="section-title">
              <Calendar size={24} />
              Detalhes do Agendamento
            </h2>
            
            <form onSubmit={handleGenerate} className="yesod-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <User size={16} /> Nome do Cliente
                  </label>
                  <input 
                    required
                    type="text" 
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Ex: João Silva"
                    className="yesod-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <Mail size={16} /> Email do Cliente
                  </label>
                  <input 
                    required
                    type="email" 
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    placeholder="joao@empresa.com"
                    className="yesod-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <Users size={16} /> Email em Cópia (CC)
                </label>
                <input 
                  type="text" 
                  name="clientCopyEmail"
                  value={formData.clientCopyEmail}
                  onChange={handleChange}
                  placeholder="pc1@empresa.com, pc2@empresa.com"
                  className="yesod-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FileText size={16} /> Assunto da Reunião
                </label>
                <input 
                  required
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Demonstração da Plataforma Yesod"
                  className="yesod-input"
                />
              </div>

              <div className="form-group">
                <label>Modalidade</label>
                <div className="radio-group">
                  <label className={`radio-label ${formData.meetingType === 'online' ? 'is-active' : ''}`}>
                    <input type="radio" name="meetingType" value="online" checked={formData.meetingType === 'online'} onChange={handleChange} className="hidden-radio" />
                    <Globe size={18} /> Online
                  </label>
                  <label className={`radio-label ${formData.meetingType === 'presencial' ? 'is-active' : ''}`}>
                    <input type="radio" name="meetingType" value="presencial" checked={formData.meetingType === 'presencial'} onChange={handleChange} className="hidden-radio" />
                    <MapPin size={18} /> Presencial
                  </label>
                </div>
              </div>

              {formData.meetingType === 'presencial' && (
                <div className="form-group fade-in">
                  <label>
                    <MapPin size={16} /> Endereço / Local
                  </label>
                  <input 
                    required
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Sede da Yesod - Av. Principal, 1000"
                    className="yesod-input"
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Calendar size={16} /> Data
                  </label>
                  <input 
                    required
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="yesod-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <Clock size={16} /> Horário
                  </label>
                  <input 
                    required
                    type="time" 
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="yesod-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FileText size={16} /> Pauta (Opcional)
                </label>
                <textarea 
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  rows={3}
                  className="yesod-textarea"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <Palette size={20} />
                Gerar Design do E-mail
              </button>
            </form>
          </section>
        </div>

        {/* Visualização e Disparo */}
        <section className={`yesod-section preview-section ${!generatedData ? 'is-empty' : ''}`}>
          <h2 className="section-title">
            <Mail size={24} />
            Preview do E-mail
          </h2>
          
          {generatedData ? (
            <div className="preview-content">
              <div className="preview-header">
                <p><strong>Assunto:</strong> {generatedData.emailSubject}</p>
              </div>

              <div 
                className="preview-html"
                dangerouslySetInnerHTML={{ __html: generatedData.htmlEmail }}
              />

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className={`w-full py-4 px-4 font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-lg ${
                    emailStatus === 'success'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : emailStatus === 'error'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-70 disabled:cursor-not-allowed'
                  }`}
                >
                  {isSending ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : emailStatus === 'success' ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Send size={24} />
                  )}
                  {isSending 
                    ? 'Enviando...' 
                    : emailStatus === 'success' 
                    ? 'E-mail Enviado!' 
                    : emailStatus === 'error'
                    ? 'Erro no Envio (Tentar Novamente)'
                    : 'Enviar E-mail via Yesod'}
                </button>

                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">OU COPIE MANUALMENTE</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <button 
                  onClick={handleCopyRichText}
                  className={`w-full py-4 px-4 font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-lg ${
                    copiedHtml 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-800 hover:text-slate-900'
                  }`}
                >
                  {copiedHtml ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                  {copiedHtml ? 'E-mail Copiado!' : 'Copiar Design para Gmail/Outlook'}
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Palette size={48} />
              <p>Preencha os dados e gere o convite para ver o preview com o design aplicado.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default SendInvite;