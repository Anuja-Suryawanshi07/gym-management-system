import { useEffect, useState } from "react";
import { deactivateTrainer, getAllTrainers } from "../services/adminApi";
import { Eye, Edit, Ban } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";



export default function TrainerList() {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDeactivate = async (trainerId) => {
    const confirm = window.confirm(
        "Are you sure, you want to deactivate this trainer?"
    );

    if (!confirm) return;

    try {
        await deactivateTrainer(trainerId);
        toast.success("Trainer deactivated");
        refresh();
    } catch (err) {
        toast.error(
            err.response?.data?.message || "Failed to deactivate trainer"
        );
    }
  };
  const fetchTrainers = async () => {
    try {
      const res = await getAllTrainers();
      setTrainers(res.data.trainers || []);
    } catch (err) {
      setError("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Loading trainers...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trainers</h1>

        <Link
          to="/dashboard/admin/trainers/add"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          + Add Trainer
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 rounded">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Specialty</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {trainers.map((t) => (
              <tr key={t.user_id} className="border-t border-gray-700">
                <td className="p-3">{t.full_name}</td>
                <td className="p-3">{t.email}</td>
                <td className="p-3">{t.specialty || "-"}</td>
                <td className="p-3">{t.experience_years} yrs</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      t.status === "active"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="p-3 flex gap-3">
                  <button  className="text-blue-500 hover:text-blue-600"
                    onClick={() => navigate(`/dashboard/admin/trainers/${t.user_id}`)}
                    title="View Trainer">
                    <Eye size={18} />
                  </button>

                  <button className="text-yellow-500 hover:text-yellow-600"
                    onClick={() =>
                  navigate(`/dashboard/admin/trainers/${t.user_id}/edit`)
                    }
                    title="Edit Trainer">
                    <Edit size={18} />
                  </button>

                  <button className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeactivate(t.user_id)}
                    title="Deactivate Trainer" >
                    <Ban size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {trainers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No trainers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
