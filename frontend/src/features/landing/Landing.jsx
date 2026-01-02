import Navbar from "../../components/Navbar";
import gymImage from "../../assets/images/gym-hero.png";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">

        <Navbar />
      {/* Hero Section */}
      <div className="relative pt-20">
        <img
          src={gymImage}
          alt="Gym Motivation"
          className="w-full h-[96vh] opacity-80"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/50">
        
          <Link
            to="/login"
            className="bg-yellow-500 text-black px-6 py-3 mt-130 rounded font-semibold hover:bg-yellow-600 transition"
          >
            Login to continoue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
