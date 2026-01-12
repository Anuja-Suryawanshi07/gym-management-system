import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrainerById } from "../services/adminApi";
import toast from "react-hot-toast";

export default function TrainerDetails() {
    const { id } = useParams();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchTrainer = async () => {
        try {
            const res = await getTrainerById(id);

            console.log("TRAINER API RESPONSE:", res.data);
            setTrainer(res.data.trainer);
        } catch (err) {
            console.error("Failed to fetch trainer", err);
            toast.error("Failed to load trainer");
        } finally {
            setLoading(false);
        }
    };

    fetchTrainer();
 }, [id]);
 
 if (loading) return <p>Loading...</p>;
 if(!trainer) return <p>No trainer found</p>;

 return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-3">
        <h1 className="text-2xl font-bold">Trainer Details</h1>

        <p><strong>Name:</strong> {trainer.full_name}</p>
        <p><strong>Email:</strong> {trainer.email}</p>
        <p><strong>Phone:</strong> {trainer.phone}</p>

        <hr className="border-gray-600 my-4" />

        <p><strong>Specialization:</strong> {trainer.specialty}</p>
        <p><strong>Experience:</strong> {trainer.experience_years} years</p>
        <p><strong>Certification:</strong> {trainer.certification_details}</p>
        <p><strong>Bio:</strong> {trainer.bio || "-"}</p>
    </div>
 );
}