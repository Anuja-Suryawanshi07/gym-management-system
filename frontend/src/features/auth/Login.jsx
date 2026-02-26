import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("gym_auth_token", res.data.token);
      localStorage.setItem("gym_user", JSON.stringify(res.data.user));

      const role = res.data.user.role.toLowerCase();
      if (role === "admin") navigate("/dashboard/admin");
      else if (role === "trainer") navigate("/trainer");
      else navigate("/member");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    // flex-1 allows the PublicLayout flex container to center this correctly
    <div className="flex-1 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center mb-2 text-white">
          WELCOME BACK
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Enter your credentials to access your account</p>
        
        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition-all"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default Login;