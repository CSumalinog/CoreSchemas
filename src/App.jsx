import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ClientSidebar from "./components/client/Sidebar";
import LoginAs from "./pages/Auth/LoginAs";
import ClientLogin from "./pages/Auth/ClientLogin";
import ClientSignup from "./pages/Auth/ClientSignUp";
import ClientRequest from "./pages/Client/Request";
import StafferLogin from "./pages/Auth/StafferLogin";
import ClientSettingsPage from "./pages/Client/Settings";
import ClientCalendarPage from "./pages/Client/Calendar";
import { Outlet } from "react-router-dom";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Auth Routes - no sidebar */}
          <Route path="/" element={<LoginAs />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-signup" element={<ClientSignup />} />

          {/* Client Routes - with persistent sidebar */}
          <Route
            path="/*"
            element={
              <div className="flex min-h-screen">
                <ClientSidebar />
                <main className="flex-1 pt-15 overflow-y-auto">
                  <Outlet />
                  <Routes>
                    <Route
                      path="/client-calendar"
                      element={<ClientCalendarPage />}
                    />
                    <Route path="/client-request" element={<ClientRequest />} />
                    <Route
                      path="/client-settings"
                      element={<ClientSettingsPage />}
                    />
                  </Routes>
                </main>
              </div>
            }
          />

          <Route path="/staffer-login" element={<StafferLogin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
