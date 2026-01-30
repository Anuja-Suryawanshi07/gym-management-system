import { useEffect, useState } from "react";
import { getMemberProfile } from "../services/memberApi";
import MemberProfileCard from "../components/MemberProfileCard";
import MemberStatCard from "../components/MemberStatCard";

export default function MemberDashboard() {
    const [profile, setProfile] = useState(null);
    const user = JSON.parse(localStorage.getItem("gym_user"));

    useEffect(() => {
        getMemberProfile()
            .then(res => setProfile(res.data.profile))
            .catch(err => console.error(err));
    }, []);

    if (!profile) {
        return <p className="text-white p-6">Loading dashboard...</p>
    }

    return (
        <div className=" p-6 text-gray-500 space-y-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold">Welcome, {profile.full_name}</h1>

            {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">    
           <MemberStatCard title="Status" value={profile.membership_status} />
           <MemberStatCard title="Plan" value={profile.plan_name || "-"} />
           <MemberStatCard title="valid Till" value={profile.membership_end_date || "-"} />
           <MemberStatCard title="Trainer"value={profile.trainer_name || "-"} />
        </div>

        <MemberProfileCard profile={profile} />
        </div>
    );
}     