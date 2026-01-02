import { useState } from "react";

function RequestMembership() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        goal: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Membership Request:", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-2">Request Submitted </h2>
                    <p className="text-gray-600">
                        Our team will contact you soon regarding your membership.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg w-full max-w-md"
            >
            <h2 className="text-2xl font-bold text-center mb-6">
            Request Gym Membership    
            </h2>    

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />    
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />    
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input 
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />    
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Fitness Goal</label>
                <textarea
                    name="goal"
                    rows="3"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Weight loss, muscle gain, general fitness..."
                />    
            </div>

            <button
                type="submit"
                className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-600"
            >
                Submit Request
            </button>

            </form>    
        </div>
    );
}   

export default RequestMembership;
