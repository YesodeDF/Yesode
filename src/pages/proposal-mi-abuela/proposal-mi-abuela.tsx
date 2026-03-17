import React, { useState } from 'react';
import './proposal-mi-abuela.scss';
import {
    ChevronRight,
    Store,
    Users,
    TrendingUp,
    Globe,
    Database,
    Server,
    Cloud,
    ShieldCheck,
    Search,
    Clock,
    CreditCard,
    CheckCircle2,
    Menu,
    X,
    ChefHat,
    MessageCircle,
    Briefcase
} from 'lucide-react';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');


    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    const handleApprove = async () => {
        if (isSending || emailStatus === 'success') return;

        setIsSending(true);
        setEmailStatus('idle');

        try {
            const response = await fetch('/api/send-invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'filipe.nogueira@yesode.com',
                    cc: 'davi.ribeiro@yesode.com',
                    subject: 'Proposta Aprovada: Mi Abuela 🚀',
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #0f172a;">Proposta Aprovada! 🎉</h2>
                            <p>A proposta para o projeto <strong>Mi Abuela</strong> foi aprovada através da plataforma.</p>
                            <p><strong>Detalhes:</strong></p>
                            <ul>
                                <li><strong>Projeto:</strong> Transformação Digital Mi Abuela</li>
                                <li><strong>Status:</strong> Aprovado</li>
                                <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
                            </ul>
                            <p>Iniciando os próximos passos conforme o cronograma.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #666;">Enviado via Yesod Proposal System</p>
                        </div>
                    `,
                }),
            });

            if (response.ok) {
                setEmailStatus('success');
            } else {
                throw new Error('Failed to send approval email');
            }
        } catch (error) {
            console.error('Error sending approval email:', error);
            setEmailStatus('error');
            setTimeout(() => setEmailStatus('idle'), 5000);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="app-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="container nav-container">
                    <div className="nav-brand">
                        <div className="nav-logo">Y</div>
                        <div className="nav-titles">
                            <span className="nav-title-main">Yesode</span>
                            <span className="nav-title-sub">Soluções Digitais</span>
                        </div>
                    </div>

                    <div className="nav-desktop">
                        <button onClick={() => scrollToSection('visao')}>Visão Geral</button>
                        <button onClick={() => scrollToSection('estrutura')}>Estrutura</button>
                        <button onClick={() => scrollToSection('tecnologia')}>Tecnologia</button>
                        <button onClick={() => scrollToSection('investimento')}>Investimento</button>
                    </div>

                    <button className="nav-mobile-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="nav-mobile-menu">
                        <button onClick={() => scrollToSection('visao')}>Visão Geral</button>
                        <button onClick={() => scrollToSection('estrutura')}>Estrutura</button>
                        <button onClick={() => scrollToSection('tecnologia')}>Tecnologia</button>
                        <button onClick={() => scrollToSection('investimento')}>Investimento</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg-1"></div>
                <div className="hero-bg-2"></div>

                <div className="hero-content-wrapper">
                    <span className="hero-tag">Proposta Comercial Exclusiva</span>
                    <h1 className="hero-title">
                        Transformação Digital para <span>Mi Abuela</span>
                    </h1>
                    <p className="hero-desc">
                        Consolidando a marca como referência em empanadas argentinas premium acessíveis no Brasil, através de uma plataforma digital moderna e escalável.
                    </p>
                    <div className="hero-buttons">
                        <button onClick={() => scrollToSection('investimento')} className="btn btn-primary">
                            Ver Proposta de Valor <ChevronRight size={20} />
                        </button>
                        <button onClick={() => scrollToSection('visao')} className="btn btn-secondary">
                            Explorar Escopo
                        </button>
                    </div>
                </div>
            </section>

            {/* Objetivos Section */}
            <section id="visao" className="section bg-white">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Objetivos Estratégicos</h2>
                        <p className="section-subtitle">O projeto foi desenhado para atuar em três frentes fundamentais para o crescimento da Mi Abuela.</p>
                    </div>

                    <div className="objectives-grid">
                        <ObjectiveCard
                            icon={<ShieldCheck className="icon-sky" size={32} />}
                            title="Fortalecimento da Marca"
                            desc="Construir uma presença digital moderna que transmita instantaneamente o posicionamento premium e acessível."
                        />
                        <ObjectiveCard
                            icon={<Users className="icon-sky" size={32} />}
                            title="Aquisição de Clientes"
                            desc="Facilitar a descoberta da marca e direcionar fluxos de venda para iFood, WhatsApp e entregadores próprios."
                        />
                        <ObjectiveCard
                            icon={<TrendingUp className="icon-sky" size={32} />}
                            title="Expansão por Franquias"
                            desc="Criar uma estrutura dedicada, profissional e atrativa para captação de novos investidores e franqueados."
                        />
                    </div>
                </div>
            </section>

            {/* Estrutura do Site Section */}
            <section id="estrutura" className="section bg-slate-100">
                <div className="container">
                    <div className="section-header text-left">
                        <h2 className="section-title">Arquitetura da Plataforma</h2>
                        <p className="section-subtitle" style={{ margin: 0 }}>Uma estrutura segmentada e inteligente, desenhada para atender perfeitamente aos três públicos principais da Mi Abuela.</p>
                    </div>

                    <div className="structure-list">
                        <AudienceRow
                            title="Área para Clientes"
                            subtitle="Conteúdo institucional e comercial voltado para o consumidor final."
                            icon={<ChefHat className="icon-slate" size={24} />}
                            items={["Apresentação da História e Conceito", "Cardápio Interativo", "Localização de Unidades", "Integração iFood / WhatsApp"]}
                            goal="Atrair novos clientes e facilitar a conversão."
                            themeClass="theme-sky"
                        />
                        <AudienceRow
                            title="Área para Franqueados"
                            subtitle="Seção estratégica focada em investidores e expansão."
                            icon={<Store className="icon-slate" size={24} />}
                            items={["Apresentação do Modelo de Negócio", "Diferenciais e Suporte", "Processo de Abertura", "Formulário de Captação (Leads)"]}
                            goal="Gerar leads qualificados para novas unidades."
                            themeClass="theme-amber"
                        />
                        <AudienceRow
                            title="Área para Colaboradores"
                            subtitle="Hub de talentos e fortalecimento da cultura interna."
                            icon={<Briefcase className="icon-slate" size={24} />}
                            items={["Página Trabalhe Conosco", "Cadastro de Currículos", "Cultura Mi Abuela", "Vagas Abertas"]}
                            goal="Atração de talentos e employer branding."
                            themeClass="theme-slate"
                        />
                    </div>
                </div>
            </section>

            {/* Funcionalidades & SEO */}
            <section className="section bg-white">
                <div className="container features-grid">
                    <div className="feature-block">
                        <div className="feature-tag">
                            <Database size={16} /> Gestão Total
                        </div>
                        <h3>Painel Administrativo Próprio</h3>
                        <p>Esqueça depender de programadores para mudar um texto. A plataforma contará com uma área administrativa segura e intuitiva para sua equipe gerenciar o negócio digitalmente.</p>
                        <ul className="feature-list">
                            <li><CheckCircle2 size={20} /> <span>Edição de textos e cardápios em tempo real</span></li>
                            <li><CheckCircle2 size={20} /> <span>Atualização de imagens e banners</span></li>
                            <li><CheckCircle2 size={20} /> <span>Gestão de páginas e contatos</span></li>
                            <li><CheckCircle2 size={20} /> <span>Integração com CRM e ferramentas de email marketing</span></li>
                        </ul>
                    </div>

                    <div className="feature-card">
                        <div className="feature-tag">
                            <Search size={16} /> Descoberta Digital
                        </div>
                        <h3>Otimização IA e SEO</h3>
                        <p>A análise da Yesode identificou que os concorrentes (La Guapa, Hubt, Tango Food) possuem presença digital frágil. Transformaremos isso na sua maior vantagem competitiva.</p>

                        <div className="seo-cards">
                            <div className="seo-card">
                                <div className="seo-icon"><Globe size={20} /></div>
                                <div>
                                    <h4>SEO Avançado</h4>
                                    <p>Estrutura semântica para dominar as buscas no Google.</p>
                                </div>
                            </div>
                            <div className="seo-card">
                                <div className="seo-icon"><MessageCircle size={20} /></div>
                                <div>
                                    <h4>Preparado para IAs</h4>
                                    <p>Dados estruturados para ser recomendado pelo ChatGPT e outras IAs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section id="tecnologia" className="tech-section">
                <div className="container">
                    <h2 className="section-title">Infraestrutura Tecnológica Premium</h2>
                    <p className="section-subtitle">Utilizamos o que há de mais moderno em Cloud Computing para garantir performance, segurança e escalabilidade para o crescimento das franquias.</p>

                    <div className="tech-grid">
                        <TechBadge icon={<Globe size={24} />} name="Vercel & Cloudflare" type="Frontend / Edge" />
                        <TechBadge icon={<Server size={24} />} name="Render & Railway" type="Backend / Serviços" />
                        <TechBadge icon={<Database size={24} />} name="Supabase" type="Banco de Dados" />
                        <TechBadge icon={<Cloud size={24} />} name="AWS S3" type="Storage (Imagens)" />
                    </div>

                    <div className="tech-cost">
                        <div className="tech-cost-info">
                            <h4>Custo estimado de servidores</h4>
                            <p>Pagamento direto aos provedores em nuvem</p>
                        </div>
                        <div className="tech-cost-value">
                            <strong>US$ 35 - 70 <small>/mês</small></strong>
                            <span>Aprox. R$ 180 a R$ 350 mensais</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Investment & Timeline */}
            <section id="investimento" className="section bg-slate-50">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Proposta de Investimento</h2>
                        <p className="section-subtitle">Um investimento estratégico para posicionar a Mi Abuela à frente da concorrência.</p>
                    </div>

                    <div className="investment-grid">
                        <div className="timeline-card">
                            <div className="timeline-header">
                                <Clock size={24} />
                                <h3>Cronograma</h3>
                            </div>
                            <div className="timeline-time">8 a 10 <span>semanas</span></div>
                            <p className="timeline-desc">Prazo estimado para entrega completa, sujeito à agilidade nas validações.</p>

                            <div className="timeline-steps">
                                {["Planejamento Estratégico", "Design de Interface", "Desenvolvimento", "Testes de Qualidade", "Implantação"].map((step, i) => (
                                    <div key={i} className={`step ${i === 2 ? 'active' : ''}`}>
                                        <div className="step-dot"></div>
                                        <span className="step-text">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pricing-card">
                            <div className="pricing-bg"></div>
                            <div className="pricing-content">
                                <div className="pricing-header">
                                    <div>
                                        <h3>Desenvolvimento da Plataforma</h3>
                                        <p>Solução digital completa, painel administrativo e infraestrutura cloud configurada.</p>
                                    </div>
                                    <div className="pricing-total">
                                        <span>Investimento Total</span>
                                        <strong>R$ 28.000</strong>
                                    </div>
                                </div>

                                <div className="pricing-details">
                                    <div className="payment-struct">
                                        <h4><CreditCard size={18} /> Estrutura de Pagamento</h4>
                                        <ul className="payment-list">
                                            <li><span>Contratação (30%)</span> <strong>R$ 8.400</strong></li>
                                            <li><span>Desenvolvimento (40%)</span> <strong>R$ 11.200</strong></li>
                                            <li><span>Entrega Final (30%)</span> <strong>R$ 8.400</strong></li>
                                        </ul>
                                    </div>
                                    <div className="evolution-box">
                                        <h4>Evolução Contínua (Opcional)</h4>
                                        <p>Suporte técnico, monitoramento, melhorias contínuas e otimização de performance após o lançamento.</p>
                                        <strong>R$ 1.200 <small>/mês</small></strong>
                                    </div>
                                </div>

                                <button
                                    className={`btn-approve ${emailStatus === 'success' ? 'success' : ''} ${isSending ? 'loading' : ''}`}
                                    onClick={handleApprove}
                                    disabled={isSending || emailStatus === 'success'}
                                >
                                    {isSending ? (
                                        <>Processando... <div className="spinner"></div></>
                                    ) : emailStatus === 'success' ? (
                                        <>Proposta Aprovada! <CheckCircle2 size={20} /></>
                                    ) : emailStatus === 'error' ? (
                                        <>Erro ao Aprovar. Tente Novamente <X size={20} /></>
                                    ) : (
                                        <>Aprovar Proposta e Iniciar Projeto <ChevronRight size={20} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-content">
                    <div>
                        <div className="footer-logo">
                            <div className="footer-logo-icon">Y</div>
                            <span>YESODE</span>
                        </div>
                        <p className="footer-desc">Soluções digitais alinhadas aos objetivos de negócio da sua empresa.</p>
                    </div>

                    <div className="footer-credits">
                        <p>Apresentado por</p>
                        <strong>Filipe Nogueira <span>&bull;</span> Davi Ribeiro</strong>
                        <small>© 2026 Yesode Soluções Digitais. Confidencial.</small>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Sub-components
const ObjectiveCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="objective-card">
        <div className="objective-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

const AudienceRow = ({ title, subtitle, items, goal, icon, themeClass }: any) => (
    <div className={`audience-row ${themeClass}`}>
        <div className="audience-info">
            <div className="audience-header">
                {icon}
                <h3>{title}</h3>
            </div>
            <p>{subtitle}</p>
            <div className="audience-goal">
                <span>Objetivo Principal</span>
                <p>{goal}</p>
            </div>
        </div>
        <div className="audience-items-container">
            <div className="audience-items">
                {items.map((item: string, i: number) => (
                    <div key={i} className="audience-item">
                        <CheckCircle2 size={16} className="icon-slate" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const TechBadge = ({ icon, name, type }: { icon: React.ReactNode, name: string, type: string }) => (
    <div className="tech-badge">
        {icon}
        <span>{name}</span>
        <small>{type}</small>
    </div>
);


export default App;