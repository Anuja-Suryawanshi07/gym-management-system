import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAssignedMembers } from "../services/trainerApi";


export default function TrainerMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
        const { data } = await getAssignedMembers();
        setMembers(data.members);
    } catch (error) {
        toast.error("Failed to load members");
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading members...</p>
  }

  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Members</h1>

        {members.length === 0 ? (
            <p>No members assigned yet.</p>
        ) : (
            <table className="w-full text-left border border-gray-700">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="p-2">Member Name</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((m) => (
                        <tr key={m.user_id} className="border-t border-gray-700">
                            <td className="p-2">{m.full_name}</td>
                            <td className="p-2">
                                {m.is_checked_in ? (
                                    <span className="text-green-500 font-semibold">
                                        Checked In
                                    </span>
                                ) : (
                                    <span className="text-gray-400">Checked Out</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
  );
}