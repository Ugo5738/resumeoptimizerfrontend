import React, { useState } from "react";
import { sendMessage } from "../services/websocketService";
import { useNavigate } from "react-router-dom";

const JobDetails: React.FC = () => {
  const [jobDetails, setJobDetails] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    sendMessage({ type: "jobDetails", details: jobDetails });
    navigate("/loading");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <nav className="w-full flex justify-between items-center p-4 bg-white shadow">
        <div className="text-2xl font-bold">ResumeOptimizer.io</div>
        <div className="space-x-4">
          <a href="#" className="text-gray-600">
            How to Use
          </a>
          <a href="#" className="text-gray-600">
            About
          </a>
          <a href="#" className="text-gray-600">
            Pricing
          </a>
          <a href="#" className="text-gray-600">
            Log In
          </a>
          <a href="#" className="text-gray-600">
            Sign Up
          </a>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4">Job Details (Optional)</h1>
        <textarea
          value={jobDetails}
          onChange={(e) => setJobDetails(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter job details here"
        ></textarea>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </main>
    </div>
  );
};

export default JobDetails;
