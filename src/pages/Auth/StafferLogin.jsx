import { useState } from "react";
import { supabase } from "../../lib/supabase.js";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function StafferLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Auth login using Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    setLoading(false);

    if (error) {
      alert("Invalid credentials");
      return;
    }

    // ✅ Grab role from user metadata
    const role = data.user.user_metadata?.role;

    switch (role) {
      case "Administrator":
        window.location.href = "/admin-dashboard";
        break;
      case "Section Head":
        window.location.href = "/section-my-team";
        break;
      case "Regular Staff":
        window.location.href = "/staffer-coverage";
        break;
      default:
        alert("No role assigned to this account");
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
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Password with eye toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            {/* Submit */}
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
