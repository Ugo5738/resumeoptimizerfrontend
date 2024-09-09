import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/contexts/AuthContext";
import { sendMessage } from "../services/websocketService";
import { trackEvent } from "../utils/analytics";

type DocumentType = "resume" | "cover_letter";

interface UseDocumentDownloadProps {
  pdfUrl?: string;
  docxUrl?: string;
  originalFileUrl?: string;
  isOptimized: boolean;
  documentType: DocumentType;
}

export const useDocumentDownload = ({
  pdfUrl,
  docxUrl,
  originalFileUrl,
  isOptimized,
  documentType,
}: UseDocumentDownloadProps) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const { needsPayment, remainingUses, checkUsageStatus } = useAuth();
  const navigate = useNavigate();

  const handleDownloadClick = () => {
    if (needsPayment || remainingUses.download === 0) {
      navigate("/upgrade");
    } else {
      setIsDownloadModalOpen(true);
    }
  };

  const handleDownload = async (format: "pdf" | "docx" | "both") => {
    sendMessage({
      type: "download_document",
    });
    trackEvent("Document", "Download Started", documentType);

    const downloadFile = async (url: string, fileName: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } catch (err) {
        console.error("Error downloading the file:", err);
        trackEvent("Error", "Download Failed", fileName);
      }
    };

    if (isOptimized) {
      if (format === "pdf" || format === "both") {
        await downloadFile(pdfUrl!, `${documentType}.pdf`);
      }
      if (format === "docx" || format === "both") {
        await downloadFile(docxUrl!, `${documentType}.docx`);
      }
    } else {
      await downloadFile(
        originalFileUrl!,
        `${documentType}_original${getFileExtension(originalFileUrl!)}`
      );
    }

    trackEvent("Document", "Download Completed", `${documentType}-${format}`);
    checkUsageStatus();
    setIsDownloadModalOpen(false);
  };

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : "";
  };

  return {
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    handleDownloadClick,
    handleDownload,
    remainingUses,
  };
};
