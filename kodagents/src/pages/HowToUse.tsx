import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";

const HowToUse = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4">How to Use Resumeguru.pro</h1>
        <div className="text-lg text-gray-600 space-y-6 max-w-3xl">
          <p>
            Welcome to Resumeguru.pro! Our platform is designed to make your job application process seamless and effective. Follow these simple steps to optimize your resume and craft personalized cover letters to your dream job with ease.
          </p>
          <h2 className="text-2xl font-semibold">Step 1: Upload Your Resume</h2>
          <p>
            Upload your existing resume in PDF or Word format. Our AI will analyze your resume.
          </p>
          <h2 className="text-2xl font-semibold">Step 2: Input Job Details</h2>
          <p>
            Once your resume is uploaded, you'll be redirected to the next page to input the job details. Enter the job title, job description, or requirements for the job you’re applying for. Click "Next" to proceed.
          </p>
          <h2 className="text-2xl font-semibold">Step 3: Click Optimize</h2>
          <p>
            Review the entered job details and your uploaded resume. Click the "Optimize" button to start the optimization process. This includes formatting, keyword optimization, and tailoring your resume to match specific job descriptions.
          </p>
          <h2 className="text-2xl font-semibold">Step 4: View Basic Optimization</h2>
          <p>
            After the optimization process, you'll see buttons to preview your documents. Click on the "Preview Resume" and "Preview Cover Letter" buttons to view the basic optimized versions as PDFs.
          </p>
          <h2 className="text-2xl font-semibold">Step 5: Download Optimized Documents</h2>
          <p>
            Once you are satisfied with the optimized versions, you can download your optimized resume and cover letter as PDF files.
          </p>
          <h2 className="text-2xl font-semibold">Additional Tips</h2>
          <p>
            - Regularly update your resume with new skills and experiences.
            <br />
            - Tailor your resume and cover letter for each job application.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HowToUse;
