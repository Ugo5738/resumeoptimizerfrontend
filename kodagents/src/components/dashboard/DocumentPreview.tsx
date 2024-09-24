import { Eye, FileSearch, MoreVertical, Scissors, Trash2 } from "lucide-react";
import React, { useState } from "react";
import DownloadComponent from "../layout/DownloadFiles";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import JobDetailsForm from "./JobDetailsForm";

interface DocumentPreviewProps {
  fileUrl: string;
  isOriginal: boolean;
  documentType: "resume" | "cover_letter";
  category: string;
  onPreview: () => void;
  onReview: () => void;
  onDelete: () => void;
  pdfUrl?: string;
  docxUrl?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileUrl,
  isOriginal,
  documentType,
  category,
  onPreview,
  onReview,
  onDelete,
  pdfUrl,
  docxUrl,
}) => {
  const [isJobDetailsFormOpen, setIsJobDetailsFormOpen] = useState(false);

  const handleClick = () => {
    onPreview();
  };

  const handleOptimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOriginal) {
      setIsJobDetailsFormOpen(true);
    }
  };

  return (
    <>
      <Card
        className="w-full max-w-xs aspect-[1/1.414] mx-auto flex flex-col justify-between cursor-pointer relative p-4"
        onClick={handleClick}
      >
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-7 w-7 hover:text-indigo-700 transition-colors duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleOptimize}>
                <Scissors className="mr-2 h-4 w-4" />
                <span>Optimize to job</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onReview}>
                <FileSearch className="mr-2 h-4 w-4" />
                <span>Review</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-grow flex flex-col justify-center items-center">
          {/* Document Preview */}
          <div className="w-full h-3/4 bg-gray-100 mb-4 overflow-hidden">
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=fitH`}
              title={`${documentType} preview`}
              className="w-full h-full"
              style={{ pointerEvents: "none" }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {isOriginal ? "Base" : "Optimized"}{" "}
            {documentType === "resume" ? "Resume" : "Cover Letter"}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            disabled={!isOriginal}
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleOptimize}>
            <Scissors className="h-5 w-5" />
          </Button>
          <DownloadComponent
            pdfUrl={pdfUrl}
            docxUrl={docxUrl}
            originalFileUrl={isOriginal ? fileUrl : undefined}
            isOptimized={!isOriginal}
            documentType={documentType}
          />
        </div>
      </Card>
      {isOriginal && (
        <JobDetailsForm
          isOpen={isJobDetailsFormOpen}
          onClose={() => setIsJobDetailsFormOpen(false)}
          documentType={documentType}
          category={category}
        />
      )}
    </>
  );
};

export default DocumentPreview;
