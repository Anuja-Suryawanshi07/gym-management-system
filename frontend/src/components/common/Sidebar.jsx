import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCog, ClipboardList, 
  NotebookPen, ClipboardClock, ShieldCheck, IndianRupee, 
  PlusCircle, ClipboardCheck 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("gym_user"));
  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem("gym_auth_token");
    localStorage.removeItem("gym_user");
    localStorage.removeItem("user"); // Supporting both names found in your files
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition font-medium
     ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"}`;

  // Mapping configurations for each role
  const menuConfig = {
    admin: [
      { name: "Dashboard", path: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
      { name: "Membership Requests", path: "/dashboard/admin/membership-requests", icon: <ClipboardList size={18} /> },
      { name: "Members", path: "/dashboard/admin/members", icon: <Users size={18} /> },
      { name: "Trainers", path: "/dashboard/admin/trainers", icon: <UserCog size={18} /> },
      { name: "Plans", path: "/dashboard/admin/plans", icon: <ClipboardList size={18} /> },
      { name: "Sessions", path: "/dashboard/admin/sessions", icon: <ClipboardClock size={18} /> },
    ],
    member: [
      { name: "Dashboard", path: "/member", icon: <LayoutDashboard size={18} />, end: true },
      { name: "My Plan", path: "/member/plan", icon: <NotebookPen size={18} /> },
      { name: "My Sessions", path: "/member/sessions", icon: <ClipboardClock size={18} /> },
      { name: "Attendance", path: "/member/attendance", icon: <ShieldCheck size={18} /> },
      { name: "Payments", path: "/member/payments", icon: <IndianRupee size={18} /> },
    ],
    trainer: [
      { name: "Dashboard", path: "/trainer", icon: <LayoutDashboard size={18} /> },
      { name: "Sessions", path: "/trainer/sessions", icon: <ClipboardClock size={18} /> },
      { name: "Add Session", path: "/trainer/sessions/add", icon: <PlusCircle size={18} /> },
      { name: "Members", path: "/trainer/members", icon: <Users size={18} /> },
      { name: "Attendance", path: "/trainer/attendance", icon: <ClipboardCheck size={18} /> },
    ],
  };

  const currentMenu = menuConfig[role] || [];

  if (!user) return null;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4 flex flex-col border-r border-gray-800">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold text-blue-500">CORE STRENGTH</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest">{role} Panel</p>
      </div>

      <nav className="flex-1 space-y-2">
        {currentMenu.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            end={item.end} 
            className={linkClass}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-gray-800">
        <div className="px-4 mb-4">
            <p className="text-sm font-medium truncate">{user.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}