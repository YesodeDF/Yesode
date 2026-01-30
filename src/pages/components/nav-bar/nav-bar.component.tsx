import StarBorder from "../ui/StarBorder";
import "./nav-bar.component.scss";
import {useState} from "react";

const Navbar = () => {
  const [activeItem, setActiveItem] = useState("About Us");
<<<<<<< HEAD

  const menuItems = ["About", "Services", "Solutions"];
=======
  const menuItems = ["About", "Services", "Solutions", "Contact"];
>>>>>>> 87241a0a51db9f2fe4b129e5434892802fa1b823

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
            Contact
          </StarBorder>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
