export default function TrainerStatCard({ title, value }) {
    return (
        <div className="bg-gray-600 p-4 rounded shadow">
            <h3 className="text-gray-300 text-sm">{title}</h3>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}