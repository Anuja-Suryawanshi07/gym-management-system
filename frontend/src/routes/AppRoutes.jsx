import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Landing from "../features/landing/Landing";
import RequestMembership from "../features/landing/RequestMembership";
import Login from "../features/auth/Login";
import Unauthorized from "../pages/Unauthorized";

import DashboardLayout from "../features/dashboard/DashboardLayout";

/* Admin Pages */
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import MembershipRequests from "../features/admin/pages/MembershipRequests";
import Members from "../features/admin/pages/Members";
import MemberDetails from "../features/admin/pages/MemberDetails";
import Trainers from "../features/admin/pages/Trainers";
import TrainerDetails from "../features/admin/pages/TrainerDetails";
import AddTrainer from "../features/admin/pages/AddTrainer";
import EditTrainer from "../features/admin/pages/EditTrainer";



/* Trainer Pages */
import TrainerDashboard from "../features/trainers/pages/TrainerDashboard";

/* Member Pages */
import MemberDashboard from "../features/members/pages/MemberDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/*  Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/request-membership" element={<RequestMembership />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/*  Admin Routes */}
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

        <Route path= "trainers" element={<Trainers />} />
        <Route path="trainers/:id" element={<TrainerDetails />} />
        <Route path="trainers/add" element={<AddTrainer />} />
        <Route path="trainers/:id/edit" element={<EditTrainer />} />
        
        </Route>

        {/* Trainer Routes */}

        <Route
          path="/dashboard/trainer"
          element={
            <ProtectedRoute allowedRoles={["trainer"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TrainerDashboard />} />  
        </Route>  

        { /* Member Routes */}
        <Route
          path="/dashboard/member"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MemberDashboard />} />  
        </Route>  

    </Routes>
  );
}

export default AppRoutes;
