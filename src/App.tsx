import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import './index.css';
import './App.css';

const Landing = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <header className="p-4 flex justify-between items-center max-w-6xl mx-auto">
        <div className="font-bold text-xl tracking-tighter">YESODE</div>
        <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="bg-transparent border border-gray-300 dark:border-gray-700 rounded p-1 text-sm cursor-pointer">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-24">
        <section id="hero" className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">O crescimento do seu negócio está gerando caos operacional?</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">+5 anos estruturando sistemas e projetos em ambientes reais e internacionais</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg w-full md:w-auto transition-transform active:scale-95" aria-label="Quero identificar onde estou perdendo dinheiro">Quero identificar onde estou perdendo dinheiro</button>
        </section>
        <section id="agitation" className="space-y-4">
          <h2 className="text-3xl font-bold">O Custo Oculto do Caos</h2>
          <ul className="list-disc pl-5 space-y-2 text-lg text-gray-700 dark:text-gray-300">
            <li>Tempo da equipe desperdiçado rotineiramente.</li>
            <li>Dinheiro não rastreado sumindo no processo.</li>
            <li>Crescimento travado por limite de braço operacional.</li>
            <li>Decisões tomadas no escuro, baseadas em achismos.</li>
          </ul>
          <p className="font-bold text-red-600 dark:text-red-400">Quanto mais o tempo passa, maior é a perda financeira.</p>
        </section>
        <section id="belief-break" className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold">O problema não é o crescimento. É a base do seu negócio.</h2>
        </section>
        <section id="security" className="text-center">
          <p className="text-xl font-medium border-l-4 border-blue-600 pl-4 py-2 text-left">Começamos com um diagnóstico profundo para entender sua operação antes de qualquer decisão de investimento.</p>
        </section>
        <section id="offer" className="space-y-6">
          <h2 className="text-3xl font-bold">A Operação Estruturada (em 21 dias)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Diagnóstico da operação documentado', 'Mapeamento de gargalos invisíveis', 'Arquitetura do sistema base definida', 'Primeiras automações críticas implementadas', 'Base funcional inicial validada'].map(item => (
              <article key={item} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="font-semibold">{item}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="how-it-works" className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Como Funciona</h2>
          <div className="flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 text-center">
            {['1. Diagnóstico', '2. Estruturação', '3. Implementação'].map(step => (
              <div key={step} className="p-4 w-full md:w-1/3">
                <p className="font-bold text-xl">{step}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="differentiator" className="bg-blue-900 text-white p-8 rounded-xl space-y-4">
          <h2 className="text-2xl font-bold">Por que a Yesode?</h2>
          <ul className="list-none space-y-2">
            <li>✓ Não somos freelancers ou agência genérica.</li>
            <li>✓ Pensamos no negócio antes da tecnologia.</li>
            <li>✓ Construímos base para escalar, não soluções temporárias.</li>
          </ul>
        </section>
        <section id="founders" className="space-y-4">
          <h2 className="text-3xl font-bold">Fundamento & Base</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">Yesode significa fundamento. Acreditamos que toda grande estrutura começa com uma base sólida e inabalável. Vemos o universo projetado por um Grande Arquiteto e trazemos esse princípio de ordem, engenharia e fundação para construir e sustentar o seu negócio.</p>
          <p className="font-bold">— Filipe Nogueira & Davi Ribeiro</p>
        </section>
        <section id="lead-capture" className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Diagnóstico Gratuito</h2>
          <form className="space-y-4 flex flex-col" onSubmit={e => e.preventDefault()}>
            <label className="flex flex-col"><span className="font-medium mb-1">Nome</span><input type="text" required className="p-3 border rounded dark:bg-gray-900 dark:border-gray-700" /></label>
            <label className="flex flex-col"><span className="font-medium mb-1">Empresa</span><input type="text" required className="p-3 border rounded dark:bg-gray-900 dark:border-gray-700" /></label>
            <label className="flex flex-col"><span className="font-medium mb-1">Desafio principal</span><textarea required className="p-3 border rounded dark:bg-gray-900 dark:border-gray-700 h-24"></textarea></label>
            <label className="flex flex-col"><span className="font-medium mb-1">Faturamento mensal</span>
              <select required className="p-3 border rounded dark:bg-gray-900 dark:border-gray-700">
                <option value="">Selecione</option><option value="ate-30k">Até R$ 30.000</option><option value="30k-100k">R$ 30.000 a R$ 100.000</option><option value="100k-300k">R$ 100.000 a R$ 300.000</option><option value="mais-300k">Mais de R$ 300.000</option>
              </select>
            </label>
            <fieldset className="p-3 border rounded dark:border-gray-700 space-y-2">
              <legend className="font-medium px-1">Você está pronto para investir na estrutura do seu sistema nos próximos 30 dias?</legend>
              <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="readiness" value="sim" required /><span>Sim</span></label>
              <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="readiness" value="avaliando" required /><span>Ainda avaliando</span></label>
            </fieldset>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition-transform active:scale-95 mt-4">Receber diagnóstico da minha operação</button>
          </form>
        </section>
      </main>
      <footer className="text-center p-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4">A desorganização está limitando o seu potencial.</h2>
        <p className="mb-6">Organizamos e automatizamos a operação do seu negócio para você crescer com controle e sem caos.</p>
        <button onClick={() => document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' })} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">Resolver meu caos agora</button>
      </footer>
    </div>
  );
};
export default function App() { return <ThemeProvider><Landing /></ThemeProvider>; }
