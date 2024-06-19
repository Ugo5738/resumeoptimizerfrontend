import React, { useState, useEffect } from "react";
import { onMessage } from "../services/websocketService";
import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import "../styles/base.css";

const Result: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(undefined);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(120);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const maxAttempts = 5; // Set a maximum number of attempts to avoid infinite loop

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    onMessage((message) => {
      try {
        const { resume_url, cover_letter_url } = message.message;
        if (resume_url && cover_letter_url) {
          setResumeUrl(resume_url);
          setCoverLetterUrl(cover_letter_url);
          setLoading(false);
        } else {
          console.error("Invalid response format", message);
        }
      } catch (error) {
        console.error("Error processing message", error);
      }
    });
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      if (attempts < maxAttempts) {
        setCountdown(120); // Reset the countdown
        setAttempts((prevAttempts) => prevAttempts + 1); // Increment attempts
      } else {
        setLoading(false); // Stop loading after max attempts
        setError(true); // Set error state
      }
    }
  }, [countdown, attempts]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p className="text-lg text-gray-600">Optimizing your resume and crafting your cover letter...</p>
            <p className="text-lg text-gray-600">
              Your resume would be ready in {" "}
              <span className="countdown"> {countdown} </span>
              {" "}seconds.
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">An error occurred! Please try again.</p>
            <a
              href="/upload"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Again
            </a>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Your documents are ready!</p>
            <div className="flex space-x-4 mt-8">
              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="link">
                  Click to view optimized resume
                </a>
              )}
              {coverLetterUrl && (
                <a href={coverLetterUrl} target="_blank" rel="noopener noreferrer" className="link">
                  Click to view cover letter
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Result;
