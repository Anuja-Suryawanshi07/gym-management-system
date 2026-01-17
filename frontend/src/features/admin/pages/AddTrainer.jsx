import { useState } from "react";
import { createTrainer } from "../services/adminApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddTrainer() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        specialty: "",
        experience_years: "",
        certification_details: "",
        status: "active"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createTrainer(form);
            toast.success("Trainer added successfully");
            navigate("/dashboard/admin/trainers");
        } catch (err) {
            toast.error("Failed to add trainer");
            console.error(err);
        }
    };

    return (
        <div className="max-w-xl bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Add Trainer</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="full_name"
                    placeholder="Full Name"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                    required
                />

                <input 
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                    required
                />

                <input 
                    name="phone"
                    placeholder="Phone"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Temporary Password"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                    required
                />    

                <input 
                    name="specialty"
                    placeholder="Specialty"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                /> 

                <input 
                    name="experience_years"
                    type="number"
                    placeholder="Experience (years)"
                    className="w-full p-2bg-gray-700 rounded"
                    onChange={handleChange}
                />       

                <textarea
                    name="certification_details"
                    placeholder="Certifications"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                />

                <select
                    name="status"
                    className="w-full p-2 bg-gray-700 rounded"
                    onChange={handleChange}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>    
                </select>             

                <button className="bg-blue-500 px-4 py-2 rounded">
                    Add Trainer    
                </button>   
            </form>
        </div>
    );
}
