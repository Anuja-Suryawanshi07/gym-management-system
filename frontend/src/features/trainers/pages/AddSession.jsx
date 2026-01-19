import { useState } from "react";
import { createSession } from "../services/trainerApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddSession() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        member_id: "",
        session_date: "",
        session_time: "",
        duration_minutes: 60,
        notes: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createSession(form);
            toast.success("Session scheduled successfully");
            navigate("/trainer/sessions");
        } catch (error) {
            toast.error("Failed to schedule session");
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Schedule Session</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    name="member_id"
                    placeholder="Member ID"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                    required
                />

                <input 
                    type="date"
                    name="session_date"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                    required
                />

                <input 
                      type="time"
                      name="session_time"
                      className="w-full p-2 bg-gray-700 rounded"
                      onChange={handleChange}
                      required
                />

                <input 
                    type="number"
                    name="duration_minutes"
                    placeholder="Duration (minutes)"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                />

                <textarea
                    name="notes"
                    placeholder="Notes(optional)"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                />  

                <button className="bg-blue-500 px-4 py-2 rounded w-full">
                    Create Session  
                </button>      
            </form>
        </div>
    );
}