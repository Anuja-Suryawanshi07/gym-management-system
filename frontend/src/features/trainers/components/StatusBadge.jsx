export default function StatusBadge({ status }) {
    const statusStyles = {
        scheduled: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
        completed: "bg-green-500/20 text-green-500 border border-green-500/30",
        canceled: "bg-red-500/20 text-red-500 border border-red-500/30",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyles[status] || "bg-gray-500/20 text-gray-400"}`}>
            {status}
        </span>
    );
}