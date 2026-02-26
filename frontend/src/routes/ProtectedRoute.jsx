// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("gym_auth_token");
    const user = JSON.parse(localStorage.getItem("gym_user"));
    const location = useLocation();

    // 1. Not logged in: Send to login but remember where they wanted to go
    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Logged in but role not allowed: Send to unauthorized page
    // Using .toLowerCase() makes the role check case-insensitive and safer
    const userRole = user.role?.toLowerCase();
    
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Access granted
    return children;
};

export default ProtectedRoute;