import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { FaLock } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";

interface PaymentFormProps {
  onSubscriptionSuccess: (subscriptionId: string) => void;
  onSubscriptionError: (errorMessage: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  userEmail: string;
}

const CheckoutForm: React.FC<PaymentFormProps> = ({
  onSubscriptionSuccess,
  onSubscriptionError,
  selectedCountry,
  setSelectedCountry,
  selectedRegion,
  setSelectedRegion,
  userEmail,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  useEffect(() => {
    // Prefill country and region if available
    if (selectedCountry) {
      setSelectedCountry(selectedCountry);
    }
    if (selectedRegion) {
      setSelectedRegion(selectedRegion);
    }
  }, [selectedCountry, selectedRegion, setSelectedCountry, setSelectedRegion]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      onSubscriptionError("Stripe has not been properly initialized");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/api/payments/initiate/", {
        tier: "essential",
        provider: "stripe",
        payment_type: "subscription",
      });

      const { client_secret, subscription_id } = await response.data;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email: userEmail,
            address: {
              country: selectedCountry,
              line1: address,
              city: city,
              state: selectedRegion,
              postal_code: postalCode,
            },
            phone: phone,
          },
        },
      });

      if (result.error) {
        onSubscriptionError(result.error.message || "An error occurred");
      } else if (result.paymentIntent) {
        onSubscriptionSuccess(subscription_id);
      }
    } catch (error) {
      onSubscriptionError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-l mb-4">Contact information</h2>
        <input
          type="email"
          value={userEmail}
          onChange={() => {}} // Add an empty onChange handler
          placeholder="Email"
          className="w-full p-2 border rounded bg-gray-100" // Added bg-gray-100 to visually indicate it's read-only
          required
          readOnly
        />
      </div>

      <div>
        <h2 className="text-l mb-4">Payment method</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <CardElement className="p-2 bg-white rounded border border-gray-300" />
        </div>
      </div>

      <div>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Name on card"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <h2 className="text-l mb-4">Billing address</h2>
        <CountryDropdown
          value={selectedCountry}
          onChange={(val) => setSelectedCountry(val)}
          classes="w-full p-2 border rounded"
          valueType="short"
          priorityOptions={["US", "CA", "GB", "AU"]}
        />
      </div>

      <div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address line 1"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Address line 2"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Suburb"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Postal code"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <RegionDropdown
          country={selectedCountry}
          value={selectedRegion}
          onChange={(val) => setSelectedRegion(val)}
          classes="w-full p-2 border rounded"
          countryValueType="short"
          defaultOptionLabel="Select Region"
          blankOptionLabel="No regions available"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="saveInfo"
          checked={saveInfo}
          onChange={(e) => setSaveInfo(e.target.checked)}
          className="form-checkbox h-5 w-5 text-indigo-600"
        />
        <label htmlFor="saveInfo" className="text-sm text-gray-700">
          Securely save my information for 1-click checkout
        </label>
      </div>

      {saveInfo && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Enter your phone number to create a Link account and pay faster on
            ResumeGuru, LLC and everywhere Link is accepted.
          </p>
          <div className="flex">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="flex-grow p-2 border rounded-l"
            />
            <span className="bg-gray-100 text-gray-500 p-2 rounded-r border border-l-0">
              Optional
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <FaLock className="h-5 w-5 text-indigo-300 mr-2" />
        {loading ? "Processing..." : "Subscribe"}
      </button>

      <div className="text-center text-sm text-gray-500">
        <p>Powered by Stripe</p>
        <p>
          <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms
          </a>
          {" • "}
          <a href="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy
          </a>
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
