import TrainerStatCard from "../components/TrainerStatCard";
import TrainerProfileCard from "../components/TrainerProfileCard";

export default function TrainerDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <TrainerStatCard title="Active Members" value="12" />
                <TrainerStatCard title="Sessions Today" value="4" />
                <TrainerStatCard title="Status" value="Active" />
            </div>

            {/* Profile */}
            <TrainerProfileCard />
        </div>
    );
}