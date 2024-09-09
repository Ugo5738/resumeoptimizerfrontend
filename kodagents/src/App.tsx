import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import About from "./pages/About";
import ResumeForm from "./pages/Agents/ResumeBuilder/ResumeForm";
import ResumePreview from "./pages/Agents/ResumeBuilder/ResumePreview";
import TemplateSelection from "./pages/Agents/ResumeBuilder/TemplateSelection";
import EmailVerification from "./pages/EmailVerification";
import HomePage from "./pages/HomePage";
import HowToUse from "./pages/HowToUse";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import MaintenancePage from "./pages/MaintenancePage";
import PaymentFailed from "./pages/Payment/PaymentFailedSub";
import PaymentForm from "./pages/Payment/PaymentForm";
import PaymentSuccess from "./pages/Payment/PaymentSuccessSub";
import PaymentVerification from "./pages/Payment/PaymentVerification";
import Pricing from "./pages/Payment/Pricing";
import Upgrade from "./pages/Payment/UpgradeSub";
import Result from "./pages/Result/Result";
import Signup from "./pages/SignUp";
import Terms from "./pages/Terms";
import UploadResume from "./pages/UploadResume";
import VerifyEmail from "./pages/Verify";

import { AuthProvider } from "./components/contexts/AuthContext";
import ProtectedRoute from "./components/contexts/ProtectedRoute";
import Account from "./pages/Dashboard/Accounts";
import Billing from "./pages/Dashboard/Billing";
import Dashboard from "./pages/Dashboard/Dashboard";
import { initGA, trackPageView } from "./utils/analytics";

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      onScriptLoadError={() =>
        console.log("Failed to load Google Sign-In script")
      }
    >
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

// Separate component to use the useLocation hook
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  // Add a constant to easily toggle maintenance mode
  const isMaintenanceMode = false;

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/dashboard/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-details"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/verify"
          element={
            <ProtectedRoute>
              <PaymentVerification />
            </ProtectedRoute>
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <Upgrade />
            </ProtectedRoute>
          }
        />

        <Route
          path="/selection"
          element={
            <ProtectedRoute>
              <TemplateSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-form"
          element={
            <ProtectedRoute>
              <ResumeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <ResumeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview"
          element={
            <ProtectedRoute>
              <ResumePreview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
