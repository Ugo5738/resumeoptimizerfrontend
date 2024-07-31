import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/base.css';

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.message || "We're sorry, but your payment could not be processed.";

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-100 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h2 className="text-xl text-red-600 mb-4">Payment Failed</h2>
        <p className="text-l mb-6 text-gray-700">{errorMessage}</p>
        <div className="space-y-4">
          <button
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => navigate('/')}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="theme-button-view w-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
