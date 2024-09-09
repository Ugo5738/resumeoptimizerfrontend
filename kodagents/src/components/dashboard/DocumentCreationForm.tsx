import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

interface DocumentCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: () => void;
  uploadedFile: File | null;
  onSubmit: (category: string, file: File) => Promise<void>;
  documentType: "resume" | "cover_letter";
  initialCategory: string;
  existingDocument?: {
    id: string;
    file_url: string;
  };
  isNewUpload: boolean;
}

const DocumentCreationForm: React.FC<DocumentCreationFormProps> = ({
  isOpen,
  onClose,
  onDocumentCreated,
  uploadedFile,
  onSubmit,
  documentType,
  initialCategory,
  existingDocument,
  isNewUpload,
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [file, setFile] = useState<File | null>(null);
  const { checkUsageStatus } = useAuth();

  useEffect(() => {
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  }, [uploadedFile]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    try {
      await onSubmit(category, file);
      await checkUsageStatus();
      onDocumentCreated();
      onClose();
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingDocument ? "Update" : "Create"}{" "}
            {documentType === "resume" ? "Resume" : "Cover Letter"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                {existingDocument ? "Update" : "Upload"}{" "}
                {documentType === "resume" ? "Resume" : "Cover Letter"}
              </label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="file"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border-0 rounded-full shadow-sm text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Choose File
                </label>
                <span className="ml-3 text-sm text-gray-500">
                  {file ? file.name : "no file selected"}
                </span>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <Input
                type="text"
                id="category"
                value={category}
                onChange={handleCategoryChange}
                readOnly={!isNewUpload}
                className={`mt-1 block w-full ${
                  !isNewUpload ? "bg-gray-100" : ""
                }`}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || !category}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {existingDocument ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentCreationForm;
