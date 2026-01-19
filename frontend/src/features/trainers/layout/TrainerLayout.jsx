import { Outlet } from "react-router-dom";
import TrainerSidebar from "../components/TrainerSidebar";

export default function TrainerLayout() {
    return (
        <div className="flex">
            <TrainerSidebar />
            <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}