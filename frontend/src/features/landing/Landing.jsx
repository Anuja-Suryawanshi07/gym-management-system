import gymImage from "../../assets/images/gym-hero.png";
import { Link } from "react-router-dom";


// src/features/landing/Landing.jsx

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={gymImage}
          alt="Gym Motivation"
          // object-top helps if the heads/important parts are at the top
          // opacity-50 makes text easier to read
          className="w-full h-full object-cover object-center opacity-50"
        />
        {/* Gradient Overlay: Makes the bottom of the image fade into the black background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 italic">
          PUSH <span className="text-yellow-400">HARDER.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-xl">
          The only bad workout is the one that didn't happen.
        </p>
        <Link to="/request-membership" className="bg-yellow-400 text-black px-10 py-4 font-bold rounded-sm hover:bg-white transition">
           JOIN THE ELITE
        </Link>
      </div>
    </div>
  );
}