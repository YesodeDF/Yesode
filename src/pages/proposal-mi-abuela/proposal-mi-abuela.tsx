import React, { useState } from 'react';
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
  Smartphone, 
  Clock, 
  CreditCard, 
  CheckCircle2,
  Menu,
  X,
  ChefHat,
  MessageCircle,
  Briefcase
} from 'lucide-react';

const ProposalMiAbuela = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
                Y
              </div>
              <div>
                <span className="block font-bold text-lg leading-tight text-slate-900">Yesode</span>
                <span className="block text-xs text-slate-500 font-medium tracking-wider uppercase">Soluções Digitais</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('visao')} className="text-sm font-medium hover:text-sky-600 transition-colors">Visão Geral</button>
              <button onClick={() => scrollToSection('estrutura')} className="text-sm font-medium hover:text-sky-600 transition-colors">Estrutura</button>
              <button onClick={() => scrollToSection('tecnologia')} className="text-sm font-medium hover:text-sky-600 transition-colors">Tecnologia</button>
              <button onClick={() => scrollToSection('investimento')} className="text-sm font-medium hover:text-sky-600 transition-colors">Investimento</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-slate-900">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <button onClick={() => scrollToSection('visao')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md">Visão Geral</button>
            <button onClick={() => scrollToSection('estrutura')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md">Estrutura</button>
            <button onClick={() => scrollToSection('tecnologia')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md">Tecnologia</button>
            <button onClick={() => scrollToSection('investimento')} className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 rounded-md">Investimento</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
        {/* Gradients inspirados na bandeira da Argentina */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-sky-500 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-amber-400 rounded-full blur-[100px] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-800 border border-slate-700 text-sky-400 text-xs font-bold tracking-widest uppercase mb-6">
            Proposta Comercial Exclusiva
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight mb-6">
            Transformação Digital para <span className="text-sky-400 italic">Mi Abuela</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Consolidando a marca como referência em empanadas argentinas premium acessíveis no Brasil, através de uma plataforma digital moderna e escalável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => scrollToSection('investimento')} className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-lg font-medium transition-all flex items-center justify-center shadow-lg shadow-sky-900/50">
              Ver Proposta de Valor <ChevronRight size={20} className="ml-2" />
            </button>
            <button onClick={() => scrollToSection('visao')} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-8 py-4 rounded-lg font-medium transition-all">
              Explorar Escopo
            </button>
          </div>
        </div>
      </section>

      {/* Objetivos Section */}
      <section id="visao" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-4">Objetivos Estratégicos</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              O projeto foi desenhado para atuar em três frentes fundamentais para o crescimento da Mi Abuela.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ObjectiveCard 
              icon={<ShieldCheck className="text-sky-600" size={32} />}
              title="Fortalecimento da Marca"
              desc="Construir uma presença digital moderna que transmita instantaneamente o posicionamento premium e acessível."
            />
            <ObjectiveCard 
              icon={<Users className="text-sky-600" size={32} />}
              title="Aquisição de Clientes"
              desc="Facilitar a descoberta da marca e direcionar fluxos de venda para iFood, WhatsApp e entregadores próprios."
            />
            <ObjectiveCard 
              icon={<TrendingUp className="text-sky-600" size={32} />}
              title="Expansão por Franquias"
              desc="Criar uma estrutura dedicada, profissional e atrativa para captação de novos investidores e franqueados."
            />
          </div>
        </div>
      </section>

      {/* Estrutura do Site Section */}
      <section id="estrutura" className="py-24 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-4">Arquitetura da Plataforma</h2>
              <p className="text-lg text-slate-600">
                Uma estrutura segmentada e inteligente, desenhada para atender perfeitamente aos três públicos principais da Mi Abuela.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <AudienceRow 
              title="Área para Clientes"
              subtitle="Conteúdo institucional e comercial voltado para o consumidor final."
              icon={<ChefHat className="text-slate-400" size={24} />}
              items={[
                "Apresentação da História e Conceito",
                "Cardápio Interativo",
                "Localização de Unidades",
                "Integração iFood / WhatsApp"
              ]}
              goal="Atrair novos clientes e facilitar a conversão."
              color="border-l-sky-500"
            />
            <AudienceRow 
              title="Área para Franqueados"
              subtitle="Seção estratégica focada em investidores e expansão."
              icon={<Store className="text-slate-400" size={24} />}
              items={[
                "Apresentação do Modelo de Negócio",
                "Diferenciais e Suporte",
                "Processo de Abertura",
                "Formulário de Captação (Leads)"
              ]}
              goal="Gerar leads qualificados para novas unidades."
              color="border-l-amber-400"
            />
            <AudienceRow 
              title="Área para Colaboradores"
              subtitle="Hub de talentos e fortalecimento da cultura interna."
              icon={<Briefcase className="text-slate-400" size={24} />}
              items={[
                "Página Trabalhe Conosco",
                "Cadastro de Currículos",
                "Cultura Mi Abuela",
                "Vagas Abertas"
              ]}
              goal="Atração de talentos e employer branding."
              color="border-l-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Funcionalidades & SEO */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full text-slate-700 text-sm font-medium mb-6">
                <Database size={16} className="text-sky-600"/>
                <span>Gestão Total</span>
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6">Painel Administrativo Próprio</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Esqueça depender de programadores para mudar um texto. A plataforma contará com uma área administrativa segura e intuitiva para sua equipe gerenciar o negócio digitalmente.
              </p>
              <ul className="space-y-4">
                {[
                  "Edição de textos e cardápios em tempo real",
                  "Atualização de imagens e banners",
                  "Gestão de páginas e contatos",
                  "Integração com CRM e ferramentas de email marketing"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="text-sky-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-700 text-sm font-medium mb-6 shadow-sm">
                <Search size={16} className="text-sky-600"/>
                <span>Descoberta Digital</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Otimização IA e SEO</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                A análise da Yesode identificou que os concorrentes (La Guapa, Hubt, Tango Food) possuem presença digital frágil. Transformaremos isso na sua maior vantagem competitiva.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="text-sky-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">SEO Avançado</h4>
                    <p className="text-xs text-slate-500">Estrutura semântica para dominar as buscas no Google.</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="text-sky-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Preparado para IAs</h4>
                    <p className="text-xs text-slate-500">Dados estruturados para ser recomendado pelo ChatGPT e outras IAs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tecnologia" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Infraestrutura Tecnológica Premium</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
            Utilizamos o que há de mais moderno em Cloud Computing para garantir performance, segurança e escalabilidade para o crescimento das franquias.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <TechBadge icon={<Globe />} name="Vercel & Cloudflare" type="Frontend / Edge" />
            <TechBadge icon={<Server />} name="Render & Railway" type="Backend / Serviços" />
            <TechBadge icon={<Database />} name="Supabase" type="Banco de Dados" />
            <TechBadge icon={<Cloud />} name="AWS S3" type="Storage (Imagens)" />
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-2xl mx-auto flex items-center justify-between text-left">
            <div>
              <h4 className="font-bold text-slate-200">Custo estimado de servidores</h4>
              <p className="text-sm text-slate-400">Pagamento direto aos provedores em nuvem</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-sky-400">US$ 35 - 70<span className="text-sm text-slate-500 font-normal">/mês</span></span>
              <span className="block text-xs text-slate-400">Aprox. R$ 180 a R$ 350 mensais</span>
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Timeline */}
      <section id="investimento" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-4">Proposta de Investimento</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Um investimento estratégico para posicionar a Mi Abuela à frente da concorrência.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <Clock className="text-sky-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Cronograma</h3>
              </div>
              <div className="text-3xl font-serif font-bold text-sky-700 mb-2">8 a 10 <span className="text-lg font-sans text-slate-500 font-medium">semanas</span></div>
              <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">Prazo estimado para entrega completa, sujeito à agilidade nas validações.</p>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[
                  "Planejamento Estratégico & Arquitetura",
                  "Design de Interface (UI/UX)",
                  "Desenvolvimento (Front & Back)",
                  "Testes de Qualidade & IA",
                  "Implantação em Produção"
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-sky-600 text-slate-50 group-[.is-active]:text-sky-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 md:group-odd:pr-4 md:group-even:pl-4">
                      <div className="text-sm font-bold text-slate-700">{step}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600 rounded-full blur-[80px] opacity-30 -mr-20 -mt-20"></div>
              
              <div className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-700/50 pb-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Desenvolvimento da Plataforma</h3>
                    <p className="text-slate-400 max-w-sm">Solução digital completa, painel administrativo e infraestrutura cloud configurada.</p>
                  </div>
                  <div className="mt-6 md:mt-0 text-left md:text-right">
                    <span className="text-slate-400 text-sm font-medium block mb-1">Investimento Total</span>
                    <span className="text-5xl font-bold text-white tracking-tight">R$ 28.000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h4 className="text-slate-300 font-bold mb-4 flex items-center"><CreditCard size={18} className="mr-2 text-amber-400"/> Estrutura de Pagamento</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between text-slate-400 text-sm"><span>Contratação (30%)</span> <span className="font-bold text-white">R$ 8.400</span></li>
                      <li className="flex justify-between text-slate-400 text-sm"><span>Desenvolvimento (40%)</span> <span className="font-bold text-white">R$ 11.200</span></li>
                      <li className="flex justify-between text-slate-400 text-sm"><span>Entrega Final (30%)</span> <span className="font-bold text-white">R$ 8.400</span></li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                    <h4 className="text-slate-200 font-bold mb-2">Evolução Contínua (Opcional)</h4>
                    <p className="text-slate-400 text-xs mb-4 leading-relaxed">Suporte técnico, monitoramento, melhorias contínuas e otimização de performance após o lançamento.</p>
                    <div className="text-2xl font-bold text-sky-400">R$ 1.200<span className="text-sm font-normal text-slate-500"> /mês</span></div>
                  </div>
                </div>

                <button className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center group">
                  Aprovar Proposta e Iniciar Projeto <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white font-serif font-bold">Y</div>
              <span className="font-bold text-white tracking-wide">YESODE</span>
            </div>
            <p className="text-sm max-w-xs text-slate-500">
              Soluções digitais alinhadas aos objetivos de negócio da sua empresa.
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white font-serif italic text-lg mb-2">Apresentado por</p>
            <p className="font-medium text-slate-300">Filipe Nogueira <span className="text-slate-600 mx-2">&bull;</span> Davi Ribeiro</p>
            <p className="text-xs text-slate-600 mt-4">© 2026 Yesode Soluções Digitais. Confidencial.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sub-components
const ObjectiveCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

const AudienceRow = ({ title, subtitle, items, goal, icon, color }: any) => (
  <div className={`bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 border border-slate-100 shadow-sm border-l-4 ${color}`}>
    <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8">
      <div className="flex items-center space-x-3 mb-3">
        {icon}
        <h3 className="text-2xl font-serif font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm">{subtitle}</p>
      
      <div className="mt-6 bg-slate-50 p-4 rounded-lg">
        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Objetivo Principal</span>
        <span className="text-sm font-medium text-slate-800">{goal}</span>
      </div>
    </div>
    
    <div className="md:w-2/3 flex items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex items-center space-x-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
            <CheckCircle2 size={16} className="text-slate-400" />
            <span className="text-slate-700 font-medium text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TechBadge = ({ icon, name, type }: { icon: React.ReactNode, name: string, type: string }) => (
  <div className="flex flex-col items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
    <div className="text-slate-400 mb-3">{icon}</div>
    <span className="font-bold text-slate-200 text-sm mb-1">{name}</span>
    <span className="text-xs text-slate-500">{type}</span>
  </div>
);

export default ProposalMiAbuela;