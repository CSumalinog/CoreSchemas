import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // Classification options
  const classifications = ["Departments", "Office", "Organization"];

  // Segment options by classification
  const segmentsData = {
    Departments: [
      "HR",
      "Finance",
      "IT",
      "Marketing",
      "Sales",
      "Operations",
      "Legal",
      "R&D",
      "Admin",
      "Support",
    ],
    Office: [
      "Manila",
      "Cebu",
      "Davao",
      "Baguio",
      "Iloilo",
      "Cagayan",
      "Zamboanga",
      "Laguna",
      "Quezon",
      "Pampanga",
    ],
    Organization: [
      "Org A",
      "Org B",
      "Org C",
      "Org D",
      "Org E",
      "Org F",
      "Org G",
      "Org H",
      "Org I",
      "Org J",
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Update segment options when classification changes
    if (name === "classification") {
      setSegmentOptions(segmentsData[value]);
      setForm((prev) => ({ ...prev, segment: "" })); // reset segment
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert("Sign Up successful (mock)!");
    navigate("/client-login"); // Redirect to login after signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* HEADER */}
        <header className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mb-2">
            CS
          </div>
          <h2 className="text-2xl font-semibold text-center">Client Sign Up</h2>
          <p className="text-center text-gray-500 mt-1">
            Create your account to access CoreSchemas
          </p>
        </header>

        {/* SIGNUP FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-1/2  rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-1/2  rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Classification */}
          <div>
            <select
              name="classification"
              value={form.classification}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Classification</option>
              {classifications.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Segment */}
          <div>
            <select
              name="segment"
              value={form.segment}
              onChange={handleChange}
              disabled={!form.classification}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Segment</option>
              {segmentOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={
              !form.firstName ||
              !form.lastName ||
              !form.email ||
              !form.password ||
              !form.classification ||
              !form.segment
            }
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Sign Up
          </button>
        </form>

        {/* Back to Login */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/client-login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default ClientSignup;
