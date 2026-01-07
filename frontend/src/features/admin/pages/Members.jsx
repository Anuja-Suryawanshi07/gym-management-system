import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getMembers } from "../services/adminApi";

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
      } finally {
        setloading(false);
      }
    };
    fetchMembers();
  }, []);
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
            <tr key={m.user_id} className="border-t border-gray-700">
              <td className="p-3">{m.full_name}</td>
              <td className="p-3">{m.email}</td>
              <td className="p-3">{m.current_plan_name || "-"}</td>
              <td className="p-3">{m.assigned_trainer_name || "-"}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/members/${m.user_id}`)}
                  className="bg-blue-500 px-3 py-1 rounded text-black font-semibold hover:bg-blue-600"
                >
                  View
                </button>

                <button className="bg-yellow-500 px-3 py-1 rounded">
                  Edit
                </button>

                <button className="bg-red-500 px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
