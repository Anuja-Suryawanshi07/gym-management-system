import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, NotebookPen, ClipboardClock, ShieldCheck, IndianRupee } from "lucide-react";

export default function MemberSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("gym_auth_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-md transition
   ${isActive
     ? "bg-blue-600 text-white"
     : "text-gray-300 hover:bg-gray-300 hover:text-gray-800"
   }`;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Member Panel</h2>
      <ul className="space-y-2">
        <li>
          <NavLink to="/member" end className={linkClass}>
            <LayoutDashboard size={18} />
              Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/member/plan" className={linkClass}>
            <NotebookPen size={18} />
              My Plan
          </NavLink>
        </li>

        <li>
          <NavLink to="/member/sessions" className={linkClass}>
            <ClipboardClock size={18} />
              My Sessions
          </NavLink>
        </li>

        <li>
          <NavLink to="/member/attendance" className={linkClass}>
            <ShieldCheck size={18} />
              Attendance
          </NavLink>
        </li>

        <li>
          <NavLink to="/member/payments" className={linkClass}>
            <IndianRupee size={18} />
              Payments
          </NavLink>
        </li>  

        <li className="pt-6 border-t border-gray-700">
            <button
                onClick={handleLogout}
                className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
             > 
                Logout
            </button>
        </li>
      </ul>
    </div>    
  );
}
