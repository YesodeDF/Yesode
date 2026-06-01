import React from 'react';
import { Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Legal.scss';

export const TermsOfUse: React.FC = () => {
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
            Termos de <span className="gradient-text-gold">Uso</span>
          </h1>
          <div className="ys-legal-meta">
            <span>
              <FileText size={12} /> Última atualização: 1 de junho de 2026
            </span>
            <span>
              <Lock size={12} /> Confidencialidade e Propriedade Intelectual Asseguradas
            </span>
          </div>
        </div>

        <div className="ys-legal-content">
          <p>
            Seja bem-vindo ao portal da <strong>YESODE CONSULTORIA E SERVIÇOS DE TECNOLOGIA LTDA</strong> ("Yesode"). 
            Estes Termos de Uso disciplinam as condições de navegação e utilização do nosso site oficial e a interação com nosso canal 
            comercial e gateway de prospecção. 
          </p>
          <p>
            Ao utilizar nosso site ou enviar dados pelo formulário de consultoria, você declara que compreende e concorda integralmente com as 
            condições descritas neste documento. Caso não concorde, solicitamos que não prossiga com a navegação ou envio de dados.
          </p>

          <h2>1. Objeto e Natureza do Site</h2>
          <p>
            Este site tem por finalidade apresentar o portfólio corporativo, o manifesto de engenharia de software, o FAQ de processos 
            e servir como canal inicial de prospecção e engajamento da Yesode com potenciais clientes B2B. As informações publicadas 
            são estratégicas e buscam refletir de forma honesta nossos princípios operacionais e arquitetura conceitual.
          </p>

          <h2>2. Confidencialidade Preliminar (NDA Implícito)</h2>
          <p>
            Sabemos que, ao preencher o formulário para solicitar uma consultoria de arquitetura, você poderá compartilhar conosco dores 
            estratégicas de P&L, gargalos de infraestrutura e informações confidenciais sobre seu ecossistema técnico.
          </p>
          
          <div className="ys-legal-highlight-box">
            <p>
              <strong>GARANTIA DE NDA PRELIMINAR:</strong> Todas as informações fornecidas por você através do nosso formulário de contato são 
              tratadas sob sigilo absoluto. A Yesode garante, sob termos de responsabilidade pré-contratual, confidencialidade total 
              sobre qualquer dado, gargalo técnico ou dor arquitetural compartilhado conosco neste primeiro estágio, atuando sob as premissas de um 
              <strong> Acordo de Não Divulgação (NDA) Preliminar e Implícito</strong>, antes mesmo da assinatura do NDA bilateral formal na primeira reunião.
            </p>
          </div>

          <h2>3. Propriedade Intelectual (IP) e Ausência de Cessão de Direitos</h2>
          <p>
            A proteção à propriedade intelectual é um dos pilares inegociáveis do manifesto Yesode:
          </p>
          <ul>
            <li>
              <strong>Conteúdo do Site:</strong> Todos os logotipos, marcas, layouts de design, textos, códigos-fonte demonstrativos, 
              animações e imagens presentes neste portal são de propriedade intelectual exclusiva da Yesode e protegidos pelas leis de direitos autorais e propriedade industrial.
            </li>
            <li>
              <strong>Propostas de Arquitetura Iniciais:</strong> Estudos de caso simplificados ou visões de arquitetura desenhadas durante a fase inicial gratuita 
              servem para demonstrar nossa senioridade e competência. Nenhum direito intelectual é transferido ao cliente neste momento.
            </li>
            <li>
              <strong>Cessão de Propriedade Intelectual de Projetos:</strong> Conforme nossa tese <em>"Zero Vendor Lock-in"</em>, a propriedade intelectual 
              do código-fonte, dos microsserviços e da arquitetura construídos especificamente para a sua empresa é <strong>100% transferida para você</strong>. 
              No entanto, <strong>essa transferência só se efetiva mediante a assinatura de um contrato formal de prestação de serviços (Master Services Agreement / MSA) 
              e a quitação integral das respectivas etapas financeiras</strong>. Nenhuma propriedade é cedida preliminarmente pela simples interação comercial.
            </li>
          </ul>

          <h2>4. Uso Adequado do Lead Gateway e Proibições</h2>
          <p>
            Ao utilizar o portal e os formulários da Yesode, você se compromete a:
          </p>
          <ul>
            <li>Fornecer apenas informações verídicas, exatas e associadas a uma pessoa jurídica legítima.</li>
            <li>Não utilizar e-mails fictícios ou descartáveis com o intuito de burlar o processo de qualificação de engenharia.</li>
            <li>Não praticar engenharia reversa nas chamadas de API do site, injeção de scripts maliciosos, envio de spam automáticos ou ataques de negação de serviço (DoS/DDoS) contra nossa infraestrutura.</li>
          </ul>
          <p>
            A Yesode reserva-se o direito de rastrear e bloquear proativamente acessos suspeitos, bem como adotar medidas legais criminais e cíveis contra incidentes que violem a integridade de nossos sistemas.
          </p>

          <h2>5. Limitação de Responsabilidade</h2>
          <p>
            O conteúdo disponibilizado no site é fornecido "no estado em que se encontra". Embora nos esforcemos para garantir a precisão de todas as 
            informações conceituais e arquiteturais expostas, os artigos, publicações e posts conceituais não constituem consultoria de engenharia 
            formal até que um escopo detalhado seja desenhado especificamente para o seu cenário no Discovery.
          </p>

          <h2>6. Legislação Aplicável e Foro</h2>
          <p>
            Estes Termos de Uso são regidos pelas leis vigentes na República Federativa do Brasil. Para dirimir qualquer controvérsia decorrente da utilização 
            deste portal, as partes elegem expressamente o <strong>Foro da Comarca de São Paulo, Estado de São Paulo</strong>, com exclusão de qualquer outro, 
            por mais privilegiado que seja.
          </p>

          <div className="ys-legal-contact-card">
            <h3>Dúvidas sobre o Acordo de Confidencialidade ou IP?</h3>
            <p>
              Nossa equipe técnica e jurídica está à disposição para acelerar a revisão do NDA mútuo ou alinhar termos de propriedade intelectual específicos para o seu segmento corporativo.
            </p>
            <a href="mailto:contato@yesode.com.br" className="ys-contact-email">
              contato@yesode.com.br
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
