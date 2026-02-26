// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar"; // We will create this next

export default function MainLayout() {
    return (
        <div className="flex min-h-screen bg-gray-950 text-white">
            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5">
                <Sidebar />
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}