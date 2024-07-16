import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/common/AuthContext';
import { sendMessage } from "../services/websocketService";
import { trackEvent, trackTiming } from '../utils/analytics';
import axiosInstance from '../utils/axiosConfig';

const UploadResume: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn, usageCount, checkUsageCount } = useAuth();

  useEffect(() => {
    console.log("UploadResume component mounted");
    console.log("isLoggedIn:", isLoggedIn);
    console.log("usageCount:", usageCount);

    const initializeComponent = async () => {
      if (isLoggedIn) {
        try {
          await checkUsageCount();
          console.log("Usage count checked. New count:", usageCount);
        } catch (error) {
          console.error("Error checking usage count:", error);
        }
      }
      setIsLoading(false);
    };

    initializeComponent();
  }, [isLoggedIn, checkUsageCount]);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setResume(file);
      trackEvent("Resume", "File Selected", file.type);
    }
  };
  const handleSubmit = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "upload" } });
      return;
    }

    if (usageCount >= 1) {
      navigate("/upgrade", { state: { from: "upload" } });
      return;
    }

    if (resume) {
      const formData = new FormData();
      formData.append("file", resume);

      const startTime = performance.now();

      try {
        // const response = await axios.post("https://api.resumeguru.pro/api/resume/upload-resume/", formData, {
        const response = await axiosInstance.post("/api/resume/upload-resume/", formData, {
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

          await checkUsageCount();
          navigate("/job-details");
        }
      } catch (error) {
        trackEvent("Resume", "Upload Error", "Error");
        console.error("File upload error:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundDesign />
      <Navbar />
      <main className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-xl w-full px-4 text-center">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Optimize Resume & Craft Cover Letter
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            100% Automatic and <span className="text-purple-600 font-semibold">Free for first use</span>
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg w-full text-center">
            <div className="mb-6">
              <label htmlFor="resume-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {resume ? resume.name : "Upload Resume PDF"}
                <input
                  id="resume-upload"
                  type="file"
                  onChange={handleResumeUpload}
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-150 ease-in-out"
            >
              {!isLoggedIn ? "Login to Continue" : usageCount >= 1 ? "Upgrade to Continue" : "Upload Resume"}
            </button>
            {isLoggedIn && usageCount >= 1 && (
              <p className="mt-4 text-sm text-gray-600">
                You've used your free trial. Upgrade to continue optimizing your resume.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadResume;
