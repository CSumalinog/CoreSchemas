import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import LoginIcon from "@mui/icons-material/Login";

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/client-calendar"); // redirect after login
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE (branding/illustration) */}
      <div className="hidden md:flex items-center justify-center bg-neutral-900 text-white">
        {/* Optional illustration or text */}
      </div>

      {/* RIGHT SIDE (Login Card) */}
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-2 gap-4">
            <div className="h-12 w-12 overflow-hidden flex items-center justify-center">
              <img
                src="/tgp.png" // replace with your actual logo path
                alt="Company Logo"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Company Name */}
            <h1 className="text-2xl font-semibold text-gray-900">
              THE GOLD PANICLES
            </h1>
          </div>

          <header className="flex items-center justify-center gap-2 mb-2">
            <LoginIcon className="text-gray-700" />
            <h2 className="text-2xl font-semibold text-gray-700">Login</h2>
          </header>

          <hr className="border-neutral-400 mb-8" />

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={!email || !password}
              className="w-full rounded-lg bg-yellow-300 py-2 text-white font-semibold hover:bg-neutral-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Login
            </button>
          </form>

          {/* SIGN UP LINK */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link to="/client-signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
