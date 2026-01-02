import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="w-full bg-black/80 text-white fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-yellow-400">
                    GymPro
                </Link>

                { /* Menu */}
                <div className="space-x-6 hidden md:flex">
                    <Link to="/" className="hover:text-yellow-400 transition">
                        Home
                    </Link>
                    <Link to="/login" className="hover:text-yellow-400 transition">
                        Login
                    </Link>
                </div>

                {/* Login Button */}
                <Link
                    to="/login"
                    className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition"
                >
                    Login
                </Link>  

                <Link
                    to="/request-membership"
                    className="hover:text-yellow-400 transition"
                >
                    Join Now
                </Link>      
            </div>
        </nav>
    );
}

export default Navbar;