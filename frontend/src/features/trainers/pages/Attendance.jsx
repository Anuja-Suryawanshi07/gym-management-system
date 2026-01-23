import { useEffect, useState } from "react";
import {
    getAssignedMembers,
    checkInMember,
    checkOutMember
} from "../services/attendanceApi";
import toast from "react-hot-toast";

export default function Attendance() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const { data } = await getAssignedMembers();
            setMembers(data.members);
        } catch (error) {
            toast.error("Failed to load members");
        }
    };

    const handleCheckIn = async (memberId) => {
        try {
            await checkInMember(memberId);
            toast.success("Checked in successfully");
            loadMembers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Check-in failed");
        }
    };

    const handleCheckOut = async (memberId) => {
        try {
            await checkOutMember(memberId);
            toast.success("Checked out successfully" );
            loadMembers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Check-out failed");
        }
    };

    return (
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Attendance</h1>

          <table className="w-full text-left">
            <thead>
                <tr className="border-b border-gray-700">
                    <th>Member</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {members.map((m) => (
                    <tr key={m.user_id} className="border-t border-gray-700">
                        <td>{m.full_name}</td>

                        <td>
                            {m.is_checked_in ? (
                                <span className="text-green-500">Checked In</span>
                            ) : (
                                <span className="text-gray-400">Not Checked In </span>
                            )}
                        </td>
                        
                        <td className="flex gap-2">
                            {!m.is_checked_in ? (
                                <button
                                    onClick={() => handleCheckIn(m.user_id)}
                                    className="bg-green-600 px-3 py-1 rounded"
                                >
                                    Check In
                                </button>
                            ) : (
                               <button
                                    onClick={() => handleCheckOut(m.user_id)}
                                    className="bg-red-600 px-3 py-1 rounded"
                                >
                                    Check Out
                                 </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
    );
}