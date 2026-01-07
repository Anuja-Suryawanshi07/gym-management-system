import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { 
    getMembershipRequests,
    updateMembershipRequestStatus
} from "../services/adminApi";
import StatusBadge from "../components/StatusBadge";

export default function MembershipRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await getMembershipRequests();
            setRequests(res.data.data);
        } catch (err) {
            console.error("Failed to fetch membership requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await updateMembershipRequestStatus(id, status);

            // Remove updated row from UI
            setRequests(prev => prev.map(r => r.id === id ? { ... r, status } : r ));

            alert(`Request ${status} successfully`);
        } catch (err) {
            console.error("Action failed", err);
            alert("Failed to update request");
        }
    };

    if (loading) {
        return <p className="text-white p-6">Loading membership requests...</p>;
    }

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-6">Membership Requests</h1>

            <div className="overflow-x-auto">
                <table className="w-full bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="bg-gray-900 text-left">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Message</th>
                            <th className="p-3">Status</th>
                            <th className=" border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-400">
                                    No membership requests found
                                </td>
                            </tr>
                        ) : (
                            requests.map(req => (
                                <tr
                                    key={req.id}
                                    className="border-t border-gray-700 hover:bg-gray-700/50"
                                >
                                    <td className="p-3">{req.full_name}</td>
                                    <td className="p-3">{req.email}</td>
                                    <td className="p-3">{req.phone}</td>
                                    <td className="p-3">{req.message}</td>
                                    <td className="p-3"><StatusBadge status={req.status} /></td>
                                    <td className=" border p-3 space-x-2">
                                        {req.status?.toLowerCase() === "pending" ? (
                                            <>
                                            <button
                                                onClick={() =>
                                                    handleAction(req.id, "approved")
                                                }
                                                className="bg-green-500 px-3 py-1 rounded text-black font-semibold hover:bg-green-600"
                                            >
                                            Approve
                                            </button> 
                                            <button
                                                onClick={() =>
                                                    handleAction(req.id, "rejected")
                                                }
                                                className="bg-red-500 px-3 py-1 rounded text-black font-semibold hover:bg-red-600"
                                            >
                                            Reject
                                            </button>   
                                            </>
                                        ) : (
                                            <span className="text-gray-400 italic">
                                                Processed
                                            </span>
                                        )}
                                    </td>
                                </tr>    
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}