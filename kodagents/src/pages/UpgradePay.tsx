import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from "react";
import { FaCheck, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/common/AuthContext';
import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import axiosInstance from '../utils/axiosConfig';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (errorMessage: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, currency, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      onPaymentError('Stripe has not been properly initialized');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/api/payments/initiate/', {
        amount,
        currency,
        provider: 'stripe',
      });

      const { client_secret } = response.data;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        onPaymentError(result.error.message || "An error occurred");
      } else if (result.paymentIntent) {
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (error) {
      onPaymentError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <FaLock className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
        </span>
        {loading ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </form>
  );
};

const UpgradeAndPayment: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await axiosInstance.get('/api/csrf-cookie/');
        // console.log('CSRF token fetched successfully');
      } catch (error) {
        // console.error('Error fetching CSRF token:', error);
        setError('Failed to initialize payment. Please try again.');
      }
    };

    fetchCSRFToken();
  }, []);

  const handlePaystackPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // console.log('Attempting to submit Paystack payment');

    try {
      const response = await axiosInstance.post('/api/payments/initiate/', {
        amount: '9.99',
        currency: 'NGN',
        provider: 'paystack',
      });
      // console.log('Payment initiation response:', response.data);

      if (response.data.authorization_url) {
        // console.log('Redirecting to payment gateway');
        window.location.href = response.data.authorization_url;
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (err: any) {
      console.error('Error during payment initiation:', err);
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePaymentSuccess = (paymentIntent: any) => {
    navigate(`/payment-success?reference=${paymentIntent.id}&provider=stripe`);
  };

  const handleStripePaymentError = (errorMessage: string) => {
    navigate('/payment-failed', { state: { message: errorMessage } });
  };

  const handleMaybeLater = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BackgroundDesign />
      <Navbar />
      <main className="flex-grow flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
              Upgrade to Premium
            </h2>
            <p className="mt-4 text-center text-sm text-gray-600">
              Unlock all features and take your career to the next level
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-4">
              <FaCheck className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Unlimited resume optimizations</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaCheck className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700">AI-powered cover letter generation</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaCheck className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700">Priority support</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-4xl font-bold text-indigo-700">$9.99</span>
            <span className="text-gray-600">/month</span>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                />
                <span className="ml-2">Pay with Stripe</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="paymentMethod"
                  value="paystack"
                  checked={paymentMethod === 'paystack'}
                  onChange={() => setPaymentMethod('paystack')}
                />
                <span className="ml-2">Pay with Paystack</span>
              </label>
            </div>
          </div>

          {paymentMethod === 'paystack' ? (
            <form className="space-y-4" onSubmit={handlePaystackPayment}>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaLock className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                  </span>
                  {loading ? 'Processing...' : 'Pay with Paystack'}
                </button>
              </div>
            </form>
          ) : (
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={9.99}
                currency="USD"
                onPaymentSuccess={handleStripePaymentSuccess}
                onPaymentError={handleStripePaymentError}
              />
            </Elements>
          )}

          {/* <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <button
                type="button"
                disabled={true} // Always disabled
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"

                // turn this back on when payment ready
                // type="submit"
                // disabled={loading}
                // className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaLock className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                {loading ? 'Processing...' : 'Upgrade Now'}
              </button>
            </div>
          </form> */}

          <button
            onClick={handleMaybeLater}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Maybe Later
          </button>

          <div>
            <p className="text-center text-sm text-gray-500">
              By upgrading, you agree to our{' '}
              <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpgradeAndPayment;
