import { Button } from "primereact/button";
import { Moon, Sun } from "lucide-react";
import logo from "@/assets/g17.png";
import { useTheme } from "@/context/ThemeContext";
import "./nav-bar.component.scss";

export default function NavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <img src={logo} alt="Yesode" />
        <span>YESODE</span>
      </div>

      {/* Menu central */}
      <nav className="navbar__menu">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">Works</a>
        <a href="#">Contact</a>
      </nav>

      {/* Botão */}
      <div className="navbar__action" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            color: 'inherit'
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Button
          label="Try Now"
          className="navbar__button"
        />
      </div>
    </header>
  );
}