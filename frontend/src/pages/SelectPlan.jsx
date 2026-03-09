import { useEffect, useState } from "react";
import api from "../services/api";

export default function SelectPlan() {
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("gym_auth_token");

        // ✅ Get all plans
        const plansRes = await api.get("/plans");

        console.log("Plans:", plansRes.data); // Debug

        setPlans(plansRes.data);

        // ✅ Get member profile
        const memberRes = await api.get("/member/profile");

        setCurrentPlanId(memberRes.data.active_plan_id);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlanId) {
      alert("Please select a plan");
      return;
    }

    if (Number(selectedPlanId) === currentPlanId) {
      alert("You already have this plan active");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("gym_auth_token");

      const res = await api.post(
  "/payments/create-checkout-session",
  {
    plan_id: selectedPlanId,
    payment_method: "Stripe",
  }
);

      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Choose Your Plan</h2>

      <select
        className="w-full border p-2 mb-4"
        value={selectedPlanId}
        onChange={(e) => setSelectedPlanId(e.target.value)}
      >
        <option value="">-- Select Plan --</option>

        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.plan_name} - ₹{plan.price} ({plan.duration_months} months)
            {plan.id === currentPlanId ? " (Current Plan)" : ""}
          </option>
        ))}
      </select>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Redirecting..." : "Pay Now"}
      </button>
    </div>
  );
}
