import { motion } from "framer-motion";
import { Button } from "primereact/button";

import heroImage from "@/assets/hero-yesode.webp";
import { scrollToSection } from "@/utils/scrollToSection";

import "./hero-section.component.scss";

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      {/* Background */}
      <div className="hero__background">
        <img src={heroImage} alt="Tecnologia digital" loading="eager" />
        <div className="hero__overlay" />
      </div>

      {/* CONTENT */}
      <div className="hero__content">
        {/* HERO TEXT */}
        <div className="hero__center">
          <motion.span
            className="hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <i className="pi pi-code" />
            Desenvolvimento & Inovação
          </motion.span>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Soluções digitais que{" "}
            <span className="highlight">transformam negócios</span>
          </motion.h1>

          <motion.p
            className="hero__description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Desenvolvemos sistemas web, aplicativos, automações e integrações
            focadas em performance, escalabilidade e resultado.
          </motion.p>

          <motion.div className="hero__actions">
            <Button
              label="Solicitar Orçamento"
              icon="pi pi-arrow-right"
              iconPos="right"
              className="hero__btn hero__btn--primary"
              onClick={() => scrollToSection("contato")}
            />
            <Button
              label="Nossos Serviços"
              className="hero__btn hero__btn--outline"
              onClick={() => scrollToSection("servicos")}
            />
          </motion.div>
        </div>

        {/* STATS */}
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-number">50+</span>
            <span className="hero__stat-label">Projetos entregues</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">99%</span>
            <span className="hero__stat-label">Satisfação</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-number">5+</span>
            <span className="hero__stat-label">Anos de mercado</span>
          </div>
        </div>

        {/* TECH CAROUSEL */}
        <div className="hero__carousel">
          <div className="hero__carousel-track">
            {/* bloco 1 */}
            <div className="hero__carousel-group">
              <span className="hero__carousel-item">Python</span>
              <span className="hero__carousel-item">React</span>
              <span className="hero__carousel-item">TypeScript</span>
              <span className="hero__carousel-item">Node.js</span>
              <span className="hero__carousel-item">Laravel</span>
              <span className="hero__carousel-item">Docker</span>
              <span className="hero__carousel-item">PostgreSQL</span>
              <span className="hero__carousel-item">AWS</span>
            </div>

            {/* bloco 2 (CLONE VISUAL) */}
            <div className="hero__carousel-group">
              <span className="hero__carousel-item">Python</span>
              <span className="hero__carousel-item">React</span>
              <span className="hero__carousel-item">TypeScript</span>
              <span className="hero__carousel-item">Node.js</span>
              <span className="hero__carousel-item">Laravel</span>
              <span className="hero__carousel-item">Docker</span>
              <span className="hero__carousel-item">PostgreSQL</span>
              <span className="hero__carousel-item">AWS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
