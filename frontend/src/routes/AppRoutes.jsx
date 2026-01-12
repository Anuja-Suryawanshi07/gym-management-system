import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Landing from "../features/landing/Landing";
import RequestMembership from "../features/landing/RequestMembership";
import Login from "../features/auth/Login";

import DashboardLayout from "../features/dashboard/DashboardLayout";

import AdminDashboard from "../features/admin/pages/AdminDashboard";
import MembershipRequests from "../features/admin/pages/MembershipRequests";
import Members from "../features/admin/pages/Members";
import MemberDetails from "../features/admin/pages/MemberDetails";
import Trainers from "../features/admin/pages/Trainers";
import TrainerDetails from "../features/admin/pages/TrainerDetails";

function AppRoutes() {
  return (
    <Routes>
      {/*  Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/request-membership" element={<RequestMembership />} />

      {/*  Protected Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        {/*  Admin Routes */}
        <Route index element={<AdminDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/membership-requests" element={<MembershipRequests />} />
        <Route path="admin/members" element={<Members />} />
        <Route path="admin/members/:id" element={<MemberDetails />} />

        <Route path= "admin/trainers" element={<Trainers />} />
        <Route path="admin/trainers/:id" element={<TrainerDetails />} />

        </Route>
    </Routes>
  );
}

export default AppRoutes;
