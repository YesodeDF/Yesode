import { Button } from "primereact/button";
import logo from "@/assets/g17.png";
import "./nav-bar.component.scss";

export default function NavBar() {
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
      <div className="navbar__action">
        <Button
          label="Try Now"
          className="navbar__button"
        />
      </div>
    </header>
  );
}