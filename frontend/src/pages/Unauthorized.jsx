import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("gym_user"));

  const handleGoBack = () => {
    // Redirect based on role if they are logged in, otherwise go home
    if (!user) return navigate("/");
    
    const role = user.role?.toLowerCase();
    if (role === "admin") navigate("/dashboard/admin");
    else if (role === "trainer") navigate("/trainer");
    else navigate("/member");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="text-center max-w-md p-10 bg-gray-900 border border-red-900/30 rounded-3xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-900/20 rounded-full">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black mb-2 tracking-tighter">ACCESS DENIED</h1>
        <p className="text-gray-400 mb-8">
          You don't have the permissions required to enter this section. This area is restricted.
        </p>

        <button
          onClick={handleGoBack}
          className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
          GO TO MY DASHBOARD
        </button>
      </div>
    </div>
  );
}