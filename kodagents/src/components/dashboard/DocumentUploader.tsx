import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../ui/card";
import DocumentCreationForm from "./DocumentCreationForm";

interface DocumentUploaderProps {
  onDocumentCreated: () => void;
  documentType: "resume" | "cover_letter";
  category: string;
  existingDocument?: {
    id: string;
    file_url: string;
  };
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentCreated,
  documentType,
  category,
  existingDocument,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { checkUsageStatus } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);
    setIsFormOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  const handleFormSubmit = async (newCategory: string) => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("category", newCategory);
    formData.append("document_type", documentType);

    try {
      const response = await axiosInstance.post(
        "/api/resume/upload-document/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        await checkUsageStatus();
        onDocumentCreated();
        setIsFormOpen(false);
        setUploadedFile(null);
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  return (
    <>
      <Card
        {...getRootProps()}
        className={`w-full max-w-xs aspect-[1/1.414] mx-auto flex flex-col border-2 border-dashed border-gray-300 rounded-lg justify-center items-center cursor-pointer p-4 bg-transparent ${
          isDragActive ? "bg-gray-100 bg-opacity-60" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <span className="mt-2 block text-sm font-medium text-gray-900 text-center">
          {isDragActive
            ? "Drop the file here"
            : existingDocument
            ? `Update existing base ${documentType}`
            : `Upload new base ${documentType}`}
        </span>
      </Card>
      <DocumentCreationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onDocumentCreated={onDocumentCreated}
        uploadedFile={uploadedFile}
        onSubmit={handleFormSubmit}
        documentType={documentType}
        initialCategory={category}
        existingDocument={existingDocument}
        isNewUpload={!existingDocument}
      />
    </>
  );
};

export default DocumentUploader;
