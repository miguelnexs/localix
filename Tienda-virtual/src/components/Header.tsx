import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import CartDropdown from "./CartDropdown";
import logoImage from "../../img/logo_Mesa de trabajo 1.png";

const Header = () => {

  return (
  <div className="bg-white border-b border-neutral-200 py-4 px-6">
    <div className="flex items-center justify-between">
      {/* Menu Hamburguesa */}
      <HamburgerMenu />
      {/* Logo Centrado */}
      <div className="flex-1 text-center">
        <Link to="/">
          <img 
            src={logoImage} 
            alt="CG by Caro Gonzalez" 
            className="w-24 h-24 mx-auto object-contain"
          />
        </Link>
      </div>
      {/* Carrito */}
      <div className="flex items-center space-x-2">
        <CartDropdown />
      </div>
    </div>
  </div>
  );
};

export default Header;