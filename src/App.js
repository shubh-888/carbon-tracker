import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AnimatedBackground from "./components/AnimatedBackground";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import CarbonGlobe from "./pages/CarbonGlobe";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Social from "./pages/Social";
import DailyTasks from "./pages/DailyTasks";
import EcoAssistantPage from "./pages/EcoAssistantPage";

/* Layout Wrapper */

function LayoutWrapper({ children }) {
  return (
    <main className="w-full min-h-screen pt-20 sm:pt-24">
      {children}
    </main>
  );
}


/* App */

function App() {

  return (

    <AuthProvider>

      <Router>

        {/* Global Animated Background */}
        <AnimatedBackground />

        <div className="min-h-screen w-full text-gray-800 dark:text-white overflow-x-hidden">

          <Navbar />

          <Toaster position="top-right" />

          <LayoutWrapper>

            <Routes>

              {/* Public Routes */}

              <Route path="/" element={<Home />} />
              <Route path="/globe" element={<CarbonGlobe />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />


              {/* Protected Routes */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calculator"
                element={
                  <ProtectedRoute>
                    <Calculator />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
path="/eco-ai"
element={
<ProtectedRoute>
<EcoAssistantPage />
</ProtectedRoute>
}
/>

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <Social />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <DailyTasks />
                  </ProtectedRoute>
                }
              />

            </Routes>

          </LayoutWrapper>

        </div>

      </Router>

    </AuthProvider>

  );
}

export default App;