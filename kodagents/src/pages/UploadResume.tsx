import React, { useState, useEffect } from "react";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "../services/websocketService";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadResume: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const url =
      "wss://jubilant-winner-5r7v6pq66w9h7r9p-8000.app.github.dev/ws/resume/1111/";
    connectWebSocket(url);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (resume) {
      const formData = new FormData();
      formData.append("file", resume);

      try {
        const response = await axios.post("/upload_resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          sendMessage({
            type: "resume_uploaded",
            file_key: response.data.file_key,
          });
          navigate("/job-details");
        }
      } catch (error) {
        console.error("File upload error:", error);
      }
    }
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
        <h1 className="text-4xl font-bold mb-6 text-center">
          Optimize Resume and Craft Cover Letter
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          100% Automatically and <span className="text-purple-600">Free</span>
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <input type="file" onChange={handleResumeUpload} className="mb-4" />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Upload Resume
          </button>
        </div>
      </main>
    </div>
  );
};

export default UploadResume;
