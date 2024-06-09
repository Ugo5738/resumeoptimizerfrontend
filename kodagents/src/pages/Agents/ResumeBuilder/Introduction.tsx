import { useNavigate } from "react-router-dom";

const Introduction = () => {
  const navigate = useNavigate();

  const handleOptionSelect = (option: "build" | "view") => {
    if (option === "build") {
      navigate("/template-selection");
    } else {
      // Navigate to view resume page
      navigate("/view-resume"); // Placeholder - replace with actual route
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Hi, I'm Rez
      </h1>
      <p className="mt-4 text-xl text-gray-600">
        What would you like me to help you with?
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => handleOptionSelect("build")}
          className="rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Build a resume for a job
        </button>
        <button
          onClick={() => handleOptionSelect("view")}
          className="rounded-md border border-indigo-600 px-4 py-2 text-lg font-semibold text-indigo-600 hover:bg-indigo-50"
        >
          View my resume
        </button>
      </div>
    </div>
  );
};

export default Introduction;
