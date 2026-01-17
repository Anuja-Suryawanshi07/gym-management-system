import { NavLink } from "react-router-dom";

const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Membership Requests", path: "/admin/membership-requests" },
    { name: "Users", path: "/admin/users" },
    { name: "Members", path: "/admin/members" },
    { name: "Trainers", path:"/admin/trainers" },
    { name: "Plans", path:"/admin/plans" },
    { name: "Sessions", path:"/admin/sessions" }
];

export default function AdminSidebar() {
    return (
        <ul className="space-y-3">
            <li><NavLink to="/dashboard/admin">Dashboard</NavLink></li>
            <li><NavLink to="/dashboard/admin/members">Members</NavLink></li>
            <li><NavLink to="/dashboard/admin/trainers">Trainers</NavLink></li>
        </ul>
    );
}
        