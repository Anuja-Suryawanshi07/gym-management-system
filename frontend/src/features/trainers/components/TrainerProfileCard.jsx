export default function TrainerProfileCard() {
    const user = JSON.parse(localStorage.getItem("gym_user"));

    return (
        <div className="bg-gray-600 p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">My Profile</h2>

            <p><strong>Name : </strong>{user.full_name}</p>
            <p><strong>Email : </strong>{user.email}</p>
            <p><strong>Role : </strong>{user.role}</p>
        </div>
    );
}