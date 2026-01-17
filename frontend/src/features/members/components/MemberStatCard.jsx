export default function MemberStatCard({ title, value }) {
    return (
        <div className="bg-gray-800 p-4 rounded shadow">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-xl font-bold mt-1">{value}</p> 
        </div>
    );
}