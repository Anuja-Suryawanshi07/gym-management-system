import { useEffect, useState } from "react";
import TrainerStatCard from "../components/TrainerStatCard";
import TrainerProfileCard from "../components/TrainerProfileCard";
import { getTrainerDashboardStats } from "../services/trainerApi";
import toast from "react-hot-toast";

export default function TrainerDashboard() {
    const [stats, setStats] = useState(null);

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
        }
    };

    return (
        <div className="p-6 bg-gray-400">
            <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <TrainerStatCard
                    title="Assigned Members"
                    value={stats?.total_members ?? "-"}
                />

                <TrainerStatCard
                    title="Sessions Today"
                    value={stats?.total_sessions ?? "-"}
                />

                <TrainerStatCard
                    title="Scheduled"
                    value={stats?.scheduled_sessions ?? "-"}
                />

                <TrainerStatCard
                    title="Completed"
                    value={stats?.completed_sessions ?? "-"}
                />

                <TrainerStatCard
                    title="Canceled"
                    value={stats?.canceled_sessions ?? "-"}
                />  
            </div>

            {/* Profile */}
            <TrainerProfileCard />
        </div>
    );
}
