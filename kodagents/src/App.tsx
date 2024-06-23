import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import HomePage from "./pages/HomePage";
import TemplateSelection from "./pages/Agents/ResumeBuilder/TemplateSelection";
import ResumeForm from "./pages/Agents/ResumeBuilder/ResumeForm";
import ResumePreview from "./pages/Agents/ResumeBuilder/ResumePreview";
// import ResumeTemplate1 from "./pages/Agents/ResumeBuilder/ResumeTemplate1";

import UploadResume from "./pages/UploadResume";
import JobDetails from "./pages/JobDetails";
import Result from "./pages/Result";
import HowToUse from "./pages/HowToUse";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import { connectWebSocket, disconnectWebSocket } from "./services/websocketService";

function App() {
  const [, setWebsocketConnected] = useState(false);

  useEffect(() => {
    let userId: string = localStorage.getItem("userId") || uuidv4();
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", userId);
    }

    const websocketUrl = `wss://api.resumeguru.pro/ws/resume/${userId}/`;
    console.log(websocketUrl)
    // const websocketUrl = "ws://localhost:8000/ws/resume/${userId}/"; // Replace with backend WebSocket URL
    connectWebSocket(websocketUrl);
    setWebsocketConnected(true);

    return () => {
      disconnectWebSocket();
      setWebsocketConnected(false);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/result" element={<Result />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/selection" element={<TemplateSelection />} />
        <Route path="/resume-form" element={<ResumeForm />} />
        <Route path="/edit" element={<ResumeForm />} />
        <Route path="/preview" element={<ResumePreview />} />
      </Routes>
    </Router>
  );
}

export default App;
