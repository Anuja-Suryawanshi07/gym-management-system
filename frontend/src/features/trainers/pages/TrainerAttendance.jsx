import { useEffect, useState } from "react";
import {
  getAssignedMembers,
  checkInMember,
  checkOutMember,
} from "../services/attendanceApi";

export default function TrainerAttendance() {
  const [members, setMembers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await getAssignedMembers();
      setMembers(res.data.members);
    } catch (err) {
      setError("Failed to load members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    console.log("Members from API:", members);
  }, [members]);

  const handleCheckIn = async (memberId) => {
    setLoadingId(memberId);
    try {
      await checkInMember(memberId);
      await fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Checked-in failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCheckOut = async (memberId) => {
    setLoadingId(memberId);
    try {
      await checkOutMember(memberId);
      await fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed");
    } finally {
      setLoadingId(null);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-600 rounded">
          <thead className="bg-gray-400">
            <tr>
              <th className="p-3 text-left">Member</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr key={m.user_id} className="border-t bg-gray-300">
                {/* Member */}
                <td className="p-3 font-medium text-gray-800">{m.full_name}</td>

                {/* Status */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${
                        m.is_checked_in ? "bg-green-600" : "bg-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        m.is_checked_in ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {m.is_checked_in ? "Checked In" : "Not Checked In"}
                    </span>
                  </div>
                </td>

                {/* Action */}
                <td className="p-3">
                  {m.is_checked_in ? (
                    <button
                      onClick={() => handleCheckOut(m.user_id)}
                      disabled={loadingId === m.user_id}
                      className="px-4 py-1 text-sm font-semibold border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white disabled:opacity-50"
                    >
                      {loadingId === m.user_id ? "Processing..." : "Check Out"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(m.user_id)}
                      disabled={loadingId === m.user_id}
                      className="px-4 py-1 text-sm font-semibold border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white disabled:opacity-50"
                    >
                      {loadingId === m.user_id ? "Processing..." : "Check In"}
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {members.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No members assigned
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
