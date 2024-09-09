import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/base.css";
import axiosInstance from "../../utils/axiosConfig";

interface PaymentDetails {
  amount: string;
  currency: string;
  reference: string;
}

const PaymentSuccess: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const params = new URLSearchParams(location.search);
      const reference = params.get("reference");
      const provider = params.get("provider") || "stripe";

      if (reference) {
        try {
          const response = await axiosInstance.get(
            `/api/payments/verify/?reference=${reference}&provider=${provider}`
          );
          if (response.data.status === "success") {
            setPaymentDetails(response.data.details);
          } else {
            setError(
              response.data.message || "Failed to fetch payment details"
            );
          }
        } catch (error) {
          console.error("Error fetching payment details:", error);
          setError("An error occurred while fetching payment details");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("No payment reference found");
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [location, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Verifying payment...</h2>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-100 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl text-red-600 mb-4">
            Payment Verification Failed
          </h2>
          <p className="text-l mb-6 text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/upgrade")}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-100 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h2 className="text-xl text-green-600 mb-4">Payment Successful!</h2>
        <div className="mb-6">
          <p className="text-xl text-gray-700">
            Amount: {paymentDetails.amount}{" "}
            {paymentDetails.currency.toUpperCase()}
          </p>
          <p className="text-gray-600">Reference: {paymentDetails.reference}</p>
        </div>
        <button
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => navigate("/")}
        >
          Return to HomePage
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
