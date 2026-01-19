import AdminSidebar from "../features/admin/components/AdminSidebar";
import TrainerSidebar from "../features/trainers/components/TrainerSidebar";
import MemberSidebar from "../features/members/components/MemberSidebar";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate =useNavigate();

    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("gym_user"));

    const handleLogout = () => {
        localStorage.removeItem("gym_auth_token");
        localStorage.removeItem("gym_user");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold mb-6">Gym Pro</h2>

            {/* Role-based Sidebar */}
            {user.role === "admin" && <AdminSidebar />}
            {user?.role === "trainer" && 
            <>
                <li onClick={() => navigate("/trainer")} className="cursor-pointer">
                    Dashboard
                </li>
                <li onClick={() => navigate("/trainer/sessions")} className="cursor-pointer">
                    Sessions
                </li>
            </>    
            }
            {user.role === "member" && <MemberSidebar />}

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
    