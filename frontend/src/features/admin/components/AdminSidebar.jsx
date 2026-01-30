import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserCog, ClipboardList } from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/admin" },
  { name: "Membership Requests", path: "/admin/membership-requests" },
  { name: "Users", path: "/admin/users" },
  { name: "Members", path: "/admin/members" },
  { name: "Trainers", path: "/admin/trainers" },
  { name: "Plans", path: "/admin/plans" },
  { name: "Sessions", path: "/admin/sessions" },
];

const linkClass = ({ isActive }) =>
   `flex items-center gap-3 px-4 py-2 rounded-md transition
   ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`;
export default function AdminSidebar() {
  return (
    <nav className="space-y-2">
      <NavLink to="/dashboard/admin" className={linkClass}>
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>

      <NavLink to="/dashboard/admin/members" className={linkClass}>
        <Users size={18} />
        Members
      </NavLink>

      <NavLink to="/dashboard/admin/trainers" className={linkClass}>
        <UserCog size={18} />
        Trainers
      </NavLink>

      <NavLink to="/dashboard/admin/plans" className={linkClass}>
        <ClipboardList size={18} />
        Plans
      </NavLink>
    </nav>
  );
}
