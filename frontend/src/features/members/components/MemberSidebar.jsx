import { NavLink } from "react-router-dom";
import { LayoutDashboard, NotebookPen, ClipboardClock, ShieldCheck, IndianRupee } from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-md transition
   ${isActive
     ? "bg-blue-600 text-white"
     : "text-gray-300 hover:bg-gray-700 hover:text-white"
   }`;

export default function MemberSidebar() {
  return (
    <nav className="space-y-2">
      <NavLink to="/dashboard/member" end className={linkClass}>
      <LayoutDashboard size={18} />
        Dashboard
      </NavLink>

      <NavLink to="/dashboard/member/plan" className={linkClass}>
        <NotebookPen size={18} />
        My Plan
      </NavLink>

      <NavLink to="/dashboard/member/sessions" className={linkClass}>
        <ClipboardClock size={18} />
        My Sessions
      </NavLink>

      <NavLink to="/dashboard/member/attendance" className={linkClass}>
        <ShieldCheck size={18} />
        Attendance
      </NavLink>

      <NavLink to="/dashboard/member/payments" className={linkClass}>
       <IndianRupee size={18} />
        Payments
      </NavLink>
    </nav>
  );
}
