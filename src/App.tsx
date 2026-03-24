import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Clock, TrendingDown, Target, Zap, ShieldCheck } from 'lucide-react';
import './index.css';
import './App.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-600/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10 absolute pointer-events-none" />

      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tighter text-white">YESODE</div>
          <button onClick={() => document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Diagnóstico Gratuito
          </button>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* Hero */}
        <motion.section initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Target size={16} /> +5 anos estruturando operações reais
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            O crescimento do seu negócio está gerando caos operacional?
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Organizamos e automatizamos a operação da sua empresa para você crescer com controle, margem e sem gargalos.
          </motion.p>
          <motion.div variants={fadeUp} className="pt-8">
            <button onClick={() => document.getElementById('lead-capture')?.scrollIntoView({ behavior: 'smooth' })} className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)]">
              <span className="relative z-10 text-lg">Quero identificar onde perco dinheiro</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>
        </motion.section>

        {/* Agitation */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="max-w-5xl mx-auto px-6 mt-40">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">O Custo Oculto do Caos</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Clock, title: 'Tempo Desperdiçado', desc: 'Sua equipe presa em processos manuais e retrabalho diário.' },
              { icon: TrendingDown, title: 'Dinheiro Invisível', desc: 'Furos de caixa e perda de margem não rastreados no processo.' },
              { icon: AlertTriangle, title: 'Crescimento Travado', desc: 'Você chegou no limite de braço. Vender mais significa quebrar a entrega.' },
              { icon: Zap, title: 'Decisões no Escuro', desc: 'Falta de dados precisos força gestão baseada em achismos.' }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 transition-colors">
                <item.icon className="w-8 h-8 text-red-400 mb-6" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} className="mt-12 text-center p-6 rounded-xl bg-red-500/5 border border-red-500/10">
            <p className="text-lg font-medium text-red-400">Quanto mais o tempo passa com a mesma estrutura, maior é a perda financeira diária.</p>
          </motion.div>
        </motion.section>

        {/* Belief Break & Security */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="max-w-4xl mx-auto px-6 mt-40 space-y-12">
          <motion.div variants={fadeUp} className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-500">
              O problema não é o crescimento.<br />É a base do seu negócio.
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-start gap-4 p-6 bg-blue-950/30 border border-blue-900/50 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-blue-400 shrink-0" />
            <p className="text-lg text-blue-100/80 leading-relaxed">
              <strong className="text-white font-semibold">Sem risco no escuro.</strong> Começamos com um diagnóstico profundo para entender sua operação real antes de qualquer decisão de investimento de engenharia.
            </p>
          </motion.div>
        </motion.section>

        {/* Offer */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="max-w-5xl mx-auto px-6 mt-40">
          <motion.div variants={fadeUp} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A Operação Estruturada</h2>
            <p className="text-xl text-slate-400 mt-4">Entregue e validada em 21 dias.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Diagnóstico da operação documentado',
              'Mapeamento de gargalos invisíveis',
              'Arquitetura do sistema base definida',
              'Automações críticas implementadas',
              'Base funcional inicial validada'
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all group">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-slate-200">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Lead Capture */}
        <motion.section id="lead-capture" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="max-w-2xl mx-auto px-6 mt-40">
          <div className="p-8 md:p-12 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <h2 className="text-3xl font-bold tracking-tight mb-2 relative z-10">Diagnóstico Gratuito</h2>
            <p className="text-slate-400 mb-8 relative z-10">Mapearemos onde sua operação está perdendo dinheiro e como estruturá-la para escalar.</p>

            <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nome Completo</label>
                  <input type="text" required className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" placeholder="João Silva" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Empresa</label>
                  <input type="text" required className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Desafio principal hoje</label>
                  <textarea required className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all h-24 resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Faturamento Mensal</label>
                  <select required className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none">
                    <option value="" disabled selected>Selecione uma faixa</option>
                    <option value="ate-30k">Até R$ 30.000</option>
                    <option value="30k-100k">R$ 30.000 a R$ 100.000</option>
                    <option value="100k-300k">R$ 100.000 a R$ 300.000</option>
                    <option value="mais-300k">Mais de R$ 300.000</option>
                  </select>
                </div>
                <div className="pt-4">
                  <label className="block text-sm font-medium text-slate-300 mb-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    Você está pronto para investir na estrutura do seu sistema nos próximos 30 dias?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="ready" value="yes" required className="peer sr-only" />
                      <div className="p-4 rounded-lg border border-slate-800 flex items-center justify-center font-medium text-slate-400 peer-checked:bg-blue-600/20 peer-checked:border-blue-500 peer-checked:text-blue-400 transition-all">
                        Sim, estou pronto
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input type="radio" name="ready" value="no" required className="peer sr-only" />
                      <div className="p-4 rounded-lg border border-slate-800 flex items-center justify-center font-medium text-slate-400 peer-checked:bg-slate-800 peer-checked:border-slate-600 peer-checked:text-white transition-all">
                        Ainda avaliando
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-white text-slate-950 font-bold rounded-lg text-lg hover:bg-slate-200 transition-transform active:scale-[0.98] shadow-lg mt-8">
                Receber Diagnóstico
              </button>
            </form>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
