import { useEffect, useState } from "react";
import { getAllTrainers, deleteTrainer } from "../../../features/admin/services/adminApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Trainers() {
    const [trainers, setTrainers] = useState([]);
    const navigate = useNavigate();

    const fetchTrainers = async () => {
        try{
            const res = await getAllTrainers();
            setTrainers(res.data.trainers);
        } catch {
            toast.error("Failed to load trainers");
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this Trainer?")) return;

        try {
            await deleteTrainer(id);
            toast.success("Trainer deleted");
            setTrainers((prev) =>
                prev.filter((trainer) => trainer.user_id == id)
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to Delete trainer");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Trainers</h1>

            <table className="w-full text-left border border-gray-700">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Specialty</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trainers.map((t) => (
                        <tr key={t.user_id} className="border-t border-gray-700 hover:bg-gray-700/50">
                            <td className="p-3">{t.full_name}</td>
                            <td className="p-3">{t.email}</td>
                            <td className="p-3">{t.specialty}</td>
                            <td className="p-3 flex gap-2">
                                <button
                                    onClick={() => navigate(`/dashboard/admin/trainers/${t.user_id}`)}
                                    className="bg-blue-500 px-3 py-1 rounded text-black"
                                >
                                View
                                </button>

                                <button
                                    onClick={() => handleDelete(t.user_id)}
                                    className="bg-red-500 px-3 py-1 rounded"
                                >
                                Delete    
                                </button>        
                            </td>
                        </tr>
                    ) )}
                </tbody>
            </table>
        </div>
    );
}