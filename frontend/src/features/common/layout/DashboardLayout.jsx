import Sidebar from "../../../components/common/Sidebar";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-900 to-black">
        <header className="mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-orange-500">{title}</h1>
          <p className="text-gray-400 font-medium">Welcome back to your fitness hub.</p>
        </header>
        {children}
      </main>
    </div>
  );
}