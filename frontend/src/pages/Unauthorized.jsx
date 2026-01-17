export default function Unauthorized() {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">403 - Unauthorized</h1>
                <p>You do not have access to this page.</p>
            </div>
        </div>
    );
}