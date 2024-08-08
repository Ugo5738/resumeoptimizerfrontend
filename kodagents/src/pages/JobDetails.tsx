import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/common/AuthContext";
import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import { sendMessage } from "../services/websocketService";
import { trackEvent } from "../utils/analytics";

import "../styles/base.css";

const JobDetails: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<string>("");
  const navigate = useNavigate();
  const { needsPayment, remainingUses } = useAuth();

  const handleSubmit = () => {
    trackEvent(
      "Job Details",
      "Submitted",
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

  return (
    <div className="flex flex-col h-screen">
      <BackgroundDesign />
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-xl mb-4">Job Details (Optional)</h1>
        <textarea
          value={jobDetails}
          onChange={handleJobDetailsChange}
          className="w-full max-w-4xl p-4 border rounded mb-4"
          style={{ height: "450px" }}
          placeholder="Paste job details here"
        ></textarea>
        <button
          onClick={handleSubmit}
          className={`rounded-md px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            remainingUses.creation === 0
              ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
          }`}
          disabled={remainingUses.creation === 0}
        >
          Optimize
        </button>
      </main>
    </div>
  );
};

export default JobDetails;
