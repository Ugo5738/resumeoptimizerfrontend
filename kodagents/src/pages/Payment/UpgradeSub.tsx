import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { FaCheck, FaInfoCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/contexts/AuthContext";
import BackgroundDesign from "../../components/layout/BackgroundDesign";
import CheckoutForm from "../../components/layout/CheckoutForm";
import Navbar from "../../components/layout/Navbar";
import axiosInstance from "../../utils/axiosConfig";

interface SubscriptionPlan {
  name: string;
  price: number;
  interval: "monthly" | "quarterly" | "lifetime";
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const UpgradeAndPayment: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );

  useEffect(() => {
    if (
      location.state &&
      (location.state as { selectedPlan: SubscriptionPlan }).selectedPlan
    ) {
      setSelectedPlan(
        (location.state as { selectedPlan: SubscriptionPlan }).selectedPlan
      );
    } else {
      // If no plan is selected, redirect back to billing details
      navigate("/dashboard/billing");
    }
  }, [location, navigate]);

  const renderPricingBreakdown = () => {
    if (!selectedPlan) return null;

    const subscriptionPrice = selectedPlan.price;
    const taxRate = 0.0;
    const totalAmount = subscriptionPrice + taxRate;

    return (
      <div className="mb-10 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Pricing Breakdown</h3>
        <div className="flex justify-between mb-2">
          <span>{selectedPlan.name} Plan Subscription</span>
          <span>${subscriptionPrice.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-500 mb-2">
          Billed{" "}
          {selectedPlan.interval === "lifetime"
            ? "once"
            : selectedPlan.interval}
        </div>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${subscriptionPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="flex items-center">
            Tax <FaInfoCircle className="ml-1 text-gray-400" />
          </span>
          <span>${taxRate.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
          <span>Total due today</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await axiosInstance.get("/api/csrf-cookie/");
        // console.log('CSRF token fetched successfully');
      } catch (error) {
        // console.error('Error fetching CSRF token:', error);
        setError("Failed to initialize payment. Please try again.");
      }
    };

    fetchCSRFToken();

    // Fetch user's email and location
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/current-user");
        const { email, country, region } = response.data;
        setUserEmail(email);
        setSelectedCountry(country || ""); // Ensure it's not null or undefined
        setSelectedRegion(region || ""); // Ensure it's not null or undefined
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedCountry && !selectedRegion) {
      // Reset the selected region when the country changes and no region is selected
      setSelectedRegion("");
    }
  }, [selectedCountry, selectedRegion]);

  const handleStripeSubscriptionSuccess = (subscriptionId: any) => {
    navigate(
      `/payment-success?subscription_id=${subscriptionId}&provider=stripe`
    );
  };

  const handleStripeSubscriptionError = (errorMessage: string) => {
    navigate("/payment-failed", { state: { message: errorMessage } });
  };

  const handleMaybeLater = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <BackgroundDesign />
      <Navbar />
      <main className="flex-grow flex justify-center items-start px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div className="w-1/2 pr-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6">
                Subscribe to {selectedPlan?.name} Plan
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Unlimited resume optimizations
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    AI-powered cover letter generation
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheck className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </div>
              </div>
              <div className="mb-10">
                <span className="text-4xl font-bold text-indigo-700">
                  ${selectedPlan?.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              {renderPricingBreakdown()}
              <button
                onClick={handleMaybeLater}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Maybe Later
              </button>
            </div>
            <div className="w-1/2 pl-8 border-l">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  onSubscriptionSuccess={handleStripeSubscriptionSuccess}
                  onSubscriptionError={handleStripeSubscriptionError}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  userEmail={userEmail}
                  selectedPlan={selectedPlan}
                />
              </Elements>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpgradeAndPayment;
