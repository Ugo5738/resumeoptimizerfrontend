import { useState, useEffect } from 'react';
import { onMessage, sendMessage, isWebSocketConnected } from '../services/websocketService';
import BackgroundDesign from '../components/layout/BackgroundDesign';
import Navbar from '../components/layout/Navbar';
import '../styles/base.css';

const Result: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(undefined);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [currentDoc, setCurrentDoc] = useState('resume');
  const [customInstruction, setCustomInstruction] = useState('');
  const [countdown, setCountdown] = useState(120);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const maxAttempts = 3; // Set a maximum number of attempts to avoid infinite loop

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startTimer = () => {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    };

    const handleMessage = (message: any) => {
      try {
        if (message && message.message) {
          const { resume_url, cover_letter_url } = message.message;
          if (resume_url && cover_letter_url) {
            setResumeUrl(resume_url);
            setCoverLetterUrl(cover_letter_url);
            setLoading(false);
            clearInterval(timer);
          } else {
            console.error("Invalid response format", message);
            setError(true);
          }
        } else {
          console.error("Received message is missing 'message' property", message);
          setError(true);
        }
      } catch (error) {
        console.error("Error processing message", error);
        setError(true);
      }
    };

    if (isWebSocketConnected()) {
      onMessage(handleMessage);
      startTimer();
    } else {
      setError(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [attempts]);

  useEffect(() => {
    if (countdown <= 0 && loading) {
      if (attempts < maxAttempts) {
        setCountdown(120);
        setAttempts((prevAttempts) => prevAttempts + 1);
      } else {
        setLoading(false);
        setError(true);
      }
    }
  }, [countdown, attempts, loading]);

  const handleCustomize = () => {
    if (isWebSocketConnected()) {
      sendMessage({
        type: 'customize_document',
        doc_type: currentDoc,
        doc_url: currentDoc === 'resume' ? resumeUrl : coverLetterUrl,
        custom_instruction: customInstruction
      });
    } else {
      setError(true);
    }
  };

  const toggleDocument = () => {
    setCurrentDoc(currentDoc === 'resume' ? 'coverLetter' : 'resume');
  };

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <BackgroundDesign />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">An error occurred! Please try again.</p>
            <a
              href="/upload"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Again
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <main className="flex-1 flex">
        {loading ? (
          <div className="loading-container">
            <div className="loader">
              <div className="loader mb-4"></div>
              <p className="text-lg text-gray-600">Optimizing your resume and crafting your cover letter...</p>
              <p className="text-lg text-gray-600 mt-2">
                Your documents will be ready in <span className="countdown">{countdown}</span> seconds.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-1/3 p-4">
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Describe your edit (e.g., 'Replace contact number with 123-456-7890')"
                className="w-full p-2 border rounded mb-4"
              />
              <button
                onClick={handleCustomize}
                className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Customize Document
              </button>
            </div>
            <div className="w-2/3 p-4">
              <iframe
                src={currentDoc === 'resume' ? resumeUrl : coverLetterUrl}
                className="w-full h-3/4 border rounded"
                title={currentDoc === 'resume' ? 'Resume' : 'Cover Letter'}
              />
              <div className="mt-4 flex justify-between">
                <button onClick={toggleDocument} className="text-indigo-600 hover:text-indigo-500">
                  {currentDoc === 'resume' ? 'See Cover Letter' : 'See Resume'}
                </button>
                <a
                  href={currentDoc === 'resume' ? resumeUrl : coverLetterUrl}
                  download
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Download {currentDoc === 'resume' ? 'Resume' : 'Cover Letter'}
                </a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Result;