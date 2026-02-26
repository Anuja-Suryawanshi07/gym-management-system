// src/layouts/PublicLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      {/* We use flex-1 so the content takes up all available space.
         We only add padding if it's NOT the landing page.
      */}
      <main className={`flex-1 flex flex-col ${!isLanding ? "pt-20" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}