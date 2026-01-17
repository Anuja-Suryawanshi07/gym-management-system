import { NavLink } from "react-router-dom";

export default function MemberSidebar() {
    return (
        <ul className="space-y-3">
            <li><NavLink to="/dashboard/member">Dashboard</NavLink></li>
            <li><NavLink to="/dashboard/member/workouts">Workouts</NavLink></li>
            <li><NavLink to="/dashboard/member/profile">Profile</NavLink></li>
        </ul>
    );
}