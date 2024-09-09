import { CheckCircle, Home, Loader, RefreshCw, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackgroundDesign from "../../components/layout/BackgroundDesign";
import Navbar from "../../components/layout/Navbar";
import axiosInstance from "../../utils/axiosConfig";

interface PaymentDetails {
  amount: string;
  currency: string;
  reference: string;
}

const PaymentVerification: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference");
    const provider = params.get("provider") || "paystack";

    if (reference) {
      const verifyAndFetchDetails = async () => {
        try {
          // First, verify the payment
          const verifyResponse = await axiosInstance.get(
            `/api/payments/verify/?reference=${reference}&provider=${provider}`
          );

          if (verifyResponse.data.status === "success") {
            // If verification is successful, fetch payment details
            const detailsResponse = await axiosInstance.get(
              `/api/payments/details/${reference}/`
            );

            if (detailsResponse.data.status === "success") {
              setPaymentDetails(detailsResponse.data);
            } else {
              setError(
                detailsResponse.data.message ||
                  "Failed to fetch payment details"
              );
            }
          } else {
            setError(
              verifyResponse.data.message || "Payment verification failed"
            );
          }
        } catch (error) {
          console.error("Error during payment verification:", error);
          setError("An error occurred during payment verification");
        } finally {
          setIsLoading(false);
        }
      };

      verifyAndFetchDetails();
    } else {
      setError("No payment reference found");
      setIsLoading(false);
    }
  }, [location, navigate]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Loader className="h-16 w-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            Verifying Payment...
          </h2>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <XCircle className="h-9 w-9 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl text-red-600 mb-4">Payment Failed</h2>
          <p className="text-xl mb-6 text-gray-600">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/upgrade")}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <RefreshCw className="mr-2" /> Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <Home className="mr-2" /> Return to Home
            </button>
          </div>
        </div>
      );
    }

    if (!paymentDetails) {
      return null;
    }

    return (
      <div className="text-center">
        <CheckCircle className="h-9 w-9 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl text-green-600 mb-4">Payment Successful!</h2>
        <div className="mb-6">
          <p className="text-xl text-gray-800">
            Amount: {paymentDetails.amount} {paymentDetails.currency}
          </p>
          <p className="text-sm text-gray-600">
            Reference: {paymentDetails.reference}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          <Home className="mr-2" /> Return to Home
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center overflow-hidden">
      <BackgroundDesign />
      <Navbar />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-xl z-10">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentVerification;
