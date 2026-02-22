import { useNavigate } from "react-router-dom";
import { CreditCard, CalendarCheck } from "lucide-react";

export default function RenewPlanCard({ plan }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <CalendarCheck size={18} />
        {plan.plan_name}
      </h2>

      <p className="text-gray-400">
        Duration:
        <span className="text-white font-medium">
          {" "}
          {plan.duration_months} months
        </span>
      </p>

      <p className="text-gray-400">
        Price:
        <span className="text-white font-medium">
          {" "}
          ₹{plan.price}
        </span>
      </p>

      <button
        onClick={() => navigate("/select-plan")}
        className="w-full flex items-center justify-center gap-2 
                   bg-green-600 hover:bg-green-700 
                   px-4 py-2 rounded-lg font-medium"
      >
        <CreditCard size={18} />
        Select Plan
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your membership dates will be adjusted automatically
      </p>
    </div>
  );
}
