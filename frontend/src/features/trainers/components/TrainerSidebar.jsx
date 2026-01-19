import { NavLink, useNavigate } from "react-router-dom";

export default function TrainerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("gym_auth_token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Trainer Panel</h2>

      <ul className="space-y-3">
        <li>
          <NavLink to="/trainer" className="hover:text-gray-300">
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/trainer/sessions" className="hover:text-gray-300">
            Sessions
          </NavLink>
        </li>

        <li>
          <NavLink to="/trainer/sessions/add" className="hover:text-gray-300">
            Add Session
          </NavLink>
        </li>

        <li className="pt-6 border-t border-gray-700">
            <button
                onClick={handleLogout}
                className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
                Logout
            </button>    
        </li>
      </ul>
    </div>
  );
}
