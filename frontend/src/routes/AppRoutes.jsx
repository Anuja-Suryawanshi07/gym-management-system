import { Routes, Route } from "react-router-dom";
import Landing from "../features/landing/Landing";
import RequestMembership from "../features/landing/RequestMembership";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/request-membership" element={<RequestMembership />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />    
        </Routes>
    );
}

export default AppRoutes;