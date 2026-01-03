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
        <aside className="w-64 bg-black text-white min-h-screen p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
                Admin Panel
            </h2>

            <nav className="space-y-4">
                {menu.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                        `block px-4 py-2 rounded ${
                            isActive ? "bg-yellow-400 text-black" : "hover:bg-white/10"
                        }`
                    }
                   >
                    {item.name}
                   </NavLink> 
                ))}
            </nav>
        </aside>
    );
}