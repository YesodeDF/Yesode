import StarBorder from "../ui/StarBorder";
import "./nav-bar.component.scss";
import {useState} from "react";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("About Us");
  const menuItems = ["About", "Services", "Solutions", "Contact"];

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Yesode</div>

        <div className="navbar-menu">
          {menuItems.map((item) => (
            <span
              key={item}
              className={`menu-item ${activeItem === item ? "active" : ""}`}
              onClick={() => setActiveItem(item)}
            >
              {activeItem === item && <span className="bracket">[</span>}
              {item}
              {activeItem === item && <span className="bracket">]</span>}
            </span>
          ))}
        </div>

        <div className="navbar-actions">
          <StarBorder
            color="#d3ac68"
            speed="5s"
            thickness={1}
            className="login-button"
          >
            Log-in
          </StarBorder>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
