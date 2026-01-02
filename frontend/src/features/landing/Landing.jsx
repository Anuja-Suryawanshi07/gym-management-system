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

        
      </div>
    </div>
  );
}

export default Landing;
