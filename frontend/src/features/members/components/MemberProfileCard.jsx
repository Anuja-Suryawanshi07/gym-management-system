export default function MemberProfileCard({ user }) {
    return (
        <div className="bg-gray-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>

            <div className="space-y-2 text-gray-300">
                <p><strong>Name : </strong>{user?.full_name}</p>
                <p><strong>Email : </strong>{user?.email}</p>
                <p><strong>Phone : </strong>{user?.phone}</p>
                <p><strong>Role : </strong>{user?.role}</p>
            </div>
        </div>
    );
}