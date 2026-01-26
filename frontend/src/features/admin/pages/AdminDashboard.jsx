import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { Users, UserCog, Clock, AlertTriangle } from "lucide-react";
import { getAdminDashboardStats } from "../services/adminApi";


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboardStats();
        setStats(res.data.stats);
      } catch (err) {
        setError("Failed to load dashboard stats");
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!stats) {
    return <p className="text-gray-400">Loading dashboard...</p>
  }

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
          value={stats.totalMembers}
          icon={<Users />}
        />

        <StatCard
          title="Active Trainers"
          value={stats.activeTrainers}
          icon={<UserCog />}
          color="green"
        />    

        <StatCard
          title="Checked-In Now"
          value={stats.checkedInNow}
          icon={<Clock />}
          color="blue"
        /> 

        <StatCard
          title="Expired Memberships"
          value={stats.expiredMemberships}
          icon={<AlertTriangle />}
          color="red"
        />   
      </div>
    </div>
  );
}