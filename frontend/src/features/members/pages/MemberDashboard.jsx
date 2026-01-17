import MemberProfileCard from "../components/MemberProfileCard";
import MemberStatCard from "../components/MemberStatCard";

export default function MemberDashboard() {
    const user = JSON.parse(localStorage.getItem("gym_user"));

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold">Member Dashboard</h1>

            {/* Profile Card */}
            <MemberProfileCard user={user} />

            {/* Stats */}
            <div className="grid grid-col-1 md:grid-cols-3 gap-4">
                <MemberStatCard title="Membership Status" value="Active" />
                <MemberStatCard title="Trainer Assigned" value="Not Assigned" />
                <MemberStatCard title="Workouts This Week" value="0" />
            </div>
        </div>
    );
}