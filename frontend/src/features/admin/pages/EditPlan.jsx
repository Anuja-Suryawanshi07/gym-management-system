import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getPlanById, updatePlan } from "../services/adminApi";

export default function EditPlan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        plan_name: "",
        duration_months: "",
        price: "",
        description: "",
        status: "active",
    });

    useEffect(() => {
        loadPlan();
    }, []);

    const loadPlan = async () => {
        try {
            const { data } = await getPlanById(id);

            const plan = data.plan || data;

            setForm({
                plan_name: plan.plan_name || "",
                duration_months: plan.duration_months || "",
                price: plan.price || "",
                description: plan.description || "",
                status: plan.status || "active",
            });

            setLoading(false);
        } catch (error) {
            toast.error("Failed to load plan");
            console.error(error);
            navigate("/dashboard/admin/plans");
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updatePlan(id, {
                ...form,
                duration_months: Number(form.duration_months),
                price: Number(form.price),
            });

            toast.success("Plan updated successfully");
            navigate("/dashboard/admin/plans");
        } catch (error) {
            toast.error("Failed to update plan");
            console.error(error);
        }
    };

    if (loading) {
        return <p className="p-6">Loading plan...</p>;
    }

    return (
        <div className="max-w-xl bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Edit Plan</h2>

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
                    placeholder="Description"
                    className="w-full p-2 bg-gray-700 rounded"
                    value={form.description}
                    onChange={handleChange}
                />

                <select
                    name="status"
                    className="w-full p-2 bg-gray-700 rounded"
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
                        Update Plan
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
