import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TemplateSelection from "./pages/Agents/ResumeBuilder/TemplateSelection";
import ResumeForm from "./pages/Agents/ResumeBuilder/ResumeForm";
import ResumePreview from "./pages/Agents/ResumeBuilder/ResumePreview";
// import ResumeTemplate1 from "./pages/Agents/ResumeBuilder/ResumeTemplate1";

import UploadResume from "./pages/UploadResume";
import JobDetails from "./pages/JobDetails";
import Loading from "./pages/Loading";
import { connectWebSocket, disconnectWebSocket } from "./services/websocketService";

function App() {
  const [, setWebsocketConnected] = useState(false);

  useEffect(() => {
    const websocketUrl = "wss://api.resumeguru.pro/ws/resume/1111/"; // Replace with backend WebSocket URL
    // const websocketUrl = "ws://localhost:8000/ws/resume/1111/"; // Replace with backend WebSocket URL
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
        <Route path="/loading" element={<Loading />} />

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
