import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createPlan } from "../services/adminApi";

export default function AddPlan() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        plan_name: "",
        duration_months: "",
        price: "",
        description: "",
        status: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.plan_name || !form.duration_months || !form.price) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            await createPlan({
                ...form,
                duration_months: Number(form.duration_months),
                price: Number(form.price),
            });

            toast.success("Plan created successfully");
            navigate("/dashboard/admin/plans");
        } catch (error) {
            toast.error("Failed to create plan");
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Add Plan</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="plan_name"
                    placeholder="Plan Name"
                    className="w-full p-2 bg-gray-700 rounded"
                    value={form.plan_name}
                    onChange={handleChange}
                />

                <input 
                    type="number"
                    name="duration_months"
                    placeholder="Duration (months)"
                    className="w-full p-2 bg-gray-700 rounded"
                    value={form.duration_months} 
                    onChange={handleChange}
                />

                <input 
                     type="number"
                     name="price"
                     placeholder="Price"
                     className="w-full p-2 bg-gray-700 rounded"
                     value={form.price}
                     onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Plan Description"
                        className="w-full p-2 bg-gray-700 rounded"
                        value={form.description}
                        onChange={handleChange}      
                    />

                    <select
                        name="status"
                        className="w-full p-2 bg-gary-700 rounded"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>    
                    </select>        

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            className="bg-blue-500 px-4 py-2 rounded"
                        >
                            Save Plan
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/admin/plans")}
                            className="bg-gray-600 px-4 py-2 rounded"
                        >
                            Cancel    
                        </button>    
                    </div> 
            </form>
        </div>
    );
}