import React from 'react';
import { YesodePdfTemplate } from './YesodePdfTemplate';
import type { ProposalPdfSection } from './YesodePdfTemplate';

export const GlobalDeveloperPdf: React.FC = () => {
  const sections: ProposalPdfSection[] = [
    {
      title: '01. Diagnóstico da Operação',
      subtitle: 'Principais dores e gargalos operacionais identificados na plataforma atual',
      content: [
        'A análise da equipe Yesode revelou que a Global Developer opera hoje de forma extremamente fragmentada, dividida em três plataformas concorrentes que não se comunicam.',
        'Esse cenário impõe um custo operacional alto para os professores, dificulta a consistência pedagógica e dilui a marca institucional (o aluno sente que entra no Google, não na Global Developer).'
      ],
      items: [
        'Google Classroom: Interface genérica com zero identidade visual da Global Developer. Dificuldades recorrentes no gerenciamento e sincronização de presenças dos alunos.',
        'Google Meet: Fluxo de videoconferências manual. A criação e o envio de links consomem tempo, e a funcionalidade de sub-salas (breakout rooms) exige configuração manual e lenta.',
        'Hubla: Hospedagem e controle de acesso a aulas gravadas em ambiente de terceiros com taxas de transação recorrentes.'
      ]
    },
    {
      title: '02. Proposta A — Plataforma Premium (All-in-One)',
      subtitle: 'Ecossistema proprietário com controle total e marca própria (White-Label)',
      content: [
        'A Proposta A prevê a substituição completa das ferramentas Google e Hubla por um ecossistema educacional unificado de alta performance, projetado do zero.',
        'Ao centralizar as operações em um domínio próprio, a Global Developer ganha controle absoluto sobre a retenção de alunos e elimina a burocracia operacional dos professores.'
      ],
      items: [
        'Motor de Vídeo Nativo (WebRTC): Transmissão ao vivo integrada direto na plataforma, sem necessidade de baixar aplicativos ou abrir links externos.',
        'Breakout Rooms 1-Click: A professora aciona a divisão de duplas no painel administrativo e os alunos são redirecionados automaticamente, com contagem regressiva.',
        'Módulo Video on Demand (VoD): Acervo de aulas gravadas com layout no estilo de streaming moderno, sem taxas de intermediação.',
        'LMS Completo: Gestão automatizada de presença, turmas, materiais de apoio e tarefas de forma centralizada.'
      ]
    },
    {
      title: '03. Proposta B — O Orquestrador Inteligente',
      subtitle: 'Capa de usabilidade inteligente otimizando a API do Google Workspace',
      content: [
        'A Proposta B é focada em velocidade de entrega e aproveitamento de custos. Em vez de criar um motor de vídeo próprio, a Yesode constrói um "orquestrador" por cima do Google Workspace.',
        'O sistema automatiza as tarefas manuais por trás da criação de aulas, permitindo que a Global Developer use a estabilidade do Google for Education de maneira limpa.'
      ],
      items: [
        'Dashboard Unificado do Professor: Cronograma diário com botão "Iniciar Aula" que gera a reunião no Meet e notifica os alunos instantaneamente via API.',
        'Salas de Apoio Automatizadas: Scripts integrados à API do Meet que pré-organizam as duplas e sub-salas de forma ágil.',
        'Hub Centralizador de Alunos: Portal simples de login onde o aluno visualiza os links das aulas ao vivo e as gravações salvas de forma organizada.'
      ]
    },
    {
      title: '04. Comparativo de Arquitetura',
      subtitle: 'Diferenças estratégicas entre a solução All-in-One e o Orquestrador',
      content: [
        'Abaixo, detalhamos as principais diferenças em termos de recursos e infraestrutura para auxiliar na tomada de decisão estratégica.'
      ],
      table: {
        headers: ['Recurso / Critério', 'Opção A (All-in-One)', 'Opção B (Orquestrador)'],
        rows: [
          ['Transmissão ao Vivo', 'Nativa via WebRTC', 'Google Meet via API'],
          ['Breakout Rooms', '1-Click com timer nativo', 'Configuração via API'],
          ['Gestão de Gravações', 'Painel próprio estilo Netflix', 'Integração de links do Drive'],
          ['Identidade Visual', '100% Personalizada', 'Customizada com infra Google'],
          ['Tempo de Desenvolvimento', '10 a 14 semanas', '4 a 6 semanas'],
          ['Custos de Servidores', 'Tráfego de Vídeo Cloud', 'Mínimo (Google Workspace)']
        ]
      }
    },
    {
      title: '05. Stack Tecnológica & Reunião Técnica',
      subtitle: 'Próximos Passos para o alinhamento de escopo',
      content: [
        'Recomendamos a utilização de tecnologias modernas e escaláveis de computação em nuvem para sustentar o crescimento de alunos sem degradação de desempenho:',
        '• LiveKit & WebRTC para transmissão em tempo real de baixíssima latência (Opção A).',
        '• Cloudflare Stream & AWS S3 para processamento e entrega otimizada de vídeo adaptativo (Opção A).',
        '• Supabase (PostgreSQL) para armazenamento íntegro e escalável de dados de turmas e usuários.',
        '• Hospedagem na Vercel & Node.js para APIs Serverless e carregamento imediato da aplicação.',
        'Ficamos à disposição para agendarmos uma sessão de demonstração técnica e alinhamento de escopo conforme a opção de maior interesse da gerência.'
      ]
    }
  ];

  return (
    <YesodePdfTemplate
      clientName="Global Developer"
      clientSubtitle="Solução e Arquitetura de Plataforma Educacional Sob Medida"
      accentColor="#6366f1" // Indigo
      sections={sections}
    />
  );
};

export default GlobalDeveloperPdf;
