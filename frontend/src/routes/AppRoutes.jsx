import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

/* Public */
import Landing from "../features/landing/Landing";
import RequestMembership from "../features/landing/RequestMembership";
import Login from "../features/auth/Login";
import Unauthorized from "../pages/Unauthorized";

/* Admin */
import DashboardLayout from "../features/dashboard/DashboardLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import MembershipRequests from "../features/admin/pages/MembershipRequests";
import Members from "../features/admin/pages/Members";
import MemberDetails from "../features/admin/pages/MemberDetails";
import Trainers from "../features/admin/pages/Trainers";
import TrainerDetails from "../features/admin/pages/TrainerDetails";
import AddTrainer from "../features/admin/pages/AddTrainer";
import EditTrainer from "../features/admin/pages/EditTrainer";
import Plans from "../features/admin/pages/Plans";
import AddPlan from "../features/admin/pages/AddPlan";
import EditPlan from "../features/admin/pages/EditPlan";

/* Trainer */
import TrainerLayout from "../features/trainers/layout/TrainerLayout";
import TrainerDashboard from "../features/trainers/pages/TrainerDashboard";
import Sessions from "../features/trainers/pages/Sessions";
import AddSession from "../features/trainers/pages/AddSession";

/* Member */
import MemberLayout from "../features/members/layout/MemberLayout";
import MemberDashboard from "../features/members/pages/MemberDashboard";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/request-membership" element={<RequestMembership />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="membership-requests" element={<MembershipRequests />} />
        <Route path="members" element={<Members />} />
        <Route path="members/:id" element={<MemberDetails />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="trainers/add" element={<AddTrainer />} />
        <Route path="trainers/:id" element={<TrainerDetails />} />
        <Route path="trainers/:id/edit" element={<EditTrainer />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/add" element={<AddPlan />} />
        <Route path="plans/:id/edit" element={<EditPlan />} />
      </Route>

      {/* Trainer Routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <TrainerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TrainerDashboard />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="sessions/add" element={<AddSession />} />
      </Route>

      {/* Member Routes */}
      <Route
        path="/member"
        element={
          <ProtectedRoute allowedRoles={["member"]}>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboard />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
