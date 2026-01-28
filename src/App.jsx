import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

/* 🔹 SIDEBARS */
import AdminSidebar from "./components/admin/Sidebar";
import ClientSidebar from "./components/client/Sidebar";
import SectionHeadSidebar from "./components/sectionhead/Sidebar";
import RegularStafferSidebar from "./components/regularstaff/Sidebar"

/* 🔹 AUTH */
import LoginAs from "./pages/Auth/LoginAs";
import ClientLogin from "./pages/Auth/ClientLogin";
import ClientSignup from "./pages/Auth/ClientSignUp";
import StafferLogin from "./pages/Auth/StafferLogin";

/* 🔹 CLIENT PAGES */
import ClientCalendarPage from "./pages/Client/MyCalendar";
import ClientRequest from "./pages/Client/MyRequest";
import ClientSettingsPage from "./pages/Client/Settings";


/* 🔹 ADMIN PAGES */
import AdminDashboard from "./pages/Admin/Dashboard";
import RequestManagement from "./pages/Admin/RequestManagement";
import AssignmentManagement from "./pages/Admin/AssignmentManagement";
import CalendarManagement from "./pages/Admin/CalendarManagement";
import StaffersManagement from "./pages/Admin/StaffersManagement";
import MySchedule from "./pages/Admin/MySchedule";
import Settings from "./pages/Admin/Settings";


/* 🔹 SECTION HEAD PAGES */
import MyTeam from "./pages/SectionHead/MyTeam";
import SectionAssignmentManagement from "./pages/SectionHead/AssignmentManagement";
import MyCoverage from "./pages/SectionHead/MyCoverage";
import MyCalendar from "./pages/SectionHead/MyCalendar";
import SectionSchedule from "./pages/SectionHead/MySchedule";
import SectionHeadSettings from "./pages/SectionHead/Settings";

/* 🔹 SECTION HEAD PAGES */
import StaffCalendar from "./pages/RegularStaff/MyCalendar"
import StaffSchedule from "./pages/RegularStaff/MySchedule"
import StaffCoverage from "./pages/RegularStaff/MyCoverage"
import StaffSettings from "./pages/RegularStaff/Settings"


function LayoutWrapper() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isClient = location.pathname.startsWith("/client");
  const isSection = location.pathname.startsWith("/section");
  const isStaffer = location.pathname.startsWith("/staffer");

  return (
    <div className="flex min-h-screen">

      {isClient && <ClientSidebar />}
      {isAdmin && <AdminSidebar />}
      {isSection && <SectionHeadSidebar />}
      {isStaffer && <RegularStafferSidebar />}

      <main className="flex-1 pt-16 overflow-y-auto">
        <Routes>
          {/* ================= CLIENT ================= */}
          <Route path="/client-calendar" element={<ClientCalendarPage />} />
          <Route path="/client-request" element={<ClientRequest />} />
          <Route path="/client-settings" element={<ClientSettingsPage />} />

          {/* ================= ADMIN ================= */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-request-management" element={<RequestManagement />} />
          <Route path="/admin-assignment-management" element={<AssignmentManagement />} />
          <Route path="/admin-calendar-management" element={<CalendarManagement />} />
          <Route path="/admin-staffers-management" element={<StaffersManagement />} />
          <Route path="/admin-my-schedule" element={<MySchedule />} />
          <Route path="/admin-settings" element={<Settings />} />

          {/* ================= SECTION HEAD ================= */}
          <Route path="/section-my-team" element={<MyTeam />} />
          <Route path="/section-assignment-management" element={<SectionAssignmentManagement />} />
          <Route path="/section-coverage" element={<MyCoverage />} />
          <Route path="/section-calendar" element={<MyCalendar />} />
          <Route path="/section-my-schedule" element={<SectionSchedule />} />
          <Route path="/section-settings" element={<SectionHeadSettings />} />

  {/* ================= SECTION HEAD ================= */}
         <Route path="/staffer-coverage" element={<StaffCoverage />} />
         <Route path="/staffer-schedule" element={<StaffSchedule />} />
         <Route path="/staffer-calendar" element={<StaffCalendar />} />
         <Route path="/staffer-settings" element={<StaffSettings />} />
         
        </Routes>

        


      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/" element={<LoginAs />} />
        <Route path="/client-login" element={<ClientLogin />} />
        <Route path="/client-signup" element={<ClientSignup />} />
        <Route path="/staffer-login" element={<StafferLogin />} />

        {/* ================= APP SHELL ================= */}
        <Route path="/*" element={<LayoutWrapper />} />
      </Routes>
    </Router>
  );
}
