import Sidebar from "../../components/sidebar";

function Members() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 w-full">
                <h1 className="text-2xl font-bold">Members</h1>
            </div>
        </div>
    );
}

export default Members;