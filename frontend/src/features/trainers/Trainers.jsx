import Sidebar from "../../components/sidebar";

function Trainers() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 p-6 w-full">
                <h1 className="text-2xl font-bold">Trainers</h1>
            </div>
        </div>
    );
}

export default Trainers;