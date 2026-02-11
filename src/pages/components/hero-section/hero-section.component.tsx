import { motion } from "framer-motion";
import { ArrowRight, Code2, Zap } from "lucide-react";
import heroBg from "@/assets/matrix.gif";
import "./hero-section.component.scss";

export default function HeroSection() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero">
      {/* Background */}
      <div className="hero__background">
        <img src={heroBg} alt="" />
        <div className="hero__overlay" />
      </div>

      {/* Floating decorations */}
      <div className="hero__float hero__float--left" />
      <div className="hero__float hero__float--right" />

      <div className="hero__content">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Zap size={14} />
          <span>Tecnologia que transforma negócios</span>
        </motion.div>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Construímos o <span>futuro digital</span>
          <br />
          da sua empresa
        </motion.h1>

        <motion.p
          className="hero__description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Desenvolvimento de sistemas sob medida, automações inteligentes e
          soluções digitais que impulsionam resultados reais.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button
            className="hero__primary-btn"
            onClick={() => scrollTo("#contato")}
          >
            Iniciar Projeto
            <ArrowRight size={18} />
          </button>

          <button
            className="hero__secondary-btn"
            onClick={() => scrollTo("#servicos")}
          >
            <Code2 size={18} />
            Nossos Serviços
          </button>
        </motion.div>
      </div>
    </section>
  );
}
