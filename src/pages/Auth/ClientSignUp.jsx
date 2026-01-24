import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function ClientSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    classification: "",
    segment: "",
  });

  const [segmentOptions, setSegmentOptions] = useState([]);
  const [customSegment, setCustomSegment] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const classifications = ["Office", "Department", "Organization"];
  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // ---------------------
  // Validation Functions
  // ---------------------
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

  // ---------------------
  // Fetch segment options from Supabase tables
  // ---------------------
  const fetchSegments = async (classification) => {
    let table = "";
    if (classification === "Organization") table = "organizations";
    else if (classification === "Departments") table = "departments";
    else if (classification === "Office") table = "offices";

    if (!table) return setSegmentOptions([]);

    const { data, error } = await supabase.from(table).select("id, name");
    if (error) {
      console.error(error);
      setSegmentOptions([{ id: null, name: "Others" }]);
    } else {
      // Sort alphabetically by name
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

      setSegmentOptions([
        ...sortedData.map((d) => ({ id: d.id, name: d.name })),
        { id: null, name: "Others" },
      ]);
    }
  };

  useEffect(() => {
    if (form.classification) fetchSegments(form.classification);
  }, [form.classification]);

  // ---------------------
  // Handlers
  // ---------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") setPasswordError(validatePassword(value));
    if (name === "email") setEmailError(validateEmail(value));
    if (name === "classification") {
      setCustomSegment("");
      setForm((prev) => ({ ...prev, segment: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email & password
    const emailValidation = validateEmail(form.email);
    const passwordValidation = validatePassword(form.password);
    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      return;
    }

    let finalSegmentId = null;

    // ---------------------
    // Handle "Others"
    // ---------------------
    if (form.segment === "Others" && customSegment) {
      let table = "";
      if (form.classification === "Organization") table = "organizations";
      else if (form.classification === "Department") table = "departments";
      else if (form.classification === "Office") table = "offices";

      const { data, error } = await supabase
        .from(table)
        .insert([{ name: customSegment }])
        .select("id");
      if (error) {
        console.error("Insert new segment error:", error);
        alert("Failed to add new segment: " + error.message);
        return;
      }
      finalSegmentId = data[0].id;
    } else {
      // Get ID of selected segment
      const selected = segmentOptions.find((s) => s.name === form.segment);
      finalSegmentId = selected ? selected.id : null;
    }

    // ---------------------
    // 1️⃣ Sign up with Supabase Auth
    // ---------------------
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      console.error("Auth sign up error:", authError.message);
      alert("Sign Up failed: " + authError.message);
      return;
    }

    // ---------------------
    // 2️⃣ Insert profile linked to auth user
    // ---------------------
    const { data, error } = await supabase.from("profiles").insert([
      {
        id: authData.user.id, // link to Supabase auth user
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        classification: form.classification,
        organization_id:
          form.classification === "Organization" ? finalSegmentId : null,
        department_id:
          form.classification === "Department" ? finalSegmentId : null,
        office_id: form.classification === "Office" ? finalSegmentId : null,
        role: "client",
      },
    ]);

    if (error) {
      console.error("Profile insert error:", error.message);
      alert("Sign Up failed: " + error.message);
      return;
    }

    alert("Sign Up successful!");
    navigate("/client-calendar"); // Redirect after signup
  };

  // ---------------------
  // Render
  // ---------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Client Sign Up
        </h2>

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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            required
          />
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <select
            name="classification"
            value={form.classification}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Classification</option>
            {classifications.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}{" "}
                {/* Capitalize for display */}
              </option>
            ))}
          </select>

          <select
            name="segment"
            value={form.segment}
            onChange={handleChange}
            disabled={!form.classification}
            className={`${inputClass} disabled:bg-gray-100`}
            required
          >
            <option value="">
              {form.classification ? `Select ${form.classification}` : "Select"}
            </option>
            {segmentOptions.map((s) => (
              <option key={s.id || s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          {form.segment === "Others" && (
            <input
              type="text"
              placeholder={`Enter ${form.classification} name`}
              value={customSegment}
              onChange={(e) => setCustomSegment(e.target.value)}
              className={inputClass}
              required
            />
          )}

          <button
            type="submit"
            disabled={
              !form.firstName ||
              !form.lastName ||
              !form.email ||
              !form.password ||
              passwordError ||
              emailError ||
              !form.classification ||
              !form.segment ||
              (form.segment === "Others" && !customSegment)
            }
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Sign Up
          </button>

          {/* LOGIN LINK */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/client-login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ClientSignup;
