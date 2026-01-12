import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";

function DashboardLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="ml-64 p-6 w-full bg-gray-900 text-white">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;