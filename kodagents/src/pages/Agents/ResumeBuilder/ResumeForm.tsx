import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sendMessage } from "../../../services/websocketService";
import { sampleResumeData } from "./SampleData";


const ResumeForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId } = location.state;
  const [resumeDescription, setResumeDescription] = useState("");
  const [jobDetails, setJobDetails] = useState("");

  const handleJobDetailsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDetails(event.target.value);
  };

  const handleSubmit = () => {
    const message = {
      type: "creation",
      resumeContent: resumeDescription,
      jobPostContent: jobDetails,
    };
    sendMessage(message);
    navigate("/preview", { state: { resumeData: sampleResumeData, templateId } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Describe Your Resume</h1>
      <textarea
        placeholder="Enter resume details"
        value={resumeDescription}
        onChange={(e) => setResumeDescription(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />
      <h2 className="text-xl font-bold mb-4">
        Optional: Include Job Post Details
      </h2>
      <textarea
        placeholder="Paste the job description here"
        value={jobDetails}
        onChange={handleJobDetailsChange}
        className="mb-4 w-full p-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
      >
        Create Resume
      </button>
    </div>
  );
};

export default ResumeForm;
