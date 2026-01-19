import { useEffect, useState } from "react";
import { getPlans, deletePlan } from "../services/adminApi";
import { useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlanId,  setSelectedPlanId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const { data } = await getPlans();
            setPlans(data.plans || []);
        } catch (error) {
            toast.error("Failed to load plans");
            console.error(error);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedPlanId(id);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedPlanId(null);
        setShowModal(false);
    };


    const handleDelete = async () => {
        try {
            await deletePlan(selectedPlanId);
            toast.success("Plan deleted successfully");

            setPlans((prev) => 
                prev.filter((p) => p.id !== selectedPlanId)
            );

            closeDeleteModal();
        } catch (error) {
            toast.error("Failed to delete plan");
            console.error(error)
        }
    };    
        

     return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Plans</h2>
                <button
                    onClick={() => navigate("/dashboard/admin/plans/add")}
                    className="bg-blue-500 px-4 py-2 rounded"
                >
                    Add Plan
                </button>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th>Name</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {plans.map((p) =>  (
                        <tr key={p.id} className="border-t border-gray-700">
                            <td>{p.plan_name}</td>
                            <td>{p.duration_months} months</td>
                            <td>{p.price}</td>
                            <td>{p.status}</td>
                            <td className="flex gap-2">
                                <button
                                    onClick={() =>
                                        navigate(`/dashboard/admin/plans/${p.id}/edit`)
                                    }
                                    className="bg-yellow-500 px-3 py-1 rounded"
                                >
                                Edit
                                </button>   

                                <button 
                                    onClick={() =>openDeleteModal(p.id)}
                                    className="bg-red-500 px-3 py-1 rounded"
                                >
                                    Delete    
                                </button>     
                            </td>
                         </tr>
                    ))}
                    </tbody>    
            </table>

            {showModal && (
                <ConfirmModal
                    title="Delete Plan"
                    message="Are you sure you want to delete this plan? This action cannot be undone."
                    onConfirm={handleDelete}
                    onCancel={closeDeleteModal}
                />    
            )}
        </div>
    );
}