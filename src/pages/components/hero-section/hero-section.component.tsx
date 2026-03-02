import { useEffect, useRef } from "react";
import "./hero-section.component.scss";

const PARTNERS = [
  {
    name: "Python",
    svg: `<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="22" font-family="serif" font-size="14" fill="currentColor">PYTHON</text></svg>`,
  },
  {
    name: "OpenAI",
    svg: `<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="22" font-family="serif" font-size="14" fill="currentColor">OpenAI</text></svg>`,
  },
  {
    name: "React",
    svg: `<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="22" font-family="serif" font-size="14" fill="currentColor">REACT</text></svg>`,
  },
  {
    name: "Typescript",
    svg: `<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="22" font-family="serif" font-size="14" fill="currentColor">TYPESCRIPT</text></svg>`,
  },
  {
    name: "Docker",
    svg: `<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="22" font-family="serif" font-size="14" fill="currentColor">DOCKER</text></svg>`,
  },
  {
    name: "MySQL",
    svg: `<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="22" font-family="serif" font-size="14" fill="currentColor">MYSQL</text></svg>`,
  },
  {
    name: "JavaScript",
    svg: `<svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="22" font-family="serif" font-size="14" fill="currentColor">JAVASCRIPT</text></svg>`,
  }
];

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  // Animated grain canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawGrain = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 30;
        imageData.data[i] = v;
        imageData.data[i + 1] = v * 0.9;
        imageData.data[i + 2] = v * 0.7;
        imageData.data[i + 3] = 18;
      }
      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(drawGrain);
    };
    drawGrain();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Parallax orb on mouse move
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const orb = orbRef.current;
      if (!orb) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section className="hero">
      {/* Grain overlay */}
      <canvas ref={canvasRef} className="hero__grain" />

      {/* Background grid */}
      <div className="hero__grid" aria-hidden="true" />

      {/* Glowing orb */}
      <div className="hero__orb-wrapper" aria-hidden="true">
        <div ref={orbRef} className="hero__orb">
          <div className="hero__orb-inner" />
        </div>
      </div>

      {/* Main content */}
      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Now Accepting your Projects
        </div>

        <h1 className="hero__headline">
          <span className="hero__headline-line hero__headline-line--light">
            Explore the Power of
          </span>
          <span className="hero__headline-line hero__headline-line--accent">
            Technology.
          </span>
        </h1>

        <p className="hero__description">
          A YESODE não se limita a criar código; nós arquitetamos a
          transformação. Nossa missão é levar seu negócio além da complexidade —
          desenvolvendo soluções de software personalizadas que eliminam
          impedimentos e integram seus fluxos de dados de forma perfeita.
        </p>

        <div className="hero__actions">
          <button className="hero__btn hero__btn--primary">
            <span>Desenvolva Já</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="hero__btn hero__btn--ghost">
            Contato
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="hero__stats">
          {[
            { value: "20+", label: "Projetos Entregues" },
            { value: "98%", label: "Satisfação do Cliente" },
            { value: "12yr", label: "Experiência no Setor" },
          ].map((s) => (
            <div className="hero__stat" key={s.label}>
              <span className="hero__stat-value">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Partners marquee */}
      <div className="hero__partners">
        <span className="hero__partners-label">
          Domínios
        </span>
        <div className="hero__marquee">
          <div className="hero__marquee-track">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span key={i} className="hero__partner-item">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
