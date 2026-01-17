import StatCard from "../components/StatCard";
import { Users, UserCog, Clock, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome to the Gym Management Admin Panel.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={120}
          icon={<Users />}
        />

        <StatCard
          title="Active Trainers"
          value={8}
          icon={<UserCog />}
          color="green"
        />    

        <StatCard
          title="Expired Memberships"
          value={3}
          icon={<AlertTriangle />}
          color="red"
        />  
      </div>
    </div>
  );
}