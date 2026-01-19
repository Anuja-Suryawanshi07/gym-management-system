import { useEffect, useState } from "react";
import { getTrainerSessions } from "../services/trainerApi";
import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sessions() {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

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

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">My Sessions</h2>
                <button
                    onClick={() => navigate("/trainer/sessions/add")}
                    className="bg-blue-500 px-4 py-2 rounded"
                >
                    Add Session    
                </button>    
            </div> 

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th>Member</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map(s => (
                        <tr key={s.id} className="border-t border-gray-700">
                            <td>{s.member_name}</td>
                            <td>{s.session_date}</td>
                            <td>{s.session_time}</td>
                            <td>
                                <StatusBadge status={s.status} />
                            </td>
                            <td className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/trainer/sessions/${s.id}/edit`)}
                                    className="bg-yellow-500 px-3 py-1 rounded"
                                >
                                    Edit     
                                </button>    
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}