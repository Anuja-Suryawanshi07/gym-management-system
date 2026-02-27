export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md hover:shadow-orange-500/10 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClass} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">{title}</p>
          <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{value}</h3>
        </div>
      </div>
    </div>
  );
}