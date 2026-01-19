import { Outlet } from "react-router-dom";
import MemberSidebar from "../components/MemberSidebar";

export default function MemberLayout() {
    return (
        <div className="flex">
            <MemberSidebar />
            <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}