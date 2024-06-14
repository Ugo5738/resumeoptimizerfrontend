import React, { useEffect } from "react";
import { onMessage } from "../services/websocketService";
import { useNavigate } from 'react-router-dom';

import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";

const Loading: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    onMessage((message) => {
      console.log("Message from server:", message);
      // Handle incoming message, possibly redirect to results page
      if (message.type === "optimization_complete") {
        navigate("/results");
      }
    });
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
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
