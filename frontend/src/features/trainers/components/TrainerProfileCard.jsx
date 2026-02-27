import { User, Mail, Shield } from "lucide-react";

export default function TrainerProfileCard() {
    const user = JSON.parse(localStorage.getItem("gym_user"));

    return (
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden">
            
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 opacity-10 blur-3xl rounded-full"></div>
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="text-orange-500" size={24} />
                Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-700 rounded-lg text-gray-300"><User size={18}/></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Full Name</p>
                            <p className="text-white font-medium">{user.full_name}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-700 rounded-lg text-gray-300"><Mail size={18}/></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                            <p className="text-white font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-700 rounded-lg text-gray-300"><Shield size={18}/></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Access Level</p>
                        <span className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded text-sm font-bold uppercase tracking-tighter">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}