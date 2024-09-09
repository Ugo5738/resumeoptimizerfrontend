import React, { FormEvent, useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/contexts/AuthContext";
import BackgroundDesign from "../../components/layout/BackgroundDesign";
import axiosInstance, { isAxiosError } from "../../utils/axiosConfig";

const PaymentForm: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await axiosInstance.get("/api/csrf-cookie/");
        // console.log('CSRF token fetched successfully');
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCSRFToken();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // console.log('PaymentForm: Attempting to submit payment');

    try {
      const response = await axiosInstance.post(
        "/api/payments/initiate/",
        JSON.stringify({
          amount: "9.99",
          currency: "NGN", // 'USD',
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log('PaymentForm: Payment initiation response:', response.data);

      if (response.data.authorization_url) {
        // console.log('PaymentForm: Redirecting to payment gateway');
        window.location.href = response.data.authorization_url;
      } else {
        setError("Failed to initialize payment. Please try again.");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 403) {
          setError(
            "CSRF verification failed. Please refresh the page and try again."
          );
        } else {
          setError(
            err.response?.data?.error || "An error occurred. Please try again."
          );
        }
      } else {
        console.error("PaymentForm: Error during payment initiation:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/login", { state: { from: location } });
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BackgroundDesign />
      <main className="fixed inset-0 flex justify-center items-center overflow-hidden">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Upgrade to Premium
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Get unlimited access to all features
            </p>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="text-center text-2xl font-bold text-indigo-600">
              $9.99 / month
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaLock
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              By upgrading, you agree to our{" "}
              <a
                href="/terms"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentForm;
