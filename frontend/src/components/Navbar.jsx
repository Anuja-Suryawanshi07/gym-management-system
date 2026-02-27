import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo1.png";

function Navbar() {
  const location = useLocation();

  // Helper to highlight active links
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-black/60 backdrop-blur-md border-b border-white/10 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-transform hover:scale-105"
        >
          <div className="relative">
             {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
            <img 
              src={logoImg} 
              alt="FitPulse Logo" 
              className="h-12 w-auto object-contain relative z-10" 
            />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            Fit<span className="text-orange-500">Pulse</span>
          </span>
        </Link>

        {/* Menu Items */}
        <div className="flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              isActive("/") ? "text-orange-500" : "text-gray-300 hover:text-white"
            }`}
          >
            Home
          </Link>
          
          <Link 
            to="/login" 
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              isActive("/login") ? "text-orange-500" : "text-gray-300 hover:text-white"
            }`}
          >
            Login
          </Link>

          <Link
            to="/request-membership"
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-tighter px-6 py-2.5 rounded-full transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-95"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;