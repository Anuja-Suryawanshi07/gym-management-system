import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout"; // The new consolidated layout
import PublicLayout from "../layouts/PublicLayout";
/* Public Pages */
import Landing from "../features/landing/Landing";
import RequestMembership from "../features/landing/RequestMembership";
import Login from "../features/auth/Login";
import Unauthorized from "../pages/Unauthorized";

/* Admin Pages */
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import MembershipRequests from "../features/admin/pages/MembershipRequests";
import Members from "../features/admin/pages/Members";
import MemberDetails from "../features/admin/pages/MemberDetails";
import TrainerDetails from "../features/admin/pages/TrainerDetails";
import TrainerList from "../features/admin/pages/TrainerList";
import AddTrainer from "../features/admin/pages/AddTrainer";
import EditTrainer from "../features/admin/pages/EditTrainer";
import Plans from "../features/admin/pages/Plans";
import AddPlan from "../features/admin/pages/AddPlan";
import EditPlan from "../features/admin/pages/EditPlan";
import AdminSessions from "../features/admin/pages/Sessions"; 

/* Trainer Pages */
import TrainerDashboard from "../features/trainers/pages/TrainerDashboard";
import TrainerSessions from "../features/trainers/pages/Sessions";
import AddSession from "../features/trainers/pages/AddSession";
import EditSession from "../features/trainers/pages/EditSession";
import TrainerMembers from "../features/trainers/pages/TrainerMembers";
import TrainerAttendance from "../features/trainers/pages/TrainerAttendance";

/* Member Pages */
import MemberDashboard from "../features/members/pages/MemberDashboard";
import MyPlan from "../features/members/pages/MyPlan";
import MyAttendance from "../features/members/pages/MyAttendance";
import MyPayments from "../features/members/pages/MyPayments";
import MySessions from "../features/members/pages/MySessions";

/* Payment Pages */
import SelectPlan from "../pages/SelectPlan";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";

function AppRoutes() {
  return (
    <Routes>
      {/* --- Public Routes with Navbar --- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-membership" element={<RequestMembership />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* --- Admin Routes --- */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="membership-requests" element={<MembershipRequests />} />
        <Route path="members" element={<Members />} />
        <Route path="members/:id" element={<MemberDetails />} />
        <Route path="trainers" element={<TrainerList />} />
        <Route path="trainers/add" element={<AddTrainer />} />
        <Route path="trainers/:id" element={<TrainerDetails />} />
        <Route path="trainers/:id/edit" element={<EditTrainer />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/add" element={<AddPlan />} />
        <Route path="plans/:id/edit" element={<EditPlan />} />
        <Route path="sessions" element={<AdminSessions />} />
      </Route>

      {/* --- Trainer Routes --- */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TrainerDashboard />} />
        <Route path="sessions" element={<TrainerSessions />} />
        <Route path="sessions/add" element={<AddSession />} />
        <Route path="sessions/:id/edit" element={<EditSession />} />
        <Route path="members" element={<TrainerMembers />} />
        <Route path="attendance" element={<TrainerAttendance />} />
      </Route>

      {/* --- Member Routes --- */}
      <Route
        path="/member"
        element={
          <ProtectedRoute allowedRoles={["member"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboard />} />
        <Route path="plan" element={<MyPlan />} />
        <Route path="sessions" element={<MySessions />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="payments" element={<MyPayments />} />
      </Route>

      {/* --- Miscellaneous --- */}
      <Route path="/select-plan" element={<SelectPlan />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />
    </Routes>
  );
}

export default AppRoutes;
