import { useState } from "react";
import { createTrainer } from "../services/adminApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddTrainer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    specialty: "",
    experience_years: "",
    certification_details: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        experience_years: Number(form.experience_years || 0),
      };

      await createTrainer(payload);

      toast.success("Trainer added successfully");
      navigate("/dashboard/admin/trainers");

      setForm({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        specialty: "",
        experience_years: "",
        certification_details: "",
        status: "active",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add trainer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-gray-800 p-6 rounded">
      <h2 className="text-xl font-bold mb-4">Add Trainer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          value={form.full_name}
          placeholder="Full Name"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          value={form.email}
          placeholder="Email"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          value={form.phone}
          placeholder="Phone"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          value={form.password}
          placeholder="Temporary Password"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="specialty"
          value={form.specialty}
          placeholder="Specialty"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
        />

        <input
          name="experience_years"
          type="number"
          min="0"
          value={form.experience_years}
          placeholder="Experience (years)"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
        />

        <textarea
          name="certification_details"
          value={form.certification_details}
          placeholder="Certifications"
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          className="w-full p-2 bg-gray-700 rounded"
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Trainer"}
        </button>
      </form>
    </div>
  );
}
