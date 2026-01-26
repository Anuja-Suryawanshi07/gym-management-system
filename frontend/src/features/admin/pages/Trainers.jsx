import { useEffect, useState } from "react";
import TrainerList from "./TrainerList";
import { getAllTrainers } from "../services/adminApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Trainers() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchTrainers = async () => {
        try{
            setLoading(true);
            const res = await getAllTrainers();
            setTrainers(res.data.trainers || res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load trainers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    if (loading) {
        return <p className="text-gray-400 p-6">Loading trainers...</p>
    }


    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">Trainers</h1>

                <button 
                    onClick={() => navigate("/dashboard/admin/trainers/add")}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                    + Add Trainer                    
                </button>    
            </div>
            
            <TrainerList
                trainers={trainers}
                refresh={fetchTrainers}
            />
        </div>
    );
}