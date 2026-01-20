import { useState } from "react";
import { Link } from "react-router-dom";

function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE (branding/illustration) */}
      <div className="hidden md:flex items-center justify-center bg-gray-900 text-white"></div>

      {/* RIGHT SIDE (Login Card) */}
      <div className="flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* HEADER */}
          <header className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mb-2">
              CS
            </div>
            <h2 className="text-2xl font-semibold text-center">Client Login</h2>
            <p className="text-center text-gray-500 mt-1">
              Enter your credentials to access the system
            </p>
          </header>

          {/* LOGIN FORM */}
          <form className="space-y-4">
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
              />
            </div>

            <button
              type="submit"
              disabled={!email || !password}
              className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
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

export default ClientLogin;
