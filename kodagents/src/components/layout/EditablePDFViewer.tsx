import React, { useEffect, useRef, useState } from 'react';
import { FaArrowCircleRight, FaUndo } from "react-icons/fa";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useNavigate } from 'react-router-dom';
import InsightsSection from '../../pages/InsightsSection';
import { isWebSocketConnected, onMessage, sendMessage } from '../../services/websocketService';
import '../../styles/base.css';
import { CustomizationInfo, InitialOptimization } from '../../types/types';
import { trackEvent, trackTiming } from '../../utils/analytics';
import axiosInstance from '../../utils/axiosConfig';
import { useAuth } from '../common/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface DocumentMessage {
  message: {
    documents: {
      resume_pdf_url: string;
      resume_docx_url: string;
      cover_letter_pdf_url: string;
      cover_letter_docx_url: string;
    };
    initial_optimization: {
      improvement_summary: {
        key_changes: string[];
        ats_optimization: string;
        tailoring_to_job: string;
      };
      scores: {
        job_match: number;
        interview_potential: number;
      };
    };
    customization_info?: CustomizationInfo;
  };
}

// Define a type for the document structure
type DocumentType = 'resume' | 'cover_letter';

interface Documents {
  resume: { pdf: string; docx: string };
  cover_letter: { pdf: string; docx: string };
}

interface DocumentUrls {
  resume_pdf_url: string;
  resume_docx_url: string;
  cover_letter_pdf_url: string;
  cover_letter_docx_url: string;
}

const EditablePDFViewer: React.FC = () => {
  const [documents, setDocuments] = useState<Documents>({
    resume: { pdf: '', docx: '' },
    cover_letter: { pdf: '', docx: '' }
  });
  const [originalDocuments, setOriginalDocuments] = useState<Documents | null>(null);
  const [currentDoc, setCurrentDoc] = useState<DocumentType>('resume');
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfWidth, setPdfWidth] = useState(600); // Default width
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [DocumentError, setDocumentError] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [initialOptimization, setInitialOptimization] = useState<InitialOptimization | null>(null);
  const [customizationHistory, setCustomizationHistory] = useState<CustomizationInfo[]>([]);

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const { isPaid, usageCount, setUsageCount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (containerRef.current) {
        setPdfWidth(containerRef.current.clientWidth * 0.9);
      }
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
    // "How can we improve this resume? (e.g., 'Update address to 123 Main St, Cityville')",
    // "What would you like to change? (e.g., 'Edit skills section to include Python and Java')",
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
    if (isWebSocketConnected()) {
      onMessage((data: any) => {
        // console.log("Received WebSocket message:", data);
        if (data && data.message) {
          const { documents: receivedDocuments, initial_optimization, customization_info } = data.message;

          if (receivedDocuments) {
            const newDocuments = {
              resume: {
                pdf: receivedDocuments.resume_pdf_url || documents.resume.pdf,
                docx: receivedDocuments.resume_docx_url || documents.resume.docx
              },
              cover_letter: {
                pdf: receivedDocuments.cover_letter_pdf_url || documents.cover_letter.pdf,
                docx: receivedDocuments.cover_letter_docx_url || documents.cover_letter.docx
              }
            };
            setDocuments(newDocuments);

            // Store the original documents when first received
            if (!originalDocuments) {
              setOriginalDocuments(newDocuments);
            }
            trackEvent('Document', 'Documents Received');
          }

          if (initial_optimization) {
            setInitialOptimization(initial_optimization);
          }

          if (customization_info) {
            setCustomizationHistory(prevHistory => [customization_info, ...prevHistory]);
            // Update only the specific document that was customized
            const customizedDocType = data.message.metadata?.document_type as DocumentType | undefined;
            if (customizedDocType && (customizedDocType === 'resume' || customizedDocType === 'cover_letter')) {
              setDocuments(prevDocs => ({
                ...prevDocs,
                [customizedDocType]: {
                  pdf: (receivedDocuments as DocumentUrls)[`${customizedDocType}_pdf_url`] || prevDocs[customizedDocType].pdf,
                  docx: (receivedDocuments as DocumentUrls)[`${customizedDocType}_docx_url`] || prevDocs[customizedDocType].docx
                }
              }));
            }
          }

          setLoading(false);
          if (timerRef.current) clearInterval(timerRef.current);
          setCustomInstruction('');
        } else {
          console.error("Received message is missing 'message' property", data);
          setError("Received message is missing 'message' property");
          trackEvent('Error', 'Missing Message Property');
        }
      });
      startTimer();
    } else {
      setError("WebSocket is not connected");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempts, documents, originalDocuments]);

  const handleReset = () => {
    if (originalDocuments) {
      setDocuments(originalDocuments);
      setCurrentDoc('resume');
      setCustomizationHistory([]);
      trackEvent('Document', 'Reset to Original');
    }
  };

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
        doc_url: documents[currentDoc].pdf,
        custom_instruction: customInstruction
      });
      const endTime = performance.now();
      trackTiming('Customization', 'Request Time', Math.round(endTime - startTime));
      setCustomInstruction('');
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

  const handleDownload = async (format: 'pdf' | 'docx' | 'both') => {
    if (!isPaid && usageCount >= 1) {
      alert("You have reached your usage limit. Please upgrade to continue.");
      navigate('/upgrade');
      return;
    }

    trackEvent('Document', 'Download Started', currentDoc);

    const downloadFile = async (url: string, fileName: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } catch (err) {
        console.error('Error downloading the file:', err);
        trackEvent('Error', 'Download Failed', fileName);
      }
    };

    if (format === 'pdf' || format === 'both') {
      await downloadFile(documents[currentDoc].pdf, `${currentDoc}.pdf`);
    }
    if (format === 'docx' || format === 'both') {
      await downloadFile(documents[currentDoc].docx, `${currentDoc}.docx`);
    }

    trackEvent('Document', 'Download Completed', `${currentDoc}-${format}`);

    if (!isPaid) {
      try {
        // Update usage count only for unpaid users
        const updateResponse = await axiosInstance.post('/api/auth/update-usage/');
        if (updateResponse.status === 200) {
          // Update the usage count in your state or context
          setUsageCount(updateResponse.data.usage_count);

          // If the new usage count is 1 or greater, navigate to the upgrade page
          if (updateResponse.data.usage_count >= 1) {
            alert("You have reached your usage limit. Please upgrade to continue.");
            navigate('/upgrade');
          }
        } else {
          console.error('Failed to update usage count');
        }
      } catch (error) {
        console.error('Error updating usage count:', error);
      }
    }
    setIsDownloadModalOpen(false);
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
    <div className="layout-container">
      <div className="left-column">
        <InsightsSection
          initialOptimization={initialOptimization}
          customizationHistory={customizationHistory}
        />
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
      </div>
      <div className="pdf-section">
        <div className="pdf-viewer-container" ref={containerRef}>
          <div className="pdf-scroll-container">
            <Document
              file={documents[currentDoc].pdf}
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
              onClick={() => setCurrentDoc(currentDoc === 'resume' ? 'cover_letter' : 'resume')}
              className="theme-button-view p-2 rounded"
            >
              View {currentDoc === 'resume' ? 'Cover Letter' : 'Resume'}
            </button>

            <button
              onClick={handleReset}
              className="theme-button-reset p-2 rounded"
              title="Reset to original documents"
            >
              <FaUndo />
            </button>

            <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="theme-button-download p-2 rounded"
                  disabled={!isPaid && usageCount >= 1}
                  onClick={() => {
                    if (!isPaid && usageCount >= 1) {
                      navigate('/upgrade');
                    } else {
                      setIsDownloadModalOpen(true);
                    }
                  }}
                >
                  Download {currentDoc === 'resume' ? 'Resume' : 'Cover Letter'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Download Format</DialogTitle>
                </DialogHeader>
                <div className="flex justify-around mt-4">
                  <Button className="custom-dialog-button" onClick={() => handleDownload('pdf')}>PDF</Button>
                  <Button className="custom-dialog-button" onClick={() => handleDownload('docx')}>DOCX</Button>
                  <Button className="custom-dialog-button" onClick={() => handleDownload('both')}>Both</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="download-help-text">
            You can download the DOCX version to make manual edits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditablePDFViewer;
