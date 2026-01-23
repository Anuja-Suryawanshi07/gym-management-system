import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTrainerSessions, updateSession } from "../services/trainerApi";
import toast from "react-hot-toast";

export default function EditSession() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        session_date: "",
        session_time: "",
        duration_minutes: 60,
        notes: ""
    });

    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const { data } = await getTrainerSessions();
            const session = data.sessions.find(s => s.id === Number(id));

            if (!session) {
                toast.error("Session not found");
                return navigate("/trainer/sessions");
            }

            setForm({
                session_date: session.session_date,
                session_time: session.session_time,
                duration_minutes: session.duration_minutes,
                notes: session.notes || ""
            });
        } catch (error) {
            toast.error("Failed to load session");
            console.error(error);
        }
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateSession(id,form);
            toast.success("Session updated");
            navigate("/trainer/sessions");
        } catch (error) {
            toast.error("Failed to update session");
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Edit Session</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="date"
                    name="session_date"
                    value={form.session_date}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                    required
                />

                <input 
                    type="time"
                    name="session_time"
                    value={form.session_time}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                    required
                />  

                <input
                    type="number"
                    name="duration_minutes"
                    value={form.duration_minutes}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                />

                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    className="w-full p-2 bg-gray-700 rounded"
                />  

                <button className="bg-blue-500 px-4 py-2 rounded w-full">
                    Update Session
                </button>
            </form>
        </div>
    );
}