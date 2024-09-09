import { Download } from "lucide-react";
import React from "react";
import { useDocumentDownload } from "../../hooks/useDocumentDownload";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface DownloadFilesProps {
  pdfUrl?: string;
  docxUrl?: string;
  originalFileUrl?: string;
  isOptimized: boolean;
  documentType: "resume" | "cover_letter";
  triggerComponent?: React.ReactNode;
}

const DownloadFiles: React.FC<DownloadFilesProps> = ({
  pdfUrl,
  docxUrl,
  originalFileUrl,
  isOptimized,
  documentType,
  triggerComponent,
}) => {
  const {
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    handleDownloadClick,
    handleDownload,
    remainingUses,
  } = useDocumentDownload({
    pdfUrl,
    docxUrl,
    originalFileUrl,
    isOptimized,
    documentType,
  });

  const defaultTrigger = (
    <Button
      className="theme-button-download p-2 rounded"
      disabled={remainingUses.download === 0}
      onClick={(e) => {
        e.stopPropagation();
        handleDownloadClick();
      }}
    >
      <Download className="h-5 w-5" />
    </Button>
  );

  return (
    <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
      <DialogTrigger asChild>
        {triggerComponent || defaultTrigger}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Download Options</DialogTitle>
        </DialogHeader>
        <div className="flex justify-around mt-4">
          {isOptimized ? (
            <>
              {pdfUrl && (
                <Button
                  className="custom-dialog-button"
                  onClick={() => handleDownload("pdf")}
                >
                  PDF
                </Button>
              )}
              {docxUrl && (
                <Button
                  className="custom-dialog-button"
                  onClick={() => handleDownload("docx")}
                >
                  DOCX
                </Button>
              )}
              {pdfUrl && docxUrl && (
                <Button
                  className="custom-dialog-button"
                  onClick={() => handleDownload("both")}
                >
                  Both
                </Button>
              )}
            </>
          ) : (
            originalFileUrl && (
              <Button onClick={() => handleDownload("pdf")}>
                Download Base{" "}
                {documentType === "resume" ? "resume" : "cover letter"}
              </Button>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadFiles;
