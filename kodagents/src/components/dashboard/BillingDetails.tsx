import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SubscriptionPlan {
  name: string;
  price: number;
  interval: "monthly" | "quarterly" | "lifetime";
}

interface Invoice {
  date: number;
  amount: number;
  status: string;
  invoice_pdf: string;
}

const BillingDetails: React.FC = () => {
  const [currency, setCurrency] = useState("USD");
  const { fetchSubscriptionDetails, tier, nextBillingDate, setTier } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  // const [billingHistory, setBillingHistory] = useState<Invoice[]>([]);
  const [_, setBillingHistory] = useState<Invoice[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubscriptionDetails = async () => {
      try {
        const details = await fetchSubscriptionDetails();
        const paidPlans = details.filter(
          (plan: SubscriptionPlan) => plan.name !== "free"
        );
        setPlans(paidPlans);
        setSelectedPlan(paidPlans[0]);
      } catch (error) {
        console.error("Error loading subscription details:", error);
      }
    };

    loadSubscriptionDetails();
  }, [fetchSubscriptionDetails]);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        const response = await axiosInstance.get<Invoice[]>(
          "/api/payments/billing-history/"
        );
        setBillingHistory(response.data);
      } catch (error) {
        console.error("Error fetching billing history:", error);
      }
    };

    if (tier !== "free") {
      fetchBillingHistory();
    }
  }, [tier]);

  const handleUpgrade = () => {
    if (selectedPlan) {
      navigate("/upgrade", { state: { selectedPlan } });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/payments/cancel-subscription/"
      );
      if (response.data.message) {
        console.log(response.data.message);
        setTier("free");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  const renderFeatures = () => (
    <ul className="space-y-2 mb-6">
      <li className="flex items-center">
        <svg
          className="w-5 h-5 text-green-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Unlimited AI Writer Use
      </li>
      <li className="flex items-center">
        <svg
          className="w-5 h-5 text-green-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Unlimited Resumes, Cover Letters, Resignation Letters
      </li>
      <li className="flex items-center">
        <svg
          className="w-5 h-5 text-green-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Unlimited Keyword Targeting, Content Analysis
      </li>
      <li className="flex items-center">
        <svg
          className="w-5 h-5 text-green-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        1 Free Monthly Resume Review (by human, real-time)
      </li>
      <li className="flex items-center">
        <svg
          className="w-5 h-5 text-green-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        All other features
        <Popover>
          <PopoverTrigger>
            <Info className="w-4 h-4 ml-2 text-gray-400" />
          </PopoverTrigger>
          <PopoverContent>
            <ul className="text-sm">
              <li>All resume templates</li>
              <li>All Pro Samples</li>
              <li>Add resume photo</li>
              <li>Download as Microsoft .DOCX</li>
              <li>Add to Google Drive</li>
            </ul>
          </PopoverContent>
        </Popover>
      </li>
    </ul>
  );

  const renderPlans = () => (
    <RadioGroup
      value={selectedPlan?.interval || ""}
      onValueChange={(value) =>
        setSelectedPlan(plans.find((plan) => plan.interval === value) || null)
      }
    >
      {plans.map((plan) => (
        <div
          key={plan.interval}
          className="flex items-center justify-between p-4 border rounded-lg mb-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={plan.interval} id={plan.interval} />
            <Label htmlFor={plan.interval}>
              {plan.interval}
              {plan.interval === "quarterly" && (
                <span className="text-green-500 text-sm ml-2">SAVE 20%</span>
              )}
            </Label>
          </div>
          <span className="font-semibold">
            ${plan.price}
            {plan.interval !== "lifetime" ? "/mo" : "/once"}
          </span>
        </div>
      ))}
    </RadioGroup>
  );

  // const renderBillingHistory = () => (
  //   <div>
  //     <h3 className="text-lg font-semibold mb-2">Billing History</h3>
  //     <Table>
  //       <TableHeader>
  //         <TableRow>
  //           <TableHead>Date</TableHead>
  //           <TableHead>Amount</TableHead>
  //           <TableHead>Status</TableHead>
  //           <TableHead>Invoice</TableHead>
  //         </TableRow>
  //       </TableHeader>
  //       <TableBody>
  //         {billingHistory.map((invoice, index) => (
  //           <TableRow key={index}>
  //             <TableCell>
  //               {new Date(invoice.date * 1000).toLocaleDateString()}
  //             </TableCell>
  //             <TableCell>${invoice.amount?.toFixed(2) ?? "N/A"}</TableCell>
  //             <TableCell>{invoice.status}</TableCell>
  //             <TableCell>
  //               <a
  //                 href={invoice.invoice_pdf}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 View Invoice
  //               </a>
  //             </TableCell>
  //           </TableRow>
  //         ))}
  //       </TableBody>
  //     </Table>
  //   </div>
  // );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex">
          <div className="flex-1 pr-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {tier !== "free" ? "Billing" : "Upgrade to Pro"}
              </h2>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">$ (USD)</SelectItem>
                  {/* Add more currency options as needed */}
                </SelectContent>
              </Select>
            </div>

            {tier !== "free" ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                  <p>You are currently on the {tier} plan.</p>
                  <p>
                    Next billing date:{" "}
                    {nextBillingDate
                      ? new Date(nextBillingDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Loading..."
                    }
                  </p>
                  <Button
                    onClick={handleCancelSubscription}
                    variant="outline"
                    className="mt-2"
                  >
                    Cancel Subscription
                  </Button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Change Plan</h3>
                  {renderPlans()}
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
                    onClick={handleUpgrade}
                  >
                    Change Plan
                  </Button>
                </div>
                {/* {renderBillingHistory()} */}
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  To create more Resumes, please upgrade to a Pro plan.
                </p>
                {renderFeatures()}
                {renderPlans()}
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-6"
                  onClick={handleUpgrade}
                >
                  CONTINUE
                </Button>
              </>
            )}
          </div>
          {tier === "free" && (
            <div className="w-1/3">
              <img
                src="/upgrade.jpeg"
                alt="Upgrade illustration"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
