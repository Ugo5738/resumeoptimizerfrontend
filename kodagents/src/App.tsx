import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import ResumeForm from "./pages/Agents/ResumeBuilder/ResumeForm";
import ResumePreview from "./pages/Agents/ResumeBuilder/ResumePreview";
import TemplateSelection from "./pages/Agents/ResumeBuilder/TemplateSelection";
import HomePage from "./pages/HomePage";
// import ResumeTemplate1 from "./pages/Agents/ResumeBuilder/ResumeTemplate1";

import About from "./pages/About";
import EmailVerification from "./pages/EmailVerification";
import HowToUse from "./pages/HowToUse";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import PaymentFailed from "./pages/PaymentFailedSub";
import PaymentForm from "./pages/PaymentForm";
import PaymentSuccess from "./pages/PaymentSuccessSub";
import PaymentVerification from './pages/PaymentVerification';
import Pricing from "./pages/Pricing";
import Result from "./pages/Result";
import Signup from "./pages/SignUp";
import Terms from "./pages/Terms";
import Upgrade from "./pages/UpgradeSub";
import UploadResume from "./pages/UploadResume";
import VerifyEmail from "./pages/Verify";

import { AuthProvider } from '../src/components/common/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { initGA, trackPageView } from './utils/analytics';


function App() {
  useEffect(() => {
    // Initialize Google Analytics
    initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      onScriptLoadError={() => console.log('Failed to load Google Sign-In script')}
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

        <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
        <Route path="/job-details" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentForm /></ProtectedRoute> } />
        <Route path="/payment/verify" element={<ProtectedRoute><PaymentVerification /></ProtectedRoute> } />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />

        <Route path="/selection" element={<ProtectedRoute><TemplateSelection /></ProtectedRoute>} />
        <Route path="/resume-form" element={<ProtectedRoute><ResumeForm /></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><ResumeForm /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
