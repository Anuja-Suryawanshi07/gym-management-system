export default function StatusBadge({ status }) {
    const baseStyle = "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize";

    const statusStyles = {
        scheduled: "bg-yellow-500 text-black",
        completed: "bg-green-600 text-white",
        canceled: "bg-red-600 text-white",
    };

    return (
        <span className={`${baseStyle} ${statusStyles[status] || "bg-gray-500 text-white"}`}>
            {status}
        </span>
    );
}