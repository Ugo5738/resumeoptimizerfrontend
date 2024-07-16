import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackgroundDesign from "../components/layout/BackgroundDesign";
import axiosInstance from '../utils/axiosConfig';


const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axiosInstance.get(`/api/auth/verify-email/${token}/`);
        setVerificationStatus('success');
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  // Prevent additional requests after successful verification
  useEffect(() => {
    if (verificationStatus === 'success') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect to login after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [verificationStatus, navigate]);

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <BackgroundDesign />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-xl z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Email Verification</h2>
        {verificationStatus === 'verifying' && <p>Verifying your email...</p>}
        {verificationStatus === 'success' && (
          <p className="text-center mb-4">Your email has been successfully verified! Redirecting to login...</p>
        )}
        {verificationStatus === 'error' && <p>There was an error verifying your email. Please try again or contact support.</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
