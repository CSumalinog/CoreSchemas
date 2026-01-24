import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAs from "./pages/Auth/LoginAs";
import ClientLogin from "./pages/Auth/ClientLogin";
import ClientSignup from "./pages/Auth/ClientSignUp";
import ClientCalendar from "./pages/Client/Calendar";

import StafferLogin from "./pages/Auth/StafferLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAs />} />

        {/* routes for Client*/}
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/client-signup" element={<ClientSignup />} />
        <Route path="/client-calendar" element={<ClientCalendar />} />

        <Route path="/staffer-login" element={<StafferLogin />} />

        {/*  routes for staffers*/}
      </Routes>
    </Router>
  );
}

export default App;
