import { useState } from "react";
import { supabase } from "../../lib/supabase.js";

function StafferLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Query the staffers table
    const { data, error } = await supabase
      .from("staffers")
      .select("*")
      .eq("email", email)
      .eq("password", password); // plain text match for now

    setLoading(false);

    if (error || !data || data.length === 0) {
      alert("Invalid credentials");
      return;
    }

    const user = data[0];

    // Redirect based on role
    switch (user.role) {
      case "Administrator":
        window.location.href = "/admin-dashboard";
        break;
      case "Section Head":
        window.location.href = "/section-my-team"; // first section head page
        break;
      case "Regular Staff":
        window.location.href = "/staffer-coverage"; // first regular staff page
        break;
      default:
        alert("Unknown role");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-neutral-900 text-white" />
      <div className="flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <header className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mb-2">
              CS
            </div>
            <h2 className="text-2xl font-semibold text-center">Staff Login</h2>
            <p className="text-center text-gray-500 mt-1">
              Enter your credentials to access the system
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!email || !password || loading}
              className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StafferLogin;
