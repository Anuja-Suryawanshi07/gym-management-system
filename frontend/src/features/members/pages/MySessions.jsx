import { useEffect, useState } from "react";
import { getMySessions } from "../services/memberApi";
import { CalendarDays, Clock, User } from "lucide-react";
import toast from "react-hot-toast";

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getMySessions();
        setSessions(res.data.sessions || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <p className="p-6 text-white">Loading your sessions...</p>;
  }

  if (sessions.length === 0) {
    return (
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">My Sessions</h1>
        <p className="text-gray-400">No sessions scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">My Sessions</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <div
            key={session.session_id}
            className="bg-gray-800 p-5 rounded-lg border border-gray-700 space-y-3"
          >
            {/* Trainer */}
            <p className="flex items-center gap-2">
              <User size={18} />
              <span className="font-semibold">
                {session.trainer_name || "Trainer"}
              </span>
            </p>

            {/* Date */}
            <p className="flex items-center gap-2 text-gray-300">
              <CalendarDays size={18} />
              {session.session_date}
            </p>

            {/* Time & Duration */}
            <p className="flex items-center gap-2 text-gray-300">
              <Clock size={18} />
              {session.session_time} · {session.duration_minutes} mins
            </p>

            {/* Notes */}
            {session.notes && (
              <p className="text-gray-400 text-sm">
                Notes: {session.notes}
              </p>
            )}

            {/* Status */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${
                  session.status === "completed"
                    ? "bg-green-600"
                    : session.status === "scheduled"
                    ? "bg-blue-600"
                    : "bg-red-600"
                }`}
            >
              {session.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
