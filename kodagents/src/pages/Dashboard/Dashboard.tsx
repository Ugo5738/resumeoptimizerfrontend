import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DocumentPreview from "../../components/dashboard/DocumentPreview";
import DocumentUploader from "../../components/dashboard/DocumentUploader";
import axiosInstance from "../../utils/axiosConfig";

interface DocumentGroup {
  original: Document;
  optimized: OptimizedDocument | null;
}

interface Document {
  id: string;
  category: string;
  file_url: string;
  document_type: string;
  uploaded_at: string;
}

interface OptimizedDocument {
  id: string;
  pdf_url: string;
  docx_url: string;
  document_type: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "cover_letter">(
    "resume"
  );
  const [documentGroups, setDocumentGroups] = useState<
    Record<string, DocumentGroup>
  >({});

  useEffect(() => {
    fetchDocuments();
  }, [activeTab]);

  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/resume/get-documents/?document_type=${activeTab}`
      );
      setDocumentGroups(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDeleteOriginal = async (id: string, category: string) => {
    try {
      await axiosInstance.delete(`/api/resume/delete-original/${id}/`);
      const updatedGroups = { ...documentGroups };
      delete updatedGroups[category];
      setDocumentGroups(updatedGroups);
    } catch (error) {
      console.error("Error deleting original document:", error);
    }
  };

  const handleDeleteOptimized = async (id: string, category: string) => {
    try {
      await axiosInstance.delete(`/api/resume/delete-optimized/${id}/`);
      const updatedGroups = { ...documentGroups };
      if (updatedGroups[category]) {
        updatedGroups[category].optimized = null;
      }
      setDocumentGroups(updatedGroups);
    } catch (error) {
      console.error("Error deleting optimized document:", error);
    }
  };

  const handlePreview = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const renderOptimizedDocument = (group: DocumentGroup, category: string) => {
    if (!group.optimized) return null;

    return (
      <DocumentPreview
        category={category}
        fileUrl={group.optimized.pdf_url}
        isOriginal={false}
        documentType={activeTab}
        onPreview={() => handlePreview(group.optimized!.pdf_url)}
        onReview={() => {
          /* Implement review functionality */
        }}
        onDelete={() => handleDeleteOptimized(group.optimized!.id, category)}
        pdfUrl={group.optimized.pdf_url}
        docxUrl={group.optimized.docx_url}
      />
    );
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-8">
        {Object.entries(documentGroups).map(([category, group]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-lg font-semibold">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <DocumentUploader
                onDocumentCreated={fetchDocuments}
                documentType={activeTab}
                category={category}
                existingDocument={
                  group.original
                    ? {
                        id: group.original.id,
                        file_url: group.original.file_url,
                      }
                    : undefined
                }
              />
              {group.original && (
                <DocumentPreview
                  category={category}
                  fileUrl={group.original.file_url}
                  isOriginal={true}
                  documentType={activeTab}
                  onPreview={() => handlePreview(group.original.file_url)}
                  onReview={() => {
                    /* Implement review functionality */
                  }}
                  onDelete={() =>
                    handleDeleteOriginal(group.original.id, category)
                  }
                />
              )}
              {renderOptimizedDocument(group, category)}
            </div>
          </div>
        ))}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Create New Group</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <DocumentUploader
              onDocumentCreated={fetchDocuments}
              documentType={activeTab}
              category=""
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
