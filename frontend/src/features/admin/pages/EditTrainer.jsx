import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrainerById, updateTrainer } from "../services/adminApi";
import toast from "react-hot-toast";

export default function EditTrainer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        specialty: "",
        experience_years: "",
        certification_details: "",
        status: "active",
        schedule: ""
    });

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const res = await getTrainerById(id);
                setForm(res.data.trainer);
            } catch (err) {
                toast.error("Failed to load trainer data");
            }
        };

        fetchTrainer();
    }, [id]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTrainer(id, form);
            toast.success("Trainer updated successfully");
            navigate("/dashboard/admin/trainers");
        } catch (err) {
            toast.error("Failed to update trainer");
        }
    };

    return (
        <div className="max-w-xl bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Edit Trainer</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    name="specialty"
                    value={form.specialty || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Specialty"
                />
                <input 
                    name="experience_years"
                    type="number"
                    value={form.experience_years || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Experience (years)"
                />    

                <textarea
                    name="certification_details"
                    value={form.certification_details || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Certifications"
                />

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                >
                     <option value="active">Active</option>
                     <option value="inactive">Inactive</option>   
                </select>        

                <textarea
                    name="schedule"
                    value={form.schedule || ""}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Schedule"
                />  

                <button className="bg-blue-500 px-4 py-2 rounded text-black font-bold">
                    Update Trainer    
                </button>  
            </form>
        </div>
    );
}