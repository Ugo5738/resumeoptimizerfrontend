import { Link } from "react-router-dom";

const MainContent = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Transform Your Resume with AI Precision
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Experience the smartest AI-driven resume optimization tool.
        Resumeguru.pro leverages leading artificial intelligence to automate
        every aspect of creating a hirable resume—editing, formatting, and
        optimizing. Tailor your resume to perfection and stand out in today's
        competitive job market.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to="/dashboard"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Optimize my resume
        </Link>
      </div>
    </div>
  );
};

export default MainContent;
