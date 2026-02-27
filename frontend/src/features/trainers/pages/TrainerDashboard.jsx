import { useEffect, useState } from "react";
import { getTrainerDashboardStats } from "../services/trainerApi";
import StatCard from "../../common/components/StatCard"; // Reusable modern card
import TrainerProfileCard from "../components/TrainerProfileCard";
import toast from "react-hot-toast";
import { Users, CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function TrainerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const { data } = await getTrainerDashboardStats();
            setStats(data.stats);
        } catch (error) {
            toast.error("Failed to load dashboard stats");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-gray-950 min-h-screen text-white">
            {/* Header Section */}
            <header className="mb-10 border-b border-gray-800/50 pb-6">
                <h1 className="text-4xl font-black tracking-tight uppercase italic">
                    Trainer <span className="text-orange-500">Dashboard</span>
                </h1>
                <p className="text-gray-500 text-sm mt-2 tracking-widest font-semibold">
                    MANAGEMENT & PERFORMANCE OVERVIEW
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <StatCard
                    title="Assigned Members"
                    value={stats?.total_members ?? "0"}
                    icon={Users}
                    colorClass="bg-blue-600"
                />
                <StatCard
                    title="Sessions Today"
                    value={stats?.total_sessions ?? "0"}
                    icon={CalendarDays}
                    colorClass="bg-orange-600"
                />
                <StatCard
                    title="Scheduled"
                    value={stats?.scheduled_sessions ?? "0"}
                    icon={Clock}
                    colorClass="bg-yellow-500"
                />
                <StatCard
                    title="Completed"
                    value={stats?.completed_sessions ?? "0"}
                    icon={CheckCircle2}
                    colorClass="bg-green-600"
                />
                <StatCard
                    title="Canceled"
                    value={stats?.canceled_sessions ?? "0"}
                    icon={XCircle}
                    colorClass="bg-red-600"
                />
            </div>

            {/* Profile Section */}
            <div className="mt-10">
                <TrainerProfileCard />
            </div>
        </div>
    );
}