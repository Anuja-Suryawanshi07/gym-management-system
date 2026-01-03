import { Routes, Route } from "react-router-dom";
import Landing from "../features/landing/Landing";
import RequestMembership from "../features/landing/RequestMembership";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MembershipRequests from "../features/admin/pages/MembershipRequests";
function AppRoutes() {
  return (
    <Routes>
        {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/request-membership" element={<RequestMembership />} />
        {/* Admin Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Admin -> Membership Requests */}
      <Route
        path="/admin/membership-requests"
        element={
            <ProtectedRoute allowedRoles={["admin"]}>
                <MembershipRequests />
            </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
