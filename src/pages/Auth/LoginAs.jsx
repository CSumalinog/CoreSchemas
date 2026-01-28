import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginAs() {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  // Only select type, navigation happens on Continue button
  const handleSelect = (type) => {
    setUserType(type);
    setOpen(false);
  };

  const handleContinue = () => {
    if (userType === "client") navigate("/client-login");
    else if (userType === "staffer") navigate("/staffer-login");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden md:flex items-center justify-center bg-neutral-900 text-white">
        <div className="max-w-md text-start px-8">
          <h1 className="text-4xl font-bold mb-4 ">Welcomeback !</h1>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* HEADER */}
          <header className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold text-xl mb-2">
              CS
            </div>
            <h2 className="text-2xl font-semibold text-center">
              Login to CoreSchemas
            </h2>
            <p className="text-center text-gray-500 mt-1">
              Choose how you want to access the system
            </p>
          </header>

          {/* DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-left flex justify-center items-center gap-2 hover:border-blue-500"
            >
              <span>
                {userType
                  ? userType === "client"
                    ? "Client"
                    : "Staffer"
                  : "Login As..."}
              </span>
              <span className="text-gray-400">▾</span>
            </button>

            {open && (
              <div className="absolute z-10 mt-2 w-full rounded-lg border border-neutral-100 bg-white shadow">
                <button
                  onClick={() => handleSelect("client")}
                  className="w-full px-4 py-2 text-center hover:bg-gray-100"
                >
                  Client
                </button>
                <button
                  onClick={() => handleSelect("staffer")}
                  className="w-full px-4 py-2 text-center hover:bg-gray-100"
                >
                  Staffer
                </button>
              </div>
            )}
          </div>

          {/* CONTINUE BUTTON */}
          <button
            disabled={!userType}
            onClick={handleContinue}
            className="mt-6 w-full rounded-lg bg-yellow-300 py-2 text-white font-semibold hover:bg-neutral-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginAs;
