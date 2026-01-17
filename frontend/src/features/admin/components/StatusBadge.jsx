export default function StatusBadge({ status }) {

    const styles = {
        active: "bg-green-600 text-green-100",
        inactive: "bg-gray-600 text-gray-100",
        pending: "bg-yellow-100 text-yellow-100",
        rejected: "bg-red-600 text-red-100",
        expired: "bg-red-700 text-red-100"
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status?.toLowerCase()] || "bg-gray-500 text-white"}`}
        >
          {status}  
        </span>    
    );
}