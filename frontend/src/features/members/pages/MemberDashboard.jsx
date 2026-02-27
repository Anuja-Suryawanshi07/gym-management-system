import { useEffect, useState } from "react";
import { getMemberProfile } from "../services/memberApi";
import StatCard from "../../common/components/StatCard";
import MemberProfileCard from "../components/MemberProfileCard";
import { ShieldCheck, Zap, Calendar, UserCheck } from "lucide-react";

export default function MemberDashboard() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        getMemberProfile()
            .then(res => setProfile(res.data.profile))
            .catch(err => console.error(err));
    }, []);

    if (!profile) {
        return <div className="p-8 text-white">Loading...</div>;
    }

    return (
        
        <div className="p-8 space-y-8 bg-gray-950 min-h-screen text-white">
            <header className="mb-10 border-b border-gray-800/50 pb-5">
                <h1 className="text-4xl font-black tracking-tight">
                    Welcome, {profile.full_name.split(' ')[0]} <span className="text-orange-500 text-5xl">.</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Membership" 
                    value={profile.membership_status} 
                    icon={ShieldCheck} 
                    colorClass={profile.membership_status === 'active' ? 'bg-green-600' : 'bg-red-600'} 
                />
                <StatCard title="Plan" value={profile.plan_name || "N/A"} icon={Zap} colorClass="bg-orange-600" />
                <StatCard title="Valid Until" value={new Date(profile.membership_end_date).toLocaleDateString()} icon={Calendar} colorClass="bg-blue-600" />
                <StatCard title="Trainer" value={profile.trainer_name || "Unassigned"} icon={UserCheck} colorClass="bg-purple-600" />
            </div>

            <MemberProfileCard profile={profile} />
        </div>
    );
}