import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AdminSidebar from "./components/admin/Sidebar";
import ClientSidebar from "./components/client/Sidebar";

import LoginAs from "./pages/Auth/LoginAs";
import ClientLogin from "./pages/Auth/ClientLogin";
import ClientSignup from "./pages/Auth/ClientSignUp";
import StafferLogin from "./pages/Auth/StafferLogin";

import AdminDashboard from "./pages/Admin/Dashboard";
import RequestManagement from "./pages/Admin/RequestManagement";
import AssignmentManagement from "./pages/Admin/AssignmentManagement";
import CalendarManagement from "./pages/Admin/CalendarManagement";
import StaffersManagement from "./pages/Admin/StaffersManagement";
import MySchedule from "./pages/Admin/MySchedule";
import Settings from "./pages/Admin/Settings";

import ClientCalendarPage from "./pages/Client/Calendar";
import ClientRequest from "./pages/Client/Request";
import ClientSettingsPage from "./pages/Client/Settings";

function LayoutWrapper() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isClient = location.pathname.startsWith("/client");

  return (
    <div className="flex min-h-screen">
      {isAdmin && <AdminSidebar />}
      {isClient && <ClientSidebar />}

      <main className="flex-1 pt-16 overflow-y-auto">
        <Routes>
          {/* ADMIN */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-request-management" element={<RequestManagement />} />
          <Route path="/admin-assignment-management" element={<AssignmentManagement />} />
          <Route path="/admin-calendar-management" element={<CalendarManagement />} />
          <Route path="/admin-staffers-management" element={<StaffersManagement />} />
          <Route path="/admin-my-schedule" element={<MySchedule />} />
          <Route path="/admin-settings" element={<Settings />} />

          {/* CLIENT */}
          <Route path="/client-calendar" element={<ClientCalendarPage />} />
          <Route path="/client-request" element={<ClientRequest />} />
          <Route path="/client-settings" element={<ClientSettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<LoginAs />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/client-signup" element={<ClientSignup />} />
        <Route path="/staffer-login" element={<StafferLogin />} />

        {/* APP SHELL */}
        <Route path="/*" element={<LayoutWrapper />} />
      </Routes>
    </Router>
  );
}
