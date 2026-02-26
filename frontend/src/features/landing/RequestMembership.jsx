import { useState } from "react";
import api from "../../services/api";

function RequestMembership() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        goal: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/public/membership-requests", {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                message: formData.goal,
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="bg-gray-900 border border-gray-800 p-10 rounded-2xl text-center max-w-sm">
                    <div className="w-16 h-16 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-white">Request Sent!</h2>
                    <p className="text-gray-400">
                        Our team will review your goals and contact you shortly to finalize your membership.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white">JOIN THE CLUB</h2>
                    <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Start your transformation today</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Full Name</label>
                        <input 
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email</label>
                        <input 
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white outline-none"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Phone Number</label>
                    <input 
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">What is your Fitness Goal?</label>
                    <textarea
                        name="goal"
                        rows="3"
                        value={formData.goal}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500 text-white outline-none resize-none"
                        placeholder="e.g. Muscle gain, Weight loss..."
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-yellow-900/10"
                >
                    {loading ? "Processing..." : "Submit Application"}
                </button>
            </form>
        </div>
    );
}

export default RequestMembership;