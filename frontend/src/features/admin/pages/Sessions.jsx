import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Calendar, Clock, User, Trash2, Search } from "lucide-react";

export default function Sessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await api.get("/admin/sessions");
            setSessions(res.data.sessions);
        } catch (err) {
            console.error("Error fetching sessions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this session record?")) return;
        try {
            await api.delete(`/admin/sessions/${id}`);
            setSessions(sessions.filter(s => s.session_id !== id));
        } catch (err) {
            alert("Failed to delete session");
        }
    };

    const filteredSessions = sessions.filter(s => 
        s.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.trainer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10';
            case 'scheduled': return 'text-blue-400 bg-blue-400/10';
            case 'cancelled': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">GYM SESSIONS</h1>
                    <p className="text-gray-400 text-sm">Monitor all training activities across the facility.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text"
                        placeholder="Search member or trainer..."
                        className="bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none w-64"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading session data...</div>
            ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Session Info</th>
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4">Trainer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredSessions.map((session) => (
                                <tr key={session.session_id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium flex items-center gap-2">
                                                <Calendar size={14} className="text-yellow-500" />
                                                {new Date(session.session_time).toLocaleDateString()}
                                            </span>
                                            <span className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                                <Clock size={14} />
                                                {new Date(session.session_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration_minutes}m)
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-300 flex items-center gap-2">
                                            <User size={14} className="text-blue-500" />
                                            {session.member_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-300 font-semibold italic text-sm">
                                            {session.trainer_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <span className={`px-3 py-1 rounded-full font-bold uppercase ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleDelete(session.session_id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSessions.length === 0 && (
                        <div className="p-10 text-center text-gray-500">No sessions found matching your search.</div>
                    )}
                </div>
            )}
        </div>
    );
}