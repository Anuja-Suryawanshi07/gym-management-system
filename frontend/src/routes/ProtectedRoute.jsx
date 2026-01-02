import { children } from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("gym_auth_token");
    const user = JSON.parse(localStorage.getItem("gym_user"));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;