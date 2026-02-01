import { useEffect, useState } from "react";
import { getMyPlan, getMemberProfile } from "../services/memberApi";
import { CalendarDays, IndianRupee, User } from "lucide-react";
import toast from "react-hot-toast";

export default function MyPlan() {
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const [planRes, profileRes] = await Promise.all([
          getMyPlan(),
          getMemberProfile(),
        ]);

        console.log("Plan:", planRes.data.plan);
        console.log("Profile:", profileRes.data.profile);

        setPlan(planRes.data.plan);
        setProfile(profileRes.data.profile);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, []);

  if (loading) {
    return <p className="text-white p-6">Loading your plan...</p>;
  }

  if (!plan) {
    return <p className="text-red-400">No active plan found</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Membership Plan</h1>

      {/* Plan Card */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-3">
        <h2 className="text-xl font-semibold">{plan.plan_name}</h2>

        <p className="flex items-center gap-2">
          <IndianRupee size={18} />
          {plan.price}
        </p>

        <p>
          Duration: <strong>{plan.duration_months} months</strong>
        </p>

        <p className="flex items-center gap-2">
          <CalendarDays size={18} />
          Start: {plan.membership_start_date}
        </p>

        <p className="flex items-center gap-2">
          <CalendarDays size={18} />
          End: {plan.membership_end_date}
        </p>

        {plan.description && (
          <p className="text-gray-400">{plan.description}</p>
        )}
      </div>

      {/* Trainer Card */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold">Assigned Trainer</h2>

        {profile?.trainer_name ? (
          <>
            <p className="flex items-center gap-2">
              <User size={18} />
              {profile.trainer_name}
            </p>

            <p className="text-gray-400">
              Specialty: {profile.trainer_specialty || "-"}
            </p>
          </>
        ) : (
          <p className="text-yellow-400">Trainer not assigned yet</p>
        )}
      </div>
    </div>
  );
}
