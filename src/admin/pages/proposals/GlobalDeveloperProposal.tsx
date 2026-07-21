import React, { useState } from 'react';
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

export const GlobalDeveloperProposal: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sendingOption, setSendingOption] = useState<'A' | 'B' | null>(null);
  const [approvedOption, setApprovedOption] = useState<'A' | 'B' | null>(null);

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
              <span className="gd-nav-title-sub">Apresentação Conceitual B2B</span>
            </div>
          </div>

          <div className="gd-nav-desktop">
            <button onClick={() => scrollToSection('diagnostico')}>Diagnóstico</button>
            <button onClick={() => scrollToSection('opcao-a')}>Proposta A (All-in-One)</button>
            <button onClick={() => scrollToSection('opcao-b')}>Proposta B (Google)</button>
            <button onClick={() => scrollToSection('comparativo')}>Comparativo</button>
            <button onClick={() => scrollToSection('tecnologia')}>Arquitetura</button>
            <button onClick={() => scrollToSection('proximos-passos')}>Próximos Passos</button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gd-hero">
        <div className="gd-container">
          <span className="gd-hero-tag">
            <Sparkles size={14} /> Proposta de Arquitetura Comercial Exclusiva
          </span>
          <h1 className="gd-hero-title">
            Transformação Digital para a <span>Global Developer</span>
          </h1>
          <p className="gd-hero-desc">
            Duas abordagens estratégicas para eliminar o atrito operacional das professoras, elevar a retenção de alunos e consolidar a plataforma de ensino com máxima escalabilidade.
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
              Ver Opções de Arquitetura <ChevronRight size={18} />
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
              Explorar Diagnóstico
            </button>
          </div>
        </div>
      </section>

      {/* Diagnóstico Atual */}
      <section id="diagnostico" className="gd-section">
        <div className="gd-container">
          <div className="gd-section-header">
            <h2>O Desafio Atual da Operação</h2>
            <p>Atualmente, a gestão educacional e os professores operam divididos em três ferramentas desconectadas, criando atrito pedagógico e diluição de marca.</p>
          </div>

          <div className="gd-problems-grid">
            <div className="gd-problem-card">
              <div className="gd-problem-icon">
                <BookOpen size={24} />
              </div>
              <h3>Google Classroom</h3>
              <p>Interface genérica que não reforça a identidade da Global Developer. Professores encontram dificuldades em organizar turmas e sincronizar presenças.</p>
            </div>

            <div className="gd-problem-card">
              <div className="gd-problem-icon">
                <Video size={24} />
              </div>
              <h3>Google Meet (Aulas ao Vivo)</h3>
              <p>Necessidade de criar e disparar links manualmente. As Breakout Rooms exigem múltiplos cliques manuais, pausando o ritmo pedagógico da aula.</p>
            </div>

            <div className="gd-problem-card">
              <div className="gd-problem-icon">
                <PlayCircle size={24} />
              </div>
              <h3>Hubla (Vídeos Gravados)</h3>
              <p>Plataforma de terceiros com taxas recorrentes. O aluno é obrigado a trocar de aba e login para assistir o acervo de aulas gravadas.</p>
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
                <span className="badge gold">Opção A — Solução Proprietária</span>
                <h3>Plataforma Educacional Premium (All-in-One)</h3>
                <p>Ecossistema proprietário de ponta a ponta. Substitui o Google Meet, o Google Classroom e a Hubla por um único ambiente unificado sob a marca da Global Developer.</p>
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
                <strong style={{ color: 'white', fontSize: '0.95rem', display: 'block' }}>Valor Agregado: Experiência 100% White-Label</strong>
                <span style={{ color: '#a5b4fc', fontSize: '0.875rem' }}>O aluno não entra no Google; ele interage diretamente com a plataforma da instituição, elevando o valor percebido e a retenção.</span>
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
                <span className="badge emerald">Opção B — Automação & Eficiência</span>
                <h3>O Orquestrador Inteligente (Interface Google Workspace)</h3>
                <p>Uma camada de interface sob medida que oculta a complexidade do Google Workspace. A instituição aproveita os servidores do Google com usabilidade fluida para professores.</p>
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
                <strong style={{ color: 'white', fontSize: '0.95rem', display: 'block' }}>Valor Agregado: Curva de Aprendizado Imediata</strong>
                <span style={{ color: '#6ee7b7', fontSize: '0.875rem' }}>Resolve a dor exata das professoras sem exigir migração abrupta do acervo existente, com prazo de entrega reduzido.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo Tabela */}
      <section id="comparativo" className="gd-section">
        <div className="gd-container">
          <div className="gd-section-header">
            <h2>Matriz Comparativa das Arquiteturas</h2>
            <p>Analise lado a lado os diferenciais de cada abordagem para alinhar com os objetivos estratégicos da Global Developer.</p>
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
            <h2>Stack Tecnológico Recomendado</h2>
            <p>Tecnologias modernas de alta confiabilidade corporativa selecionadas para garantir baixa latência e segurança.</p>
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
            <h2>Próximos Passos — Convite para Alinhamento</h2>
            <p>Esta apresentação apresenta os caminhos arquiteturais possíveis. Selecione a opção que melhor se alinha à visão da gerência para agendarmos uma sessão de demonstração e detalhamento de escopo.</p>
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
                  'Enviando Convite...'
                ) : approvedOption === 'A' ? (
                  <>Solicitação Registrada <CheckCircle2 size={18} /></>
                ) : (
                  <>Solicitar Apresentação Técnica (Opção A) <CalendarCheck size={18} /></>
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
                  'Enviando Convite...'
                ) : approvedOption === 'B' ? (
                  <>Solicitação Registrada <CheckCircle2 size={18} /></>
                ) : (
                  <>Solicitar Apresentação Técnica (Opção B) <CalendarCheck size={18} /></>
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
