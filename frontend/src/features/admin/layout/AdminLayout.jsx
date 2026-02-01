import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-gray-950 text-white">

            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5">
                <AdminSidebar />
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}