import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-black/80 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex flex-row items-baseline gap-72 text-yellow-400"
        >
          <span>GymPro</span>
          
          {/* <div>
            <h1 className="text-lg md:text-xl font-medium">
            Transform Your Body. Transform Your Life.
            </h1>
            
            <p className="text-lg md:text-sm font-medium">
            Join our gym today and get expert trainers, modern equipment, and
            personalized fitness plans.
            </p>
        
          </div>   */}
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
