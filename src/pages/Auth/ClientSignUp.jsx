import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function ClientSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // --------------------- Validation ---------------------
  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password)
      ? ""
      : "Password must be at least 8 characters and contain a special character.";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!email.endsWith("@gmail.com")) return "Please use a Gmail address.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordError(validatePassword(value));
    if (name === "email") setEmailError(validateEmail(value));
  };

  // --------------------- Handle Submit ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const emailValidation = validateEmail(form.email);
    const passwordValidation = validatePassword(form.password);
    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      return;
    }

    // 1️⃣ Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      return alert("Sign Up failed: " + authError.message);
    }

    // 2️⃣ Insert profile
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        role: "client",
      },
    ]);

    if (profileError) {
      return alert("Failed to create profile: " + profileError.message);
    }

    // ✅ Success
    alert("Sign Up successful!");
    navigate("/client-calendar");
  };

  // --------------------- Render ---------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Client Sign Up
        </h2>
        <hr className="border-neutral-400" />
        <br />
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <input
            name="email"
            placeholder="Email (Gmail only)"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}

          {/* Password with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
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
          
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={
              !form.firstName ||
              !form.lastName ||
              !form.email ||
              !form.password ||
              passwordError ||
              emailError
            }
            className="w-full rounded-lg bg-neutral-900 py-2 text-white font-semibold hover:bg-yellow-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Sign Up
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/client-login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ClientSignup;
