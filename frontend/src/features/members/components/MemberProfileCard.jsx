export default function MemberProfileCard({ profile }) {
    return (
        <div className="bg-gray-800 p-6 rounded space-y-2">
            <h2 className="text-xl font-bold mb-3">My Profile</h2>

            
                <p><strong>Email : </strong>{profile.email}</p>
                <p><strong>Phone : </strong>{profile.phone || "-"}</p>
                <p><strong>Health Goals : </strong>{profile.health_goals || "-"}</p>
                <p><strong>Trainer : </strong>{profile.trainer_name || "Not Assigned"}</p>
                <p><strong>Plan :</strong> {profile.plan_name || "Not Assigned"}</p>
            
        </div>
    );
}