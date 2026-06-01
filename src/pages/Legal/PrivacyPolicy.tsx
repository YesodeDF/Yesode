import React from 'react';
import { Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Legal.scss';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="ys-legal-page">
      <div className="ys-grid-bg" />
      <div className="ys-orb ys-orb--legal" />
      <div className="ys-orb ys-orb--legal-2" />

      <div className="container ys-legal-container">
        <div className="ys-legal-header">
          <Link to="/" className="ys-eyebrow" style={{ textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
            <ArrowLeft size={14} /> Voltar para a Home
          </Link>
          <h1 className="ys-legal-title gradient-text">
            Política de <span className="gradient-text-gold">Privacidade</span>
          </h1>
          <div className="ys-legal-meta">
            <span>
              <Clock size={12} /> Última atualização: 1 de junho de 2026
            </span>
            <span>
              <Shield size={12} /> Em conformidade com a LGPD (Lei nº 13.709/18)
            </span>
          </div>
        </div>

        <div className="ys-legal-content">
          <p>
            A <strong>YESODE CONSULTORIA E SERVIÇOS DE TECNOLOGIA LTDA</strong> ("Yesode"), 
            inscrita sob o CNPJ/MF nº 53.649.336/0001-38, leva a privacidade e a segurança da informação extremamente a sério. 
            Esta Política de Privacidade descreve de forma clara e transparente como tratamos os dados pessoais coletados 
            por meio de nosso site oficial e canais de atendimento, em total conformidade com a 
            <strong> Lei Geral de Proteção de Dados Pessoais (LGPD) - Lei Federal nº 13.709/2018</strong>.
          </p>

          <h2>1. Escopo e Princípios B2B</h2>
          <p>
            A Yesode atua exclusivamente no modelo <strong>B2B (Business-to-Business)</strong>. Nossos serviços são desenhados para 
            organizações corporativas críticas, e toda a nossa comunicação visa estabelecer relações estritamente profissionais. 
            Por essa razão, todos os dados coletados têm a finalidade estrita de qualificação comercial de empresas e suas respectivas demandas 
            tecnológicas.
          </p>
          <p>
            Em decorrência disso, <strong>bloqueamos proativamente a entrada de domínios de e-mail pessoais/genéricos</strong> 
            (como @gmail.com, @hotmail.com, @outlook.com, @yahoo.com e @icloud.com) em nosso formulário de captura de leads, 
            exigindo a inserção de e-mails corporativos.
          </p>

          <h2>2. Quais dados coletamos e por quê?</h2>
          <p>
            Coletamos apenas as informações estritamente necessárias enviadas voluntariamente por você ao solicitar uma 
            consultoria estratégica gratuita. Os dados coletados são:
          </p>
          <ul>
            <li><strong>Nome Completo:</strong> Para identificar o seu contato de forma personalizada e profissional.</li>
            <li><strong>E-mail Corporativo:</strong> Para viabilizar a comunicação direta entre nossos engenheiros fundadores e a sua empresa.</li>
            <li><strong>Nome da Empresa:</strong> Para que possamos analisar previamente o contexto corporativo, arquitetura de sistemas e possíveis necessidades técnicas antes da primeira reunião.</li>
          </ul>

          <div className="ys-legal-highlight-box">
            <p>
              <strong>PROIBIÇÃO DE VENDA DE DADOS:</strong> A Yesode não vende, não aluga, não compartilha, não cede e não distribui 
              sob nenhuma hipótese as suas informações cadastrais a parceiros comerciais ou a quaisquer terceiros. Seus dados são 
              utilizados unicamente para fins de prospecção comercial internos da própria Yesode.
            </p>
          </div>

          <h2>3. Base Legal para o Tratamento de Dados</h2>
          <p>
            O tratamento de dados pessoais realizado pela Yesode ampara-se nas seguintes bases legais estabelecidas pela LGPD:
          </p>
          <ol>
            <li><strong>Execução de Contrato ou Procedimentos Preliminares (Art. 7º, V, da LGPD):</strong> Necessário para viabilizar as reuniões estratégicas solicitadas ativamente por você no preenchimento do formulário.</li>
            <li><strong>Legítimo Interesse (Art. 7º, IX, da LGPD):</strong> Para aprimoramento interno de nossa inteligência comercial e prevenção contra fraudes e spam.</li>
          </ol>

          <h2>4. Armazenamento e Segurança da Informação</h2>
          <p>
            Os dados coletados pelo nosso formulário são transmitidos utilizando protocolos de segurança de última geração 
            (criptografia SSL/TLS em trânsito) e processados através da infraestrutura cloud segura da <strong>Vercel</strong> e 
            do gateway corporativo de e-mail da <strong>Resend</strong>. 
          </p>
          <p>
            Mantemos os seus dados armazenados apenas pelo tempo estritamente necessário para cumprir as finalidades descritas nesta política 
            ou até que você exerça seu direito de exclusão.
          </p>

          <h2>5. Seus Direitos Garantidos pela LGPD (Art. 18)</h2>
          <p>
            Como titular dos dados pessoais, você pode exercer os seguintes direitos a qualquer momento e sem custos adicionais:
          </p>
          <ul>
            <li><strong>Confirmação e Acesso:</strong> Confirmar a existência de tratamento e acessar os dados que mantemos sobre você.</li>
            <li><strong>Retificação:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
            <li><strong>Eliminação (Exclusão):</strong> Solicitar a exclusão total de seus dados pessoais do nosso banco de dados.</li>
            <li><strong>Revogação de Consentimento:</strong> Revogar sua permissão para comunicações comerciais futuras.</li>
          </ul>

          <h2>6. Cookies e Análise de Tráfego Anonimizada</h2>
          <p>
            Para garantir uma experiência de navegação premium e otimizar a infraestrutura do nosso site, utilizamos ferramentas de análise de 
            tráfego estáticas (como o <strong>Vercel Analytics</strong> e o <strong>Vercel Speed Insights</strong>). 
          </p>
          <p>
            Essas ferramentas coletam dados <strong>completamente anonimizados</strong> (como latência de rede, navegador utilizado e tempo de carregamento das páginas). 
            Nenhum dado pessoal capaz de identificar o usuário é armazenado ou analisado por esses serviços de telemetria técnica.
          </p>

          <h2>7. Alterações nesta Política</h2>
          <p>
            Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente para refletir mudanças regulatórias, jurisprudenciais 
            ou avanços tecnológicos na nossa arquitetura. A data da última atualização sempre estará visível no topo deste documento.
          </p>

          <div className="ys-legal-contact-card">
            <h3>Fale com nosso Encarregado de Dados (DPO)</h3>
            <p>
              Caso queira exercer qualquer um de seus direitos estabelecidos pela LGPD ou sanar dúvidas sobre nossa arquitetura de proteção de dados, entre em contato direto com o nosso DPO (Data Protection Officer):
            </p>
            <a href="mailto:dpo@yesode.com.br" className="ys-contact-email">
              dpo@yesode.com.br
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
