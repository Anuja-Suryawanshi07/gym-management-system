import Sidebar from "../../components/sidebar";

function Dashboard() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 w-full">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Welcome to Gym Management System
                </p>
            </div>
        </div>
    );
}

export default Dashboard;