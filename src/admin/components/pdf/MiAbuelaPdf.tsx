import React from 'react';
import { YesodePdfTemplate } from './YesodePdfTemplate';
import type { ProposalPdfSection } from './YesodePdfTemplate';

export const MiAbuelaPdf: React.FC = () => {
  const sections: ProposalPdfSection[] = [
    {
      title: '01. Objetivos Estratégicos',
      subtitle: 'Três pilares de crescimento desenhados para consolidar a presença digital',
      content: [
        'O projeto de transformação digital da Mi Abuela foi estruturado para atuar em três frentes complementares e essenciais para a expansão do negócio no Brasil.',
        'Ao construir uma plataforma moderna, posicionamos a marca como referência de empanadas argentinas premium e criamos um canal eficiente de vendas e franquias.'
      ],
      items: [
        'Fortalecimento da Marca: Presença digital refinada que transmite de imediato o posicionamento de alta qualidade e acessibilidade.',
        'Aquisição de Clientes: Facilitação da descoberta orgânica e direcionamento estratégico de pedidos para iFood, WhatsApp e delivery próprio.',
        'Expansão por Franquias: Área profissionalizada e dedicada à atração e conversão de novos franqueados e investidores.'
      ]
    },
    {
      title: '02. Arquitetura da Plataforma',
      subtitle: 'Estrutura lógica segmentada para atender aos três públicos-alvo',
      content: [
        'A plataforma digital unificada será dividida em três fluxos principais de navegação para maximizar a conversão de cada perfil de usuário.'
      ],
      items: [
        'Área para Clientes: Cardápio interativo e dinâmico, localização intuitiva das unidades e integração direta com canais de vendas (iFood/WhatsApp).',
        'Área para Franqueados: Apresentação detalhada do modelo de negócios, formulário otimizado para captura de leads qualificados e suporte ao investidor.',
        'Área para Colaboradores: Portal "Trabalhe Conosco" profissionalizado, divulgação de vagas abertas e captação estruturada de currículos.'
      ]
    },
    {
      title: '03. Painel de Gestão & Otimização SEO',
      subtitle: 'Autonomia para a equipe e destaque nos motores de busca',
      content: [
        'Diferente de soluções de prateleira, a Yesode constrói sistemas que dão independência operacional completa ao cliente e otimização automatizada para visibilidade comercial.'
      ],
      items: [
        'Painel Administrativo Sob Medida: Atualize fotos, altere textos, crie novas unidades e gerencie leads de franquia sem depender de desenvolvedores.',
        'SEO Avançado e IA: Estrutura técnica otimizada para dominar as buscas orgânicas do Google no nicho de empanadas.',
        'Dados Estruturados para IAs: Marcações semânticas que permitem que a Mi Abuela seja recomendada por ferramentas como o ChatGPT.'
      ]
    },
    {
      title: '04. Cronograma & Investimento',
      subtitle: 'Orçamento de desenvolvimento de software e evolução contínua',
      content: [
        'O orçamento abaixo engloba todo o ciclo de vida do projeto: especificação técnica, design de interface sob medida, programação, testes e publicação em produção.'
      ],
      table: {
        headers: ['Fase / Item', 'Entrega', 'Investimento'],
        rows: [
          ['Fase 1: Configuração & Design', 'Semana 1 a 3', 'R$ 8.400 (30%)'],
          ['Fase 2: Desenvolvimento do Site', 'Semana 4 a 6', 'R$ 11.200 (40%)'],
          ['Fase 3: Painel Admin & Deploy', 'Semana 7 a 8', 'R$ 8.400 (30%)'],
          ['Suporte & Evolução Contínua', 'Mensal (Opcional)', 'R$ 1.500 /mês']
        ]
      }
    }
  ];

  return (
    <YesodePdfTemplate
      clientName="Mi Abuela"
      clientSubtitle="Plataforma Digital de Vendas, Franquias e Atração de Talentos"
      accentColor="#0ea5e9" // Sky Blue
      sections={sections}
    />
  );
};

export default MiAbuelaPdf;
