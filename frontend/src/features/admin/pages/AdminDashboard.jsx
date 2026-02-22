import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // For "View All" link
import StatCard from "../components/StatCard";
import { Users, UserCog, Clock, AlertTriangle, UserPlus, ArrowRight } from "lucide-react";
import { getAdminDashboardStats, getMembershipRequests } from "../services/adminApi";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]); // State for the table
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Stats
        const statsRes = await getAdminDashboardStats();
        setStats(statsRes.data.stats);

        // 2. Fetch Recent Requests (Filter for PENDING)
        const requestsRes = await getMembershipRequests();
        const pending = requestsRes.data.data
          .filter(req => req.status?.toLowerCase() === "pending")
          .slice(0, 5); // Just show the latest 5 on dashboard
        
        setRecentRequests(pending);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (loading) return <p className="text-gray-400 p-6">Loading dashboard...</p>;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">At a glance view of your gym's performance.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={<Users />} />
        
        {/* NEW: Pending Requests Card */}
        <StatCard 
          title="Pending Requests" 
          value={recentRequests.length} 
          icon={<UserPlus />} 
          color="yellow" 
        />

        <StatCard title="Active Trainers" value={stats.activeTrainers} icon={<UserCog />} color="green" />
        <StatCard title="Checked-In" value={stats.checkedInNow} icon={<Clock />} color="blue" />
        <StatCard title="Expired" value={stats.expiredMemberships} icon={<AlertTriangle />} color="red" />
      </div>

      {/* Recent Pending Requests Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Recent Membership Requests</h2>
          <Link 
            to="/dashboard/admin/membership-requests" 
            className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Goal / Message</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No new pending requests.
                  </td>
                </tr>
              ) : (
                recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 text-white font-medium">{req.full_name}</td>
                    <td className="p-4">
                    <div className="text-gray-400 truncate max-w-[200px]"
                    title={req.message}
                    >
                      {req.message}
                    </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        to="/dashboard/admin/membership-requests" 
                        className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}