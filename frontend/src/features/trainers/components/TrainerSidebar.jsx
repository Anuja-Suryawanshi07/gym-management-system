import { NavLink } from "react-router-dom";

export default function TrainerSidebar() {
    return (
        <ul className="space-y-3">
            <li><NavLink to="/dashboard/trainer">Dashboard</NavLink></li>
            <li><NavLink to="/dashboard/trainer/profile">My Profile</NavLink></li>
            <li><NavLink to="/dashboard/trainer/schedule">Schedule</NavLink></li>
        </ul>
    );
}