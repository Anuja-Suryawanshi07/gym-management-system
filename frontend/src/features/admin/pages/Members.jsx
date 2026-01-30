import { useEffect, useState } from "react";
import { getMembers, sendPaymentReminder } from "../services/adminApi";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data.members || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleReminder = async (id) => {
    try {
      await sendPaymentReminder(id);
      toast.success("Payment reminder sent");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reminder");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-400">Loading members...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Members</h1>

      <table className="w-full border border-gray-700 text-left">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Trainer</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr
              key={m.user_id}
              className={`border-t border-gray-700 ${
                m.is_expired ? "bg-red-900/30" : "hover:bg-gray-700/40"
              }`}
            >
              {/* Name + Expired Badge */}
              <td className="p-3 flex items-center gap-2">
                <span>{m.full_name}</span>

                {m.is_expired && (
                  <>
                    <span className="bg-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                      EXPIRED
                    </span>

                    <button
                      onClick={() => handleReminder(m.user_id)}
                      className="bg-yellow-400 px-2 py-0.5 rounded text-black text-xs font-semibold"
                    >
                      Remind
                    </button>
                  </>
                )}
              </td>

              <td className="p-3">{m.email}</td>
              <td className="p-3">{m.current_plan_name || "—"}</td>
              <td className="p-3">{m.assigned_trainer_name || "—"}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    m.membership_status === "Active"
                      ? "bg-green-600"
                      : "bg-gray-600"
                  }`}
                >
                  {m.membership_status}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3">
                <button
                  onClick={() =>
                    navigate(`/dashboard/admin/members/${m.user_id}`)
                  }
                  className="bg-blue-500 p-2 rounded hover:bg-blue-600"
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}

          {members.length === 0 && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-400">
                No members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
