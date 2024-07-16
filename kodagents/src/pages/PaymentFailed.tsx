import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.message || "We're sorry, but your payment could not be processed.";

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h2>
        <p className="text-xl mb-6">{errorMessage}</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/payment')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
