import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Landing from "../features/landing/Landing";
import RequestMembership from "../features/landing/RequestMembership";
import Login from "../features/auth/Login";
import Dashboard from "../features/dashboard/Dashboard";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import MembershipRequests from "../features/admin/pages/MembershipRequests";
import Members from "../features/admin/pages/Members";
import MemberDetails from "../features/admin/pages/MemberDetails";


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
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
      <Route
        path="members/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MemberDetails />
          </ProtectedRoute>
        }  
      />  

      <Route
        path="/admin/members/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <MemberDetails />
            </AdminLayout>
          </ProtectedRoute>
        }    
      />  

        <Route index element={<AdminDashboard />} />
        <Route path="membership-requests" element={<MembershipRequests />} />
        <Route path="members" element={<Members />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
