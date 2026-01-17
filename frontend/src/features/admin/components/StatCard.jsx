export default function StatCard({ title, value, icon, color = "blue" }) {
    const colors = {
        blue: "bg-blue-600",
        green: "bg-green-600",
        red: "bg-red-600",
        yellow: "bg-yellow-600",
    };

    return (
        <div className="bg-gray-800 rounded p-5 flex items-center justify-between shadow">
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>

            <div className={`p-3 rounded-full ${colors[color]}`}>
                {icon}
            </div>
        </div>
    );
}