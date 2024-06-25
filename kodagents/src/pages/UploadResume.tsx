import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";

import React, { useState } from "react";
import { sendMessage } from "../services/websocketService";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { trackEvent, trackTiming } from '../utils/analytics';

const UploadResume: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setResume(file);
      trackEvent("Resume", "File Selected", file.type);
    }
  };

  const handleSubmit = async () => {
    if (resume) {
      const formData = new FormData();
      formData.append("file", resume);

      const startTime = performance.now();

      try {
        const response = await axios.post("https://api.resumeguru.pro/api/resume/upload-resume/", formData, {
        // const response = await axios.post("http://localhost:8000/api/resume/upload-resume/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          const duration = Math.round(performance.now() - startTime);
          trackEvent("Resume", "Upload Success", resume.type);
          trackTiming("Resume", "Upload Time", duration, resume.type);

          sendMessage({
            type: "resume_uploaded",
            file_key: response.data.file_key,
          });
          navigate("/job-details");
        }
      } catch (error) {
        trackEvent("Resume", "Upload Error", "Error");
        console.error("File upload error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Optimize Resume and Craft Cover Letter
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          100% Automatic and <span className="text-purple-600">Free</span>
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <input type="file" onChange={handleResumeUpload} className="mb-4" />
          <button
            onClick={handleSubmit}
            // className="px-4 py-2 bg-blue-500 text-white rounded"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Upload Resume (PDF only)
          </button>
        </div>
      </main>
    </div>
  );
};

export default UploadResume;
