import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMemberById,
  getTrainers,
  getPlans,
  assignTrainerAndPlan,
  updateMemberStatus,
} from "../services/adminApi";
import toast from "react-hot-toast";

export default function MemberDetails() {
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [trainerId, setTrainerId] = useState("");
  const [planId, setPlanId] = useState("");

  const [status, setStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  // Fetch member details
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await getMemberById(id);
        setMember(res.data.member);
        setStatus(res.data.member.membership_status);
      } catch (err) {
        console.error("Failed to fetch member details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setStatusLoading(true);
      await updateMemberStatus(id, status);
      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  // Fetch trainers & plans
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [trainerRes, planRes] = await Promise.all([
          getTrainers(),
          getPlans(),
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
    console.log("Assigning:", trainerId, planId);

    if (!trainerId || !planId) {
      toast("Please select both trainer and plan", {
        icon: "⚠️",
      });
      return;
    }

    try {
      await assignTrainerAndPlan(id, trainerId, planId);

      toast.success("Trainer & Plan assigned successfully");

      // Refresh member details
      const res = await getMemberById(id);
      setMember(res.data.member);
    } catch (err) {
      console.error("Assignment failed", err);
      toast.error("Assignment failed");
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
      {/* Membership Status */}
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-3">Membership Status</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 bg-gray-900 rounded mb-3"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={handleStatusUpdate}
          disabled={statusLoading || status === member.membership_status}
          className="bg-green-500 px-4 py-2 rounded text-black font-bold disabled:opacity-50"
        >
          {statusLoading ? "Updating..." : "Update Status"}
        </button>
      </div>

      {/* Member Info */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-3">
        <h1 className="text-2xl font-bold">Member Details</h1>

        <p>
          <strong>Name:</strong> {member.full_name}
        </p>
        <p>
          <strong>Email:</strong> {member.email}
        </p>
        <p>
          <strong>Phone:</strong> {member.phone}
        </p>

        <hr className="border-gray-600 my-4" />

        <p>
          <strong>Status:</strong> {member.membership_status}
        </p>
        <p>
          <strong>Health Goals:</strong> {member.health_goals || "-"}
        </p>
        <p>
          <strong>Membership Start:</strong>{" "}
          {member.membership_start_date?.slice(0, 10) || "-"}
        </p>
        <p>
          <strong>Membership End:</strong>{" "}
          {member.membership_end_date?.slice(0, 10) || "-"}
        </p>
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
          {trainers.map((t) => (
            <option key={t.user_id} value={t.user_id}>
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
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.plan_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={!!member.assigned_trainer_id && !!member.current_plan_id}
          className="bg-yellow-400 px-4 py-2 rounded text-black font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {member.assigned_trainer_id ? "Already Assigned" : "Assign"}
        </button>
      </div>
    </div>
  );

  <div className="bg-gray-800 p-6 rounded-lg space-y-3">
    <h2 className="text-xl font-bold mb-3">Assigned Details</h2>

    <p>
      <strong>Trainer:</strong> {member.trainer_name || "Not Assigned"}
    </p>

    <p>
      <strong>Plan:</strong> {member.plan_name || "Not Assigned"}
    </p>
  </div>;
}
