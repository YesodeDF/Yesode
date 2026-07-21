import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@page/components/LanguageSwitcher/LanguageSwitcher';
import '../../styles/proposal-global-developer.scss';
import {
  ChevronRight,
  Video,
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Database,
  Cpu,
  Server,
  Zap,
  Layout,
  Menu,
  X,
  PlayCircle,
  Link as LinkIcon,
  BookOpen,
  CalendarCheck
} from 'lucide-react';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  pt: {
    nav_diag: 'Diagnóstico',
    nav_op_a: 'Proposta A (All-in-One)',
    nav_op_b: 'Proposta B (Google)',
    nav_comp: 'Comparativo',
    nav_arch: 'Arquitetura',
    nav_next: 'Próximos Passos',
    hero_tag: 'Proposta de Arquitetura Comercial Exclusiva',
    hero_title_prefix: 'Transformação Digital para a ',
    hero_desc: 'Duas abordagens estratégicas para eliminar o atrito operacional das professoras, elevar a retenção de alunos e consolidar a plataforma de ensino com máxima escalabilidade.',
    btn_arch: 'Ver Opções de Arquitetura',
    btn_diag: 'Explorar Diagnóstico',
    diag_title: 'O Desafio Atual da Operação',
    diag_desc: 'Atualmente, a gestão educacional e os professores operam divididos em três ferramentas desconectadas, criando atrito pedagógico e diluição de marca.',
    gc_desc: 'Interface genérica que não reforça a identidade da Global Developer. Professores encontram dificuldades em organizar turmas e sincronizar presenças.',
    gm_desc: 'Necessidade de criar e disparar links manualmente. As Breakout Rooms exigem múltiplos cliques manuais, pausando o ritmo pedagógico da aula.',
    hub_desc: 'Plataforma de terceiros com taxas recorrentes. O aluno é obrigado a trocar de aba e login para assistir o acervo de aulas gravadas.',
    op_a_tag: 'Opção A — Solução Proprietária',
    op_a_title: 'Plataforma Educacional Premium (All-in-One)',
    op_a_desc: 'Ecossistema proprietário de ponta a ponta. Substitui o Google Meet, o Google Classroom e a Hubla por um único ambiente unificado sob a marca da Global Developer.',
    op_a_val: 'Valor Agregado: Experiência 100% White-Label',
    op_a_val_sub: 'O aluno não entra no Google; ele interage diretamente com a plataforma da instituição, elevando o valor percebido e a retenção.',
    op_b_tag: 'Opção B — Automação & Eficiência',
    op_b_title: 'O Orquestrador Inteligente (Interface Google Workspace)',
    op_b_desc: 'Uma camada de interface sob medida que oculta a complexidade do Google Workspace. A instituição aproveita os servidores do Google com usabilidade fluida para professores.',
    op_b_val: 'Valor Agregado: Curva de Aprendizado Imediata',
    op_b_val_sub: 'Resolve a dor exata das professoras sem exigir migração abrupta do acervo existente, com prazo de entrega reduzido.',
    comp_title: 'Matriz Comparativa das Arquiteturas',
    comp_desc: 'Analise lado a lado os diferenciais de cada abordagem para alinhar com os objetivos estratégicos da Global Developer.',
    arch_title: 'Stack Tecnológico Recomendado',
    arch_desc: 'Tecnologias modernas de alta confiabilidade corporativa selecionadas para garantir baixa latência e segurança.',
    next_title: 'Próximos Passos — Convite para Alinhamento',
    next_desc: 'Esta apresentação apresenta os caminhos arquiteturais possíveis. Selecione a opção que melhor se alinha à visão da gerência para agendarmos uma sessão de demonstração e detalhamento de escopo.',
    btn_req_a: 'Solicitar Apresentação Técnica (Opção A)',
    btn_req_b: 'Solicitar Apresentação Técnica (Opção B)',
    req_sent: 'Solicitação Registrada',
    req_sending: 'Enviando Convite...'
  },
  en: {
    nav_diag: 'Diagnosis',
    nav_op_a: 'Proposal A (All-in-One)',
    nav_op_b: 'Proposal B (Google)',
    nav_comp: 'Comparison',
    nav_arch: 'Architecture',
    nav_next: 'Next Steps',
    hero_tag: 'Exclusive Commercial Architecture Proposal',
    hero_title_prefix: 'Digital Transformation for ',
    hero_desc: 'Two strategic approaches to eliminate teachers\' operational friction, boost student retention, and consolidate the learning platform with maximum scalability.',
    btn_arch: 'View Architecture Options',
    btn_diag: 'Explore Diagnosis',
    diag_title: 'The Current Operational Challenge',
    diag_desc: 'Currently, educational management and teachers operate split across three disconnected tools, creating pedagogical friction and brand dilution.',
    gc_desc: 'Generic interface that does not reinforce Global Developer brand. Teachers face difficulties organizing classes and syncing attendance.',
    gm_desc: 'Need to manually create and send links. Breakout Rooms require multiple manual clicks, pausing class rhythm.',
    hub_desc: 'Third-party platform with recurring fees. Students must switch tabs and logins to watch recorded classes.',
    op_a_tag: 'Option A — Proprietary Solution',
    op_a_title: 'Premium Educational Platform (All-in-One)',
    op_a_desc: 'End-to-end proprietary ecosystem. Replaces Google Meet, Google Classroom, and Hubla with a single unified environment branded for Global Developer.',
    op_a_val: 'Added Value: 100% White-Label Experience',
    op_a_val_sub: 'Students don\'t enter Google; they interact directly with the institution\'s platform, boosting perceived value and retention.',
    op_b_tag: 'Option B — Automation & Efficiency',
    op_b_title: 'The Smart Orchestrator (Google Workspace Interface)',
    op_b_desc: 'A tailored interface layer that hides Google Workspace complexity. The institution leverages Google servers with seamless teacher usability.',
    op_b_val: 'Added Value: Immediate Learning Curve',
    op_b_val_sub: 'Solves teachers\' exact pain point without requiring abrupt content migration, with a faster delivery timeline.',
    comp_title: 'Architectural Comparison Matrix',
    comp_desc: 'Analyze side-by-side the key differentiators of each approach to align with Global Developer\'s strategic goals.',
    arch_title: 'Recommended Technology Stack',
    arch_desc: 'Modern, high-reliability enterprise technologies selected to ensure low latency and security.',
    next_title: 'Next Steps — Alignment Invitation',
    next_desc: 'This presentation outlines the architectural paths available. Select the option that best fits management\'s vision to schedule a technical demo session.',
    btn_req_a: 'Request Technical Demo (Option A)',
    btn_req_b: 'Request Technical Demo (Option B)',
    req_sent: 'Request Registered',
    req_sending: 'Sending Invitation...'
  },
  es: {
    nav_diag: 'Diagnóstico',
    nav_op_a: 'Propuesta A (All-in-One)',
    nav_op_b: 'Propuesta B (Google)',
    nav_comp: 'Comparativa',
    nav_arch: 'Arquitectura',
    nav_next: 'Próximos Pasos',
    hero_tag: 'Propuesta de Arquitectura Comercial Exclusiva',
    hero_title_prefix: 'Transformación Digital para ',
    hero_desc: 'Dos enfoques estratégicos para eliminar la fricción operativa de los profesores, aumentar la retención de estudiantes y consolidar la plataforma con máxima escalabilidad.',
    btn_arch: 'Ver Opciones de Arquitectura',
    btn_diag: 'Explorar Diagnóstico',
    diag_title: 'El Desafío Operativo Actual',
    diag_desc: 'Actualmente, la gestión educativa y los profesores operan divididos en tres herramientas desconectadas, creando fricción pedagógica y dilución de marca.',
    gc_desc: 'Interfaz genérica que no refuerza la identidad de Global Developer. Los profesores tienen dificultades para organizar clases y sincronizar asistencia.',
    gm_desc: 'Necesidad de crear y enviar enlaces manualmente. Las Breakout Rooms requieren múltiples clics manuales, pausando el ritmo pedagógico.',
    hub_desc: 'Plataforma de terceros con tarifas recurrentes. El estudiante se ve obligado a cambiar de pestaña e inicio de sesión para ver las clases grabadas.',
    op_a_tag: 'Opción A — Solución Propietaria',
    op_a_title: 'Plataforma Educativa Premium (All-in-One)',
    op_a_desc: 'Ecosistema propietario de extremo a extremo. Reemplaza Google Meet, Google Classroom y Hubla con un único entorno unificado con la marca de Global Developer.',
    op_a_val: 'Valor Agregado: Experiencia 100% Marca Blanca (White-Label)',
    op_a_val_sub: 'El estudiante no entra a Google; interactúa directamente con la plataforma de la institución, elevando el valor percibido y la retención.',
    op_b_tag: 'Opción B — Automatización y Eficiencia',
    op_b_title: 'El Orquestador Inteligente (Interfaz Google Workspace)',
    op_b_desc: 'Una capa de interfaz a medida que oculta la complejidad de Google Workspace. La institución aprovecha los servidores de Google con una usabilidad fluida para los profesores.',
    op_b_val: 'Valor Agregado: Curva de Aprendizaje Inmediata',
    op_b_val_sub: 'Resuelve el problema exacto de las profesoras sin exigir una migración abrupta del contenido existente, con un tiempo de entrega más rápido.',
    comp_title: 'Matriz Comparativa de Arquitecturas',
    comp_desc: 'Analice lado a lado los diferenciadores clave de cada enfoque para alinearse con los objetivos estratégicos de Global Developer.',
    arch_title: 'Stack Tecnológico Recomendado',
    arch_desc: 'Tecnologías modernas de alta confiabilidad corporativa seleccionadas para garantizar baja latencia y seguridad.',
    next_title: 'Próximos Pasos — Invitación a Alineación',
    next_desc: 'Esta presentación resume los caminos de arquitectura disponibles. Seleccione la opción que mejor se adapte a la visión de la gerencia para agendar una sesión técnica de demostración.',
    btn_req_a: 'Solicitar Presentación Técnica (Opción A)',
    btn_req_b: 'Solicitar Presentación Técnica (Opción B)',
    req_sent: 'Solicitud Registrada',
    req_sending: 'Enviando Invitación...'
  }
};

export const GlobalDeveloperProposal: React.FC = () => {
  const { lang = 'pt' } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sendingOption, setSendingOption] = useState<'A' | 'B' | null>(null);
  const [approvedOption, setApprovedOption] = useState<'A' | 'B' | null>(null);

  const currentLang = ['en', 'pt', 'es'].includes(lang) ? lang : (i18n.language || 'pt');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.pt;

  useEffect(() => {
    if (['en', 'pt', 'es'].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleApprove = async (option: 'A' | 'B') => {
    if (sendingOption || approvedOption) return;

    setSendingOption(option);

    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'filipe.nogueira@yesode.com',
          cc: 'davi.ribeiro@yesode.com',
          subject: `Interesse em Apresentação Técnica — Global Developer (Opção ${option}) 🚀`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px;">
              <h2 style="color: #4f46e5;">Solicitação de Apresentação Técnica! 🎉</h2>
              <p>A equipe da <strong>Global Developer</strong> demonstrou interesse em aprofundar a <strong>Proposta ${option}</strong>.</p>
              <p><strong>Detalhes da Solicitação:</strong></p>
              <ul>
                <li><strong>Arquitetura Escolhida:</strong> ${option === 'A' ? 'Proposta A — Plataforma Educacional Premium (All-in-One)' : 'Proposta B — O Orquestrador Inteligente (Google Workspace)'}</li>
                <li><strong>Idioma Utilizado:</strong> ${currentLang.toUpperCase()}</li>
                <li><strong>Data da Solicitação:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</li>
              </ul>
              <p>Agendar reunião de alinhamento de escopo e demonstração técnica.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">Enviado via Yesode Proposal Platform</p>
            </div>
          `,
        }),
      });

      if (response.ok) {
        setApprovedOption(option);
      } else {
        throw new Error('Falha ao enviar e-mail de notificação');
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      alert('Houve um contratempo ao registrar a solicitação. Tente novamente.');
    } finally {
      setSendingOption(null);
    }
  };

  return (
    <div className="gd-proposal-app">
      {/* Navigation */}
      <nav className="gd-navbar">
        <div className="gd-container gd-nav-container">
          <div className="gd-nav-brand">
            <div className="gd-nav-logo">Y</div>
            <div className="gd-nav-titles">
              <span className="gd-nav-title-main">Yesode</span>
              <span className="gd-nav-title-sub">Global Developer</span>
            </div>
          </div>

          <div className="gd-nav-desktop">
            <button onClick={() => scrollToSection('diagnostico')}>{t.nav_diag}</button>
            <button onClick={() => scrollToSection('opcao-a')}>{t.nav_op_a}</button>
            <button onClick={() => scrollToSection('opcao-b')}>{t.nav_op_b}</button>
            <button onClick={() => scrollToSection('comparativo')}>{t.nav_comp}</button>
            <button onClick={() => scrollToSection('tecnologia')}>{t.nav_arch}</button>
            <button onClick={() => scrollToSection('proximos-passos')}>{t.nav_next}</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSwitcher />

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gd-hero">
        <div className="gd-container">
          <span className="gd-hero-tag">
            <Sparkles size={14} /> {t.hero_tag}
          </span>
          <h1 className="gd-hero-title">
            {t.hero_title_prefix}<span>Global Developer</span>
          </h1>
          <p className="gd-hero-desc">
            {t.hero_desc}
          </p>

          <div className="gd-hero-buttons">
            <button onClick={() => scrollToSection('proximos-passos')} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.9rem 1.75rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)'
            }}>
              {t.btn_arch} <ChevronRight size={18} />
            </button>
            
            <button onClick={() => scrollToSection('diagnostico')} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.9rem 1.75rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'white',
              fontWeight: 600
            }}>
              {t.btn_diag}
            </button>
          </div>
        </div>
      </section>

      {/* Diagnóstico Atual */}
      <section id="diagnostico" className="gd-section">
        <div className="gd-container">
          <div className="gd-section-header">
            <h2>{t.diag_title}</h2>
            <p>{t.diag_desc}</p>
          </div>

          <div className="gd-problems-grid">
            <div className="gd-problem-card">
              <div className="gd-problem-icon">
                <BookOpen size={24} />
              </div>
              <h3>Google Classroom</h3>
              <p>{t.gc_desc}</p>
            </div>

            <div className="gd-problem-card">
              <div className="gd-problem-icon">
                <Video size={24} />
              </div>
              <h3>Google Meet (Aulas ao Vivo)</h3>
              <p>{t.gm_desc}</p>
            </div>

            <div className="gd-problem-card">
              <div className="gd-problem-icon">
                <PlayCircle size={24} />
              </div>
              <h3>Hubla (Vídeos Gravados)</h3>
              <p>{t.hub_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proposta A — All-in-One */}
      <section id="opcao-a" className="gd-section">
        <div className="gd-container">
          <div className="gd-proposal-box option-a">
            <div className="gd-proposal-header">
              <div>
                <span className="badge gold">{t.op_a_tag}</span>
                <h3>{t.op_a_title}</h3>
                <p>{t.op_a_desc}</p>
              </div>
            </div>

            <div className="gd-features-grid">
              <div className="gd-feature-item">
                <h4><Video size={18} style={{ color: '#818cf8' }} /> Motor de Vídeo Nativo (WebRTC)</h4>
                <p>Transmissão ao vivo de ultra-baixa latência embutida diretamente no navegador, sem abrir abas externas ou instalar apps.</p>
              </div>

              <div className="gd-feature-item">
                <h4><Users size={18} style={{ color: '#818cf8' }} /> Breakout Rooms 1-Click</h4>
                <p>Botão "Separar em Duplas" no painel da professora. O algoritmo divide a turma e redireciona automaticamente com contagem regressiva.</p>
              </div>

              <div className="gd-feature-item">
                <h4><PlayCircle size={18} style={{ color: '#818cf8' }} /> Módulo Video on Demand (VoD)</h4>
                <p>Hospedagem e organização das aulas gravadas com visual estilo "Netflix", eliminando totalmente a dependência da Hubla.</p>
              </div>

              <div className="gd-feature-item">
                <h4><Layout size={18} style={{ color: '#818cf8' }} /> LMS Integrado de Alta Performance</h4>
                <p>Envio de materiais, controle automático de presença e gestão completa de turmas em um painel limpo e intuitivo.</p>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <ShieldCheck size={32} style={{ color: '#C4A962', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'white', fontSize: '0.95rem', display: 'block' }}>{t.op_a_val}</strong>
                <span style={{ color: '#a5b4fc', fontSize: '0.875rem' }}>{t.op_a_val_sub}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proposta B — Orquestrador Google */}
      <section id="opcao-b" className="gd-section">
        <div className="gd-container">
          <div className="gd-proposal-box option-b">
            <div className="gd-proposal-header">
              <div>
                <span className="badge emerald">{t.op_b_tag}</span>
                <h3>{t.op_b_title}</h3>
                <p>{t.op_b_desc}</p>
              </div>
            </div>

            <div className="gd-features-grid">
              <div className="gd-feature-item">
                <h4><Layout size={18} style={{ color: '#34d399' }} /> Dashboard Unificado do Professor</h4>
                <p>Painel limpo com a agenda do dia. Ao clicar em "Iniciar Aula", a API do Google Workspace gera a sala no Meet e envia aos alunos.</p>
              </div>

              <div className="gd-feature-item">
                <h4><Zap size={18} style={{ color: '#34d399' }} /> Automação de Duplas via API</h4>
                <p>Ferramenta conectada à API do Google Meet para pré-configurar e separar alunos em Breakout Rooms com 1 clique.</p>
              </div>

              <div className="gd-feature-item">
                <h4><LinkIcon size={18} style={{ color: '#34d399' }} /> Portal Centralizador de Alunos</h4>
                <p>Hub central onde os alunos encontram a aula ao vivo do dia (Meet) e acesso direto ao acervo de gravações organizadas.</p>
              </div>

              <div className="gd-feature-item">
                <h4><Cpu size={18} style={{ color: '#34d399' }} /> Otimização do Google for Education</h4>
                <p>Aproveitamento da infraestrutura gratuita ou já contratada do Google, reduzindo custos de nuvem de vídeo a quase zero.</p>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <CheckCircle2 size={32} style={{ color: '#34d399', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'white', fontSize: '0.95rem', display: 'block' }}>{t.op_b_val}</strong>
                <span style={{ color: '#6ee7b7', fontSize: '0.875rem' }}>{t.op_b_val_sub}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo Tabela */}
      <section id="comparativo" className="gd-section">
        <div className="gd-container">
          <div className="gd-section-header">
            <h2>{t.comp_title}</h2>
            <p>{t.comp_desc}</p>
          </div>

          <div className="gd-table-wrapper">
            <table className="gd-table">
              <thead>
                <tr>
                  <th>Recurso / Critério</th>
                  <th>Proposta A (Plataforma All-in-One)</th>
                  <th>Proposta B (Orquestrador Google)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col-feature">Motor de Transmissão ao Vivo</td>
                  <td className="col-op-a">Nativo (WebRTC integrado na página)</td>
                  <td className="col-op-b">Google Meet (via API automação)</td>
                </tr>
                <tr>
                  <td className="col-feature">Breakout Rooms (Duplas)</td>
                  <td className="col-op-a">1-Click Nativo com timer e retorno automático</td>
                  <td className="col-op-b">Script automatizado acionado no Meet</td>
                </tr>
                <tr>
                  <td className="col-feature">Gestão de Vídeos Gravados (VoD)</td>
                  <td className="col-op-a">Módulo próprio estilo Netflix (Substitui Hubla)</td>
                  <td className="col-op-b">Redirecionamento centralizado/Drive</td>
                </tr>
                <tr>
                  <td className="col-feature">Identidade Visual (White-Label)</td>
                  <td className="col-op-a">100% Marca Global Developer</td>
                  <td className="col-op-b">Interface customizada com infra Google</td>
                </tr>
                <tr>
                  <td className="col-feature">Complexidade de Deploy</td>
                  <td className="col-op-a">Desenvolvimento Full-Stack proprietário</td>
                  <td className="col-op-b">Desenvolvimento Frontend + APIs Google</td>
                </tr>
                <tr>
                  <td className="col-feature">Infraestrutura de Nuvem</td>
                  <td className="col-op-a">Servidores próprios de streaming WebRTC/VoD</td>
                  <td className="col-op-b">Servidores mantidos pelo Google Workspace</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Arquitetura Tecnológica */}
      <section id="tecnologia" className="gd-section">
        <div className="gd-container">
          <div className="gd-section-header">
            <h2>{t.arch_title}</h2>
            <p>{t.arch_desc}</p>
          </div>

          <div className="gd-tech-grid">
            <div className="gd-tech-card">
              <div className="icon"><Video size={22} /></div>
              <div>
                <strong>LiveKit / WebRTC</strong>
                <span>Vídeo em tempo real (Opção A)</span>
              </div>
            </div>

            <div className="gd-tech-card">
              <div className="icon"><PlayCircle size={22} /></div>
              <div>
                <strong>Cloudflare Stream / Mux</strong>
                <span>VoD Adaptativo HLS (Opção A)</span>
              </div>
            </div>

            <div className="gd-tech-card">
              <div className="icon"><Globe size={22} /></div>
              <div>
                <strong>Google Workspace APIs</strong>
                <span>Classroom & Meet (Opção B)</span>
              </div>
            </div>

            <div className="gd-tech-card">
              <div className="icon"><Database size={22} /></div>
              <div>
                <strong>Supabase / PostgreSQL</strong>
                <span>Banco de dados relacional</span>
              </div>
            </div>

            <div className="gd-tech-card">
              <div className="icon"><Server size={22} /></div>
              <div>
                <strong>Vercel & Node.js</strong>
                <span>Hospedagem Edge & Serverless</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Passos & Convite */}
      <section id="proximos-passos" className="gd-section">
        <div className="gd-container">
          <div className="gd-section-header">
            <h2>{t.next_title}</h2>
            <p>{t.next_desc}</p>
          </div>

          <div className="gd-pricing-grid">
            {/* Opção A Card */}
            <div className="gd-pricing-card featured">
              <div>
                <span className="badge gold mb-3" style={{ display: 'inline-block' }}>Alta Valorização</span>
                <h3 className="title">Proposta A: All-in-One</h3>
                <p className="desc">Plataforma própria completa com WebRTC, VoD estilo Netflix e LMS White-Label sem intermediários.</p>

                <div style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.6)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  color: '#9CA3AF',
                  lineHeight: '1.6'
                }}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '0.35rem' }}>🎯 Ideal se o objetivo for:</strong>
                  • Eliminar licenças de terceiros (Hubla)<br/>
                  • Construir um ativo proprietário da marca<br/>
                  • Controle 100% nativo de salas e alunos
                </div>
              </div>

              <button
                className={`btn-approve btn-a ${approvedOption === 'A' ? 'success' : ''}`}
                onClick={() => handleApprove('A')}
                disabled={sendingOption !== null || approvedOption !== null}
              >
                {sendingOption === 'A' ? (
                  t.req_sending
                ) : approvedOption === 'A' ? (
                  <>{t.req_sent} <CheckCircle2 size={18} /></>
                ) : (
                  <>{t.btn_req_a} <CalendarCheck size={18} /></>
                )}
              </button>
            </div>

            {/* Opção B Card */}
            <div className="gd-pricing-card">
              <div>
                <span className="badge emerald mb-3" style={{ display: 'inline-block' }}>Implementação Ágil</span>
                <h3 className="title">Proposta B: Orquestrador Google</h3>
                <p className="desc">Camada de interface otimizada sobre as APIs do Google Workspace (Meet & Classroom).</p>

                <div style={{
                  backgroundColor: 'rgba(2, 6, 23, 0.6)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  color: '#9CA3AF',
                  lineHeight: '1.6'
                }}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '0.35rem' }}>🎯 Ideal se o objetivo for:</strong>
                  • Resolver rapidamente a usabilidade dos professores<br/>
                  • Aproveitar a infraestrutura já contratada no Google<br/>
                  • Menor tempo de desenvolvimento e deploy
                </div>
              </div>

              <button
                className={`btn-approve btn-b ${approvedOption === 'B' ? 'success' : ''}`}
                onClick={() => handleApprove('B')}
                disabled={sendingOption !== null || approvedOption !== null}
              >
                {sendingOption === 'B' ? (
                  t.req_sending
                ) : approvedOption === 'B' ? (
                  <>{t.req_sent} <CheckCircle2 size={18} /></>
                ) : (
                  <>{t.btn_req_b} <CalendarCheck size={18} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gd-footer">
        <div className="gd-container">
          <p>Apresentado por <strong>Filipe Nogueira</strong> & <strong>Davi Ribeiro</strong> — Yesode Soluções Digitais</p>
          <small>© 2026 Yesode. Documento conceitual de arquitetura comercial.</small>
        </div>
      </footer>
    </div>
  );
};

export default GlobalDeveloperProposal;
