import { Link } from "react-router-dom";
import logoImg from "../assets/images/logo1.png";

function Navbar() {
  return (
    <nav className="w-full bg-black/80 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          {/* 2. Add the Image Tag */}
          <img 
            src={logoImg} 
            alt="Core Strength Logo" 
            className="h-14 w-auto object-contain" 
          />
          <span className="text-2xl font-bold text-yellow-400 tracking-tight">
            CORE STRENGTH
          </span>
          
        </Link>

        {/* Menu */}
        <div className=" flex items-center space-x-6">
          <Link to="/" className="hover:text-yellow-400 transition">
            Home
          </Link>
          <Link
            to="/request-membership"
            className="hover:text-yellow-400 transition"
          >
            Join Now
          </Link>
          <Link to="/login" className="hover:text-yellow-400 transition">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
