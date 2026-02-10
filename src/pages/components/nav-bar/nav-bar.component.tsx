import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import "./nav-bar.component.scss";


const navItems = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar__container">
        {/* Logo */}
        <button className="navbar__logo" onClick={() => scrollTo("#hero")}>
          <span className="navbar__logo-icon">Y</span>
          <span className="navbar__logo-text">Yesode</span>
        </button>

        {/* Desktop menu */}
        <ul className="navbar__menu">
          {navItems.map((item) => (
            <li key={item.href}>
              <button onClick={() => scrollTo(item.href)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          className="navbar__cta"
          onClick={() => scrollTo("#contato")}
        >
          Fale Conosco
        </button>

        {/* Mobile toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
              >
                {item.label}
              </button>
            ))}

            <button
              className="navbar__mobile-cta"
              onClick={() => scrollTo("#contato")}
            >
              Fale Conosco
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
