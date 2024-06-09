import React, { useEffect } from "react";
import { onMessage } from "../services/websocketService";

const Loading: React.FC = () => {
  useEffect(() => {
    onMessage((message) => {
      console.log("Message from server:", message);
      // Handle incoming message, possibly redirect to results page
    });
  }, []);

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
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500 mb-4"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-lg text-gray-600">Optimizer is working...</p>
        </div>
        <div className="flex space-x-4 mt-8">
          <a href="#" className="text-blue-500">
            Click to view optimized resume
          </a>
          <a href="#" className="text-blue-500">
            Click to view cover letter
          </a>
        </div>
      </main>
    </div>
  );
};

export default Loading;
