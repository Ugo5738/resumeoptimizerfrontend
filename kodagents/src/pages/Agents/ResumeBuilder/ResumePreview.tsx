import axios from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResumeTemplate from "./ResumeTemplate";
// import ResumeTemplate1 from "./ResumeTemplate1";
import { onMessage } from "../../../services/websocketService";
import { ResumeData } from "../../../types/types";

const ResumePreview: React.FC = () => {
  const location = useLocation();
  const { resumeData, templateId } = location.state as {
    resumeData: ResumeData;
    templateId: number;
  };
  const [generatedResumeData, setGeneratedResumeData] =
    useState<ResumeData | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "resume_data") {
        setGeneratedResumeData(message.data);
      }
    };

    onMessage(handleMessage);
  }, []);

  const handleEdit = () => {
    navigate("/edit", {
      state: { resumeData: generatedResumeData || resumeData, templateId },
    });
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        // "http://localhost:8000/api/download-resume",
        "https://api.resumeguru.pro/api/download-resume",
        {
          responseType: "blob",
        }
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      saveAs(pdfBlob, "resume.pdf");
    } catch (error) {
      console.error("Failed to download resume:", error);
    }
  };

  return (
    <div>
      <h1>Resume Preview</h1>
      {generatedResumeData ? (
        <ResumeTemplate resumeData={generatedResumeData} />
      ) : (
        // <p>Loading...</p>
        <ResumeTemplate resumeData={resumeData} />
      )}
      <button onClick={handleDownload}>Download Resume</button>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default ResumePreview;
