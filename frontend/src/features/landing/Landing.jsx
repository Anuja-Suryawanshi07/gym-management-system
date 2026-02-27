import gymImage from "../../assets/images/Hero.jpg";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Zap, Target } from "lucide-react";

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      
      {/* Background Section*/}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={gymImage}
          alt="Gym Motivation"
          className="w-full h-full object-cover object-center opacity-60 contrast-125 brightness-90"
        />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,black_90%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        
        {/* Modern Label */}
        <div className="flex items-center gap-2 mb-6 px-4 py-1 rounded-full border border-orange-500/50 bg-orange-500/5 backdrop-blur-sm">
          <Activity size={14} className="text-orange-500 animate-pulse" />
          <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Elite Performance Club
          </span>
        </div>
        
      
        <h1 className="flex flex-col md:block text-3xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">
          <span className="text-white">FIT</span>
          <span className="text-orange-500 px-2">PULSE</span>
          <span className="hidden md:inline text-transparent stroke-orange-500" style={{ WebkitTextStroke: '1px #f97316' }}>
            PULSE
          </span>
        </h1>
        
        <p className="mt-6 text-base md:text-lg text-gray-300 max-w-xl font-medium tracking-wide leading-relaxed">
          Where science meets sweat. High-performance coaching and 
          world-class equipment for those who crave more.
        </p>
        
        {/* Modern Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link 
            to="/request-membership" 
            className="flex items-center gap-2 bg-orange-500 hover:bg-white hover:text-orange-600 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm rounded-lg transition-all transform active:scale-95 shadow-xl shadow-orange-500/20"
          >
            Join the movement <ArrowRight size={18} />
          </Link>
          
          <Link 
            to="/login" 
            className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Member Access
          </Link>
        </div>

        {/* Minimalist Stats Overlay */}
        <div className="absolute bottom-10 grid grid-cols-3 gap-12 text-white border-t border-white/10 pt-8 w-full max-w-2xl px-4">
          <div>
            <p className="text-2xl font-black text-orange-500">24/7</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Access</p>
          </div>
          <div>
            <p className="text-2xl font-black text-orange-500">50+</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Trainers</p>
          </div>
          <div>
            <p className="text-2xl font-black text-orange-500">8k+</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Members</p>
          </div>
        </div>
      </div>
    </div>
  );
}