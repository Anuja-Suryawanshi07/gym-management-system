import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      {/* Header */}
      <main className="flex-1 bg-gray-900 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

