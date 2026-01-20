import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAs from "./pages/Auth/LoginAs";
import ClientLogin from "./pages/Auth/ClientLogin";
import StafferLogin from "./pages/Auth/StafferLogin";
import ClientSignup from "./pages/Auth/ClientSignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAs />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/staffer-login" element={<StafferLogin />} />
        <Route path="/client-signup" element={<ClientSignup />} />

        {/* future routes for staffers/admin */}
      </Routes>
    </Router>
  );
}

export default App;
