import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { onMessage, sendMessage, isWebSocketConnected } from '../../services/websocketService';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { FaArrowCircleRight } from "react-icons/fa";
import { trackEvent, trackTiming } from '../../utils/analytics';

import '../../styles/base.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface DocumentMessage {
  message: {
    resume_url?: string;
    cover_letter_url?: string;
  };
}

const EditablePDFViewer: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [coverLetterUrl, setCoverLetterUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDoc, setCurrentDoc] = useState<'resume' | 'cover_letter'>('resume');
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [DocumentError, setDocumentError] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfWidth, setPdfWidth] = useState(600); // Default width
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updatePdfWidth = () => {
      if (containerRef.current) {
        setPdfWidth(containerRef.current.clientWidth * 0.9);
      }
    };

    updatePdfWidth();
    window.addEventListener('resize', updatePdfWidth);

    return () => window.removeEventListener('resize', updatePdfWidth);
  }, []);
  
  const placeholders = [
    "Enter text to update (e.g., 'Change job title to Senior Developer')",
    "Describe your edit (e.g., 'Replace contact number with 123-456-7890')",
    "How can we improve this resume? (e.g., 'Update address to 123 Main St, Cityville')",
    "What would you like to change? (e.g., 'Edit skills section to include Python and Java')",
    "Input your changes (e.g., 'Correct email to user@example.com')"
  ];

  const [placeholder, setPlaceholder] = useState<string>('');

  useEffect(() => {
    setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCountdown(120);
    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const handleMessage = (message: DocumentMessage) => {
      if (message && message.message) {
        const { resume_url, cover_letter_url } = message.message;
        if (resume_url) {
          setResumeUrl(resume_url);
          trackEvent('Document', 'Resume Received');
        }
        if (cover_letter_url) {
          setCoverLetterUrl(cover_letter_url);
          trackEvent('Document', 'Cover Letter Received');
        }
        setLoading(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setCustomInstruction('');
        if (!resume_url && !cover_letter_url) {
          console.error("Invalid response format", message);
          setError("Invalid response format");
          trackEvent('Error', 'Invalid Response Format');
        }
      } else {
        console.error("Received message is missing 'message' property", message);
        setError("Received message is missing 'message' property");
        trackEvent('Error', 'Missing Message Property');
      }
    };

    if (isWebSocketConnected()) {
      onMessage(handleMessage);
      startTimer();
    } else {
      setError("WebSocket is not connected");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempts]);

  useEffect(() => {
    if (countdown <= 0 && loading) {
      if (attempts < maxAttempts) {
        startTimer();
        setAttempts((prevAttempts) => prevAttempts + 1);
      } else {
        setLoading(false);
        setDocumentError(true);
      }
    }
  }, [countdown, attempts, loading]);

  const handleCustomize = () => {
    if (isWebSocketConnected()) {
      setLoading(true);
      setAttempts(0);
      startTimer();
      trackEvent('Customization', 'Started', currentDoc);
      const startTime = performance.now();
      sendMessage({
        type: 'customize_document',
        doc_type: currentDoc,
        doc_url: currentDoc === 'resume' ? resumeUrl : coverLetterUrl,
        custom_instruction: customInstruction
      });
      const endTime = performance.now();
      trackTiming('Customization', 'Request Time', Math.round(endTime - startTime));
    } else {
      setError("WebSocket is not connected");
      trackEvent('Error', 'WebSocket Not Connected');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    trackEvent('Document', 'Loaded Successfully', currentDoc);
  };

  const toggleDocument = () => {
    const newDoc = currentDoc === 'resume' ? 'cover_letter' : 'resume';
    setCurrentDoc(newDoc);
    trackEvent('Document', 'Toggled', newDoc);
  };

  const handleDownload = () => {
    const url = currentDoc === 'resume' ? resumeUrl : coverLetterUrl;
    const fileName = currentDoc === 'resume' ? 'resume.pdf' : 'cover_letter.pdf';
    
    trackEvent('Document', 'Download Started', currentDoc);
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        trackEvent('Document', 'Download Completed', currentDoc);
      })
      .catch(err => {
        console.error('Error downloading the file:', err);
        trackEvent('Error', 'Download Failed', currentDoc);
      });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomInstruction(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(
        textareaRef.current.scrollHeight,
        isMobile ? 5 * 20 : 10 * 20
      );
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  if (DocumentError) {
    return (
      <div className="flex flex-col h-screen">
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-lg text-gray-600">
          Optimizing your {currentDoc === 'resume' ? 'resume' : 'cover letter'}...
        </p>
        <p className="text-lg text-gray-600 mt-2">
          Your document will be ready in <span className="countdown">{countdown}</span> seconds.
        </p>
        {/* {attempts > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Attempt {attempts} of {maxAttempts}
          </p>
        )} */}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="layout-container">
        <div className="input-section">
          <div className="edit-input-container">
          <textarea
            ref={textareaRef}
            value={customInstruction}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            className="custom-input"
            rows={1}
          />
          <button
            onClick={handleCustomize}
            className="send-button"
          >
            <FaArrowCircleRight size={30}/> 
          </button>
        </div>
      </div>
      <div className="pdf-section">
        <div className="pdf-viewer-container" ref={containerRef}>
          <div className="pdf-scroll-container">
            <Document
              file={currentDoc === 'resume' ? resumeUrl : coverLetterUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Loading PDF...</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={pdfWidth}
                />
              ))}
            </Document>
          </div>
          <div className="pdf-controls">
            <button
              onClick={toggleDocument}
              className="bg-gray-200 text-gray-800 p-2 rounded"
            >
              View {currentDoc === 'resume' ? 'Cover Letter' : 'Resume'}
            </button>
            <button 
              onClick={handleDownload}
              className="bg-gray-200 text-gray-800 p-2 rounded"
            >
              Download {currentDoc === 'resume' ? 'Resume' : 'Cover Letter'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EditablePDFViewer;
