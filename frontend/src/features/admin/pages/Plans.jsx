import { useEffect, useState } from "react";
import { getAllPlans, deletePlan } from "../services/adminApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data } = await getAllPlans();
      setPlans(data.plans || []);
    } catch (error) {
      toast.error("Failed to load plans");
      console.error(error);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedPlanId(id);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedPlanId(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!selectedPlanId) return;

    try {
      await deletePlan(selectedPlanId);
      toast.success("Plan deleted successfully");

      setPlans((prev) =>
        prev.filter((p) => p.id !== selectedPlanId)
      );

      closeDeleteModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete plan"
      );
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Plans</h2>

        <button
          onClick={() => navigate("/dashboard/admin/plans/add")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          + Add Plan
        </button>
      </div>

      <table className="w-full text-left border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Duration</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {plans.map((p) => (
            <tr key={p.id} className="border-t border-gray-700">
              <td className="p-3">{p.plan_name}</td>
              <td className="p-3">{p.duration_months} months</td>
              <td className="p-3">₹{p.price}</td>

              <td className="p-3">
                <span
                  className={
                    p.status === "active"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  ● {p.status}
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/dashboard/admin/plans/${p.id}/edit`)
                  }
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => openDeleteModal(p.id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {plans.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="p-4 text-center text-gray-500"
              >
                No plans found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <ConfirmModal
          title="Delete Plan"
          message="Are you sure you want to delete this plan? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}
