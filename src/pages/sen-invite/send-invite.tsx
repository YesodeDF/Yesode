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
  Palette
} from 'lucide-react';

const SendInvite = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    subject: 'Apresentação Yesod',
    date: '',
    time: '',
    agenda: 'Discutiremos como as soluções da Yesod podem ajudar nos seus desafios atuais.',
    meetingType: 'online',
    location: '',
    buttonColor: '#111827', // Preto estilo modern/print
    accentColor: '#F59E0B' // Amarelo/Laranja Yesod
  });

  const [generatedData, setGeneratedData] = useState<any>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const generateMeetLink = () => {
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

    // Gera o HTML rico focado em compatibilidade de clientes de email (inline styles)
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
            Olá, <strong>${formData.clientName}</strong>! Sua reunião referente ao tema "<strong>${formData.subject}</strong>" está agendada. Estamos animados para o nosso encontro.
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
          ${formData.agenda ? `
          <div style="margin-bottom: 30px;">
            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0; background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px;">
              <strong>Pauta:</strong><br/>
              ${formData.agenda}
            </p>
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
      isOnline
    });
    setCopiedHtml(false);
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg text-white shadow-md shadow-slate-300">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Yesod Meetings</h1>
            <p className="text-sm text-slate-500">Criador de Convites com Design</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Formulário */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b pb-4">
              <Calendar className="text-slate-900" size={24} />
              Detalhes do Agendamento
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User size={16} className="text-slate-400"/> Nome do Cliente
                  </label>
                  <input 
                    required
                    type="text" 
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail size={16} className="text-slate-400"/> Email do Cliente
                  </label>
                  <input 
                    required
                    type="email" 
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    placeholder="joao@empresa.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400"/> Assunto da Reunião
                </label>
                <input 
                  required
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Demonstração da Plataforma Yesod"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Modalidade</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.meetingType === 'online' ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <input type="radio" name="meetingType" value="online" checked={formData.meetingType === 'online'} onChange={handleChange} className="hidden" />
                    <Globe size={18} /> Online
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.meetingType === 'presencial' ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <input type="radio" name="meetingType" value="presencial" checked={formData.meetingType === 'presencial'} onChange={handleChange} className="hidden" />
                    <MapPin size={18} /> Presencial
                  </label>
                </div>
              </div>

              {formData.meetingType === 'presencial' && (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400"/> Endereço / Local
                  </label>
                  <input 
                    required
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Sede da Yesod - Av. Principal, 1000"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400"/> Data
                  </label>
                  <input 
                    required
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Clock size={16} className="text-slate-400"/> Horário
                  </label>
                  <input 
                    required
                    type="time" 
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400"/> Pauta (Opcional)
                </label>
                <textarea 
                  name="agenda"
                  value={formData.agenda}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Palette size={20} />
                Gerar Design do E-mail
              </button>
            </form>
          </section>
        </div>

        {/* Visualização e Disparo */}
        <section className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col transition-all duration-300 ${!generatedData ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b pb-4">
            <Mail className="text-slate-900" size={24} />
            Preview do E-mail
          </h2>
          
          {generatedData ? (
            <div className="flex flex-col h-full space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2">
                <p className="text-sm text-slate-600"><strong>Assunto:</strong> {generatedData.emailSubject}</p>
              </div>

              {/* Preview Renderizado do HTML */}
              <div 
                className="flex-1 overflow-y-auto border border-slate-200 rounded-xl bg-slate-100"
                dangerouslySetInnerHTML={{ __html: generatedData.htmlEmail }}
              />

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={handleCopyRichText}
                  className={`w-full py-4 px-4 font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-lg ${
                    copiedHtml 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copiedHtml ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                  {copiedHtml ? 'E-mail Copiado com Sucesso!' : 'Copiar Design (Para colar no Gmail/Outlook)'}
                </button>
                <p className="text-xs text-center text-slate-500 font-medium">
                  Clique acima, abra seu e-mail (Gmail, Outlook) e aperte <strong>Ctrl + V</strong> para colar o e-mail perfeitamente formatado.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center text-slate-400 space-y-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Palette size={48} className="opacity-20" />
              <p className="text-center max-w-xs text-sm">Preencha os dados e gere o convite para ver o preview com o design aplicado.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default SendInvite;