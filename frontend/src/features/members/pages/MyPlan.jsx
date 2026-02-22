import { useEffect, useState } from "react";
import { getMyPlan, getMemberProfile } from "../services/memberApi";
import RenewPlanCard from "./RenewPlanCard";
import { CalendarDays, IndianRupee, User } from "lucide-react";
import toast from "react-hot-toast";

export default function MyPlan() {
  const [plan, setPlan] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanData = async () => {
    try {
      setLoading(true);

      const [planRes, profileRes] = await Promise.all([
        getMyPlan(),
        getMemberProfile(),
      ]);

      setPlan(planRes.data.plan);
      setMemberProfile(profileRes.data.profile);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  if (loading) {
    return <p className="text-white p-6">Loading your plan...</p>;
  }

  if (!plan) {
    return <p className="text-red-400 p-6">No active plan found</p>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">My Membership Plan</h1>

      {/* Current Plan Card */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-3">
        <h2 className="text-xl font-semibold">{plan.plan_name}</h2>

        <p className="flex items-center gap-2">
          <IndianRupee size={18} />
          ₹{plan.price}
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

        {memberProfile?.trainer_name ? (
          <>
            <p className="flex items-center gap-2">
              <User size={18} />
              {memberProfile.trainer_name}
            </p>

            <p className="text-gray-400">
              Specialty: {memberProfile.trainer_specialty || "-"}
            </p>
          </>
        ) : (
          <p className="text-yellow-400">Trainer not assigned yet</p>
        )}
      </div>

      {/* Renew / Change Plan */}
      <RenewPlanCard
        plan={plan}
        onSuccess={fetchPlanData}
      />
    </div>
  );
}
