import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate =useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("gym_auth_token");
        localStorage.removeItem("gym_user");
        navigate("/login");
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold mb-6">Gym Admin</h2>

            <ul className="space-y-3">
                <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
                <li className="hover:text-gray-300 cursor-pointer">Members</li>
                <li className="hover:text-gray-300 cursor-pointer">Trainer</li>
            </ul>

            {/* Logout button */}

            <button
                onClick={handleLogout}
                className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
            Logout    
            </button>    
        </div>
    );
}
export default Sidebar;
    