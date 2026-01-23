import { Outlet } from "react-router-dom";

export default function TrainerLayout() {
  return (
    <div className="flex">
      <TrainerSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
