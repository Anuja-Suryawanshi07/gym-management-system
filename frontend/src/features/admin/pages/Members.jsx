import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getMembers } from "../services/adminApi";
import { sendPaymentReminder } from "../../admin/services/adminApi";
import { toast } from "react-hot-toast";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        setMembers(res.data.members);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load members");
      } finally {
        setloading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleReminder = async (id) => {
   console.log("REMINDER CLICKED FOR:", id);

    try {
      await sendPaymentReminder(id);
      toast.success("Payment reminder sent");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reminder");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("Member deleted");
      fetchMembers();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="p-6 text-white">Loading members...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Members</h1>

      <table className="w-full bg-gray-800 rounded">
        <thead>
          <tr className="bg-gray-900">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Trainer</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr
              key={m.user_id}
              className={`border-t border-gray-700
        ${m.is_expired ? "bg-red-900/40" : "hover:bg-gray-700/50"}
      `}
            >
              {/* Name + Expiry Actions */}
              <td className="p-3 flex items-center gap-2">
                <span>{m.full_name}</span>

                {m.is_expired && (
                  <>
                    <button
                      onClick={() => handleReminder(m.user_id)}
                      className="bg-yellow-400 px-3 py-1 rounded text-black font-bold"
                    >
                      Remind
                    </button>

                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      EXPIRED
                    </span>
                  </>
                )}
              </td>

              <td className="p-3">{m.email}</td>
              <td className="p-3">{m.current_plan_name || "-"}</td>
              <td className="p-3">{m.assigned_trainer_name || "-"}</td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/members/${m.user_id}`)}
                  disabled={m.is_expired}
                  className="bg-blue-500 px-3 py-1 rounded text-black font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                  View
                </button>

                <button
                onClick={() => navigate(`/dashboard/admin/members/${m.user_id}`)} 
                className= "bg-blue-500 px-3 py-1 rounded text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(m.user_id)}
                 className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
