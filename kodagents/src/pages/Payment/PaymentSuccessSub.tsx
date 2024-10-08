import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/base.css";
import axiosInstance from "../../utils/axiosConfig";

interface PaymentDetails {
  amount?: string;
  currency?: string;
  reference?: string;
  subscription_id?: string;
  status?: string;
  next_billing_date?: string;
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
      const subscription_id = params.get("subscription_id");
      const provider = params.get("provider") || "stripe";

      if (reference || subscription_id) {
        try {
          let url = `/api/payments/verify/?provider=${provider}`;
          if (reference) {
            url += `&reference=${reference}`;
          }
          if (subscription_id) {
            url += `&subscription_id=${subscription_id}`;
          }

          const response = await axiosInstance.get(url);
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
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {paymentDetails.subscription_id ? (
            <>
              <p className="mb-2">
                Your subscription has been activated successfully.
              </p>
              <p className="mb-2">
                Subscription ID: {paymentDetails.subscription_id}
              </p>
              {/* <p className="mb-2">Status: {paymentDetails.status}</p>
              {paymentDetails.next_billing_date && (
                <p className="mb-2">Next billing date: {new Date(paymentDetails.next_billing_date).toLocaleDateString()}</p>
              )} */}
            </>
          ) : (
            <>
              <p className="mb-2">
                Amount: {paymentDetails.amount}{" "}
                {paymentDetails.currency?.toUpperCase()}
              </p>
              <p className="mb-2">Reference: {paymentDetails.reference}</p>
            </>
          )}
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
