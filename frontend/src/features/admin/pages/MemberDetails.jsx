import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMemberById,
  getTrainers,
  getAllPlans,
  assignTrainerAndPlan,
  updateMemberStatus,
  updateMembershipDates,
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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateLoading, setDateLoading] = useState(false);
  
  // -------- Fetch member details -------//
      const fetchMember = async () => {
      try {
        const res = await getMemberById(id);
        const m = res.data.member;
        setMember(m);
        setStatus(m.membership_status || "Inactive");
        setStartDate(m.membership_start_date?.slice(0, 10) || "");
        setEndDate(m.membership_end_date?.slice(0, 10) || "");

        setTrainerId(m.assigned_trainer_id || "");
        setPlanId(m.current_plan_id || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch member details");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchMember();
    },[id]);
  
        // ----- Fetch trainers & plans ----- //
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [trainerRes, planRes] = await Promise.all([
          getTrainers(),
          getAllPlans(),
        ]);

        setTrainers(trainerRes.data.trainers || []);
        setPlans(planRes.data.plans || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load trainers or plans");
      }
    };
    fetchMetaData();
  }, []);

  // ------- Status Update ----- //
  const handleStatusUpdate = async () => {
    try {
      setStatusLoading(true);
      await updateMemberStatus(id, status);
      toast.success("Membership status updated");
      fetchMember();
    } catch (err) {
      console.error(err);
      toast.error("failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  // ------- Date Update -------- //
  const handleDateUpdate = async () => {
    if (!startDate || !endDate) {
      toast.error("Both dates are required");
      return;
    }

    try {
      setDateLoading(true);
      await updateMembershipDates(id, {
        membership_start_date: startDate,
        membership_end_date: endDate,
      });

      toast.success("Membership dates updated");
      fetchMember();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update membership dates");
    } finally {
      setDateLoading(false);
    }
  };

  // ------ Assign trainer & plan ------ //
  const handleAssign = async () => {
    //console.log("Assigning:", trainerId, planId);
  
    if (!trainerId || !planId) {
      toast("Please select both trainer and plan");
      return;
    }

    try {
      await assignTrainerAndPlan(id, trainerId, planId);
      toast.success("Trainer & Plan assigned successfully");
      fetchMember();
      // Refresh member details
      //const res = await getMemberById(id);
      //setMember(res.data.member);
    } catch (err) {
      console.error(err);
      toast.error("Assignment failed");
    }
  };
  // ------- UI Status ------- //
   if (loading) {
    return <p className="p-6 text-gray-400">Loading member details...</p>;
  }

  if (!member) {
    return <p className="p-6 text-red-500">Member not found</p>;
  }

  return (
    <div className="p-6 space-y-6 text-white">

      {/* MEMBER BASIC INFO */}
      <div className="bg-gray-800 p-6 rounded">
        <h1 className="text-2xl font-bold mb-4">Member Details</h1>

        <p><strong>Name:</strong> {member.full_name}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Phone:</strong> {member.phone || "-"}</p>
        <p><strong>Health Goals:</strong> {member.health_goals || "-"}</p>
      </div>

      {/* STATUS */}
      <div className="bg-gray-800 p-6 rounded">
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

      {/* MEMBERSHIP DATES */}
      <div className="bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-3">Membership Period</h2>

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 bg-gray-900 rounded mb-3"
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 bg-gray-900 rounded mb-4"
        />

        <button
          onClick={handleDateUpdate}
          disabled={dateLoading}
          className="bg-blue-500 px-4 py-2 rounded text-black font-bold disabled:opacity-50"
        >
          {dateLoading ? "Updating..." : "Update Membership"}
        </button>
      </div>

      {/* ASSIGN TRAINER & PLAN */}
      <div className="bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Assign Trainer & Plan</h2>

        <select
          value={trainerId}
          onChange={(e) => setTrainerId(e.target.value)}
          className="w-full p-2 bg-gray-900 rounded mb-4"
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
          className="w-full p-2 bg-gray-900 rounded mb-4"
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
          className="bg-yellow-400 px-4 py-2 rounded text-black font-bold hover:bg-yellow-500"
        >
          Assign
        </button>
      </div>

      {/* ASSIGNED SUMMARY */}
      <div className="bg-gray-800 p-6 rounded">
        <h2 className="text-xl font-bold mb-3">Assigned Details</h2>

        <p><strong>Trainer:</strong> {member.trainer_name || "Not Assigned"}</p>
        <p><strong>Plan:</strong> {member.plan_name || "Not Assigned"}</p>
      </div>
    </div>
  );
}
