import React from "react";
import { useNavigate } from "react-router-dom";

// Mockup data for template previews. In real application, you might fetch these from a backend.
const templates = [
  { id: 1, name: "Classic", thumbnail: "/path-to-classic-thumbnail.jpg" },
  { id: 2, name: "Modern", thumbnail: "/path-to-modern-thumbnail.jpg" },
  { id: 3, name: "Creative", thumbnail: "/path-to-creative-thumbnail.jpg" },
  // Add more templates as needed
];

const TemplateSelection: React.FC = () => {
  const navigate = useNavigate();

  // const handleTemplateSelect = () => {
  //   navigate("/preview", { state: { resumeData: sampleResumeData } });
  // };

  const handleTemplateSelect = (templateId: number) => {
    // Navigate to the resume form and pass the selected templateId
    navigate("/resume-form", { state: { templateId } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-8">
        Select a Resume Template
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {templates.map((template) => (
          <div key={template.id} className="template-selection">
            <img
              src={template.thumbnail}
              alt={`Template ${template.name}`}
              className="mb-4 max-w-xs mx-auto"
            />
            <button
              onClick={() => handleTemplateSelect(template.id)}
              className="rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Choose {template.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;
