import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCog, ClipboardList, 
  NotebookPen, ClipboardClock, ShieldCheck, IndianRupee, 
  PlusCircle, ClipboardCheck, LogOut, Dumbbell 
} from "lucide-react";
import toast from "react-hot-toast";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("gym_user"));
  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem("gym_auth_token");
    localStorage.removeItem("gym_user");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
      isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  const menuConfig = {
    admin: [
      { name: "Dashboard", path: "/dashboard/admin", icon: <LayoutDashboard size={20} /> },
      { name: "Membership Requests", path: "/dashboard/admin/membership-requests", icon: <ClipboardList size={20} /> },
      { name: "Members", path: "/dashboard/admin/members", icon: <Users size={20} /> },
      { name: "Trainers", path: "/dashboard/admin/trainers", icon: <UserCog size={20} /> },
      { name: "Plans", path: "/dashboard/admin/plans", icon: <ClipboardList size={20} /> },
      { name: "Sessions", path: "/dashboard/admin/sessions", icon: <ClipboardClock size={20} /> },
    ],
    member: [
      { name: "Dashboard", path: "/member", icon: <LayoutDashboard size={20} />, end: true },
      { name: "My Plan", path: "/member/plan", icon: <NotebookPen size={20} /> },
      { name: "My Sessions", path: "/member/sessions", icon: <ClipboardClock size={20} /> },
      { name: "Attendance", path: "/member/attendance", icon: <ShieldCheck size={20} /> },
      { name: "Payments", path: "/member/payments", icon: <IndianRupee size={20} /> },
    ],
    trainer: [
      { name: "Dashboard", path: "/trainer", icon: <LayoutDashboard size={20} /> },
      { name: "Sessions", path: "/trainer/sessions", icon: <ClipboardClock size={20} /> },
      { name: "Add Session", path: "/trainer/sessions/add", icon: <PlusCircle size={20} /> },
      { name: "Members", path: "/trainer/members", icon: <Users size={20} /> },
      { name: "Attendance", path: "/trainer/attendance", icon: <ClipboardCheck size={20} /> },
    ],
  };

  const currentMenu = menuConfig[role] || [];
  if (!user) return null;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Dumbbell className="text-white" size={24} />
        </div>
        <span className="text-xl font-extrabold tracking-tighter text-white uppercase italic">
          Fit<span className="text-orange-500 text-2xl">Pulse</span>
        </span>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {currentMenu.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.end} className={linkClass}>
            {item.icon}
            <span className="text-sm tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shadow-inner">
            {user.full_name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-white font-bold truncate">{user.full_name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white py-2.5 rounded-xl transition-all font-semibold text-xs border border-red-500/20"
        >
          <LogOut size={16} /> LOGOUT
        </button>
      </div>
    </aside>
  );
}