import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("gym_auth_token");
    const user = JSON.parse(localStorage.getItem("gym_user"));

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // logged in but role not allowed
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    // Access granted
    return children;
};

export default ProtectedRoute;