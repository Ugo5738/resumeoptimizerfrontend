import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import axiosInstance, { isAxiosError } from '../utils/axiosConfig';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/api/auth/resend-verification/', {
        email: localStorage.getItem('userEmail')
      });
      setMessage(response.data.message);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'Failed to resend verification email');
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <BackgroundDesign />
      <Navbar />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-xl z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Verify Your Email</h2>
        <p className="text-center mb-4">
          We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
        </p>
        {message && (
          <p className="text-center mb-4 text-sm font-medium text-indigo-600">{message}</p>
        )}
        <button
          onClick={handleResendVerification}
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
        >
          {isLoading ? 'Sending...' : 'Resend Verification Email'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already verified?{" "}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
