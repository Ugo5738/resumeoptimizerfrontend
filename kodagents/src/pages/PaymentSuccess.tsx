import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

interface PaymentDetails {
  amount: string;
  currency: string;
  reference: string;
}

const PaymentSuccess: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const params = new URLSearchParams(location.search);
      const reference = params.get('reference');

      if (reference) {
        try {
          const response = await axiosInstance.get(`/api/payments/details/${reference}/`);
          if (response.data.status === 'success') {
            setPaymentDetails(response.data);
          } else {
            setError(response.data.message || 'Failed to fetch payment details');
          }
        } catch (error) {
          console.error('Error fetching payment details:', error);
          setError('An error occurred while fetching payment details');
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('No payment reference found');
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [location, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading payment details...</h2>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <div className="mb-4">
          <p className="text-xl">Amount: {paymentDetails.amount} {paymentDetails.currency}</p>
          <p className="text-gray-600">Reference: {paymentDetails.reference}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
