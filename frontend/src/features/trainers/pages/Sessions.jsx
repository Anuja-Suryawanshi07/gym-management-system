import { useEffect, useState } from "react";
import { getTrainerSessions } from "../services/trainerApi";
import { updateSessionStatus } from "../services/trainerApi";
import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  

  const formatDate = (date) => {
    // Handles both: "YYYY-MM-DD" and "YYYY-MM-DDT00:00:00.000Z"
    return date?.split("T")[0];
  };

  const formatTime = (time) => {
    // Converts "19:00:00" → "19:00"
    return time?.slice(0, 5);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await getTrainerSessions();
      setSessions(data.sessions);
    } catch (error) {
      toast.error("Failed to load sessions");
      console.error(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateSessionStatus(id, status);
      toast.success(`Session ${status}`);
      loadSessions();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-800 rounded px-4 py-2">
      <div className="flex justify-between mb-4">
        <h2 className="text-gray-400 font-bold">My Sessions</h2>
        <button
          onClick={() => navigate("/trainer/sessions/add")}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Add Session
        </button>
      </div>

      <table className="w-full text-left text-gray-400">
        <thead>
          <tr className="border-b border-gray-700">
            <th>Member</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-t border-gray-700">
              <td>{s.member_name}</td>
              <td>{formatDate(s.session_date)}</td>
              <td>{formatTime(s.session_time)}</td>
              <td>
                <StatusBadge status={s.status} />
              </td>

              <td className="flex gap-2">
                {s.status === "scheduled" && (
                  <>
                    <button
                      onClick={() => navigate(`/trainer/sessions/${s.id}/edit`)}
                      className="bg-yellow-500 px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleStatusChange(s.id, "completed")}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => handleStatusChange(s.id, "canceled")}
                      className="bg-red-600 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
