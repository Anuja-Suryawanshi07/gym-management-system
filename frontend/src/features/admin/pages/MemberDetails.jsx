import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMemberById,
  getTrainers,
  getPlans,
  assignTrainerAndPlan
} from "../services/adminApi";

export default function MemberDetails() {
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [trainerId, setTrainerId] = useState("");
  const [planId, setPlanId] = useState("");

  // Fetch member details
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await getMemberById(id);
        setMember(res.data.member);
      } catch (err) {
        console.error("Failed to fetch member details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  // Fetch trainers & plans
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [trainerRes, planRes] = await Promise.all([
          getTrainers(),
          getPlans()
        ]);

        setTrainers(trainerRes.data.trainers);
        setPlans(planRes.data.plans);
      } catch (err) {
        console.error("Failed to load trainers or plans", err);
      }
    };

    fetchMetaData();
  }, []);

  // Assign trainer & plan
  const handleAssign = async () => {
    if (!trainerId || !planId) {
      alert("Please select both trainer and plan");
      return;
    }

    try {
      await assignTrainerAndPlan(id, {
        trainer_id: trainerId,
        plan_id: planId
      });

      alert("Trainer & Plan assigned successfully");

      // Refresh member details
      const res = await getMemberById(id);
      setMember(res.data.member);

    } catch (err) {
      console.error("Assignment failed", err);
      alert("Assignment failed");
    }
  };

  if (loading) {
    return <p className="text-white p-6">Loading member details...</p>;
  }

  if (!member) {
    return <p className="text-red-400 p-6">Member not found</p>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Member Details</h1>

      {/* Member Info */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-3">
        <p><strong>Name:</strong> {member.full_name}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Phone:</strong> {member.phone}</p>

        <hr className="border-gray-600 my-4" />

        <p><strong>Status:</strong> {member.membership_status}</p>
        <p><strong>Health Goals:</strong> {member.health_goals || "-"}</p>
        <p><strong>Membership Start:</strong> {member.membership_start_date?.slice(0, 10)}</p>
        <p><strong>Membership End:</strong> {member.membership_end_date?.slice(0, 10)}</p>
      </div>

      {/* Assign Trainer & Plan */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Assign Trainer & Plan</h2>

        <select
          value={trainerId}
          onChange={(e) => setTrainerId(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-900 rounded"
        >
          <option value="">Select Trainer</option>
          {trainers.map(t => (
            <option key={t.id} value={t.id}>
              {t.full_name}
            </option>
          ))}
        </select>

        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-900 rounded"
        >
          <option value="">Select Plan</option>
          {plans.map(p => (
            <option key={p.id} value={p.id}>
              {p.plan_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="bg-yellow-400 px-4 py-2 rounded text-black font-bold hover:bg-yellow-500"
        >
          Assign
        </button>
      </div>
    </div>
  );
}
