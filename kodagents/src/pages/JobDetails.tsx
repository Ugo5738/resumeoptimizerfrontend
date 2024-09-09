import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/contexts/AuthContext";
import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import { sendMessage } from "../services/websocketService";
import { trackEvent } from "../utils/analytics";

import "../styles/base.css";

const JobDetails: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<string>("");
  const navigate = useNavigate();
  const { needsPayment, remainingUses } = useAuth();

  const handleSubmit = (action: "optimize" | "preview") => () => {
    trackEvent(
      "Job Details",
      action === "optimize" ? "Submitted" : "Previewed",
      jobDetails ? "With Details" : "Without Details"
    );
    sendMessage({ type: "jobDetails", details: jobDetails });
    navigate("/result");
  };

  const handleJobDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDetails(e.target.value);
    if (e.target.value.length > 0) {
      trackEvent("Job Details", "Input Started");
    }
  };

  useEffect(() => {
    if (needsPayment || remainingUses.creation === 0) {
      trackEvent("Job Details", "Create Remaining Use Exhausted");
    }
  }, [needsPayment, remainingUses.creation]);

  const isDisabled = remainingUses.creation === 0;

  return (
    <div className="flex flex-col h-screen">
      <BackgroundDesign />
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-xl mb-4">Job Details (Optional)</h1>
        <p className="text-sm text-gray-600 mb-2">
          Not ready to add job details? You can skip this step and preview your
          optimized resume.
        </p>
        <textarea
          value={jobDetails}
          onChange={handleJobDetailsChange}
          className="w-full max-w-4xl p-4 border rounded mb-4"
          style={{ height: "450px" }}
          placeholder="Paste job details here"
        ></textarea>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit("preview")}
            className={`rounded-md px-3.5 py-2.5 text-lg font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isDisabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 focus-visible:outline-indigo-600"
            }`}
            disabled={isDisabled}
          >
            Skip
          </button>
          <button
            onClick={handleSubmit("optimize")}
            className={`rounded-md px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
            }`}
            disabled={isDisabled}
          >
            Optimize
          </button>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
