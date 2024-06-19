import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";

const About = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <div className="text-lg text-gray-600 space-y-6 max-w-3xl">
          <p>
            Welcome to Resumeguru.pro, where we transform the job application process with cutting-edge AI technology. Our mission is to empower job seekers by providing an innovative tool that optimizes resumes and crafts tailored cover letters, ensuring they stand out in today's competitive job market.
          </p>
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p>
            Resumeguru.pro was born out of a personal challenge faced by our cofounder, an AI/ML engineer with a passion for technology and problem-solving. After applying to several jobs and receiving no responses, it became clear that a generic resume was not enough. The realization hit that each job application required a customized resume to truly reflect the candidate's fit for the role.
          </p>
          <p>
            Determined to find a solution, our cofounder decided to take matters into his own hands. Leveraging his expertise in AI and machine learning, he developed a tool that could optimize resumes and generate personalized cover letters based on specific job descriptions. Armed with this powerful tool, he began applying for jobs again. This time, the results were remarkable. He received multiple responses, including one from Twitter, and eventually landed his dream job (not Twitter).
          </p>
          <p>
            Encouraged by a friend who saw the potential to help others facing the same struggles, our cofounder decided to make this tool available to everyone. And thus, Resumeguru.pro was launched.
          </p>
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p>
            At Resumeguru.pro, our goal is to simplify and enhance the job application process. We believe that everyone deserves the opportunity to present their best self to potential employers. Our AI-powered platform provides personalized resume optimization and cover letter crafting, ensuring that your application not only gets noticed but also showcases your unique strengths and qualifications.
          </p>
          <h2 className="text-2xl font-semibold">Join Us on Our Journey</h2>
          <p>
            Join thousands of satisfied users who have transformed their job search experience with Resumeguru.pro. Let us help you unlock new career opportunities and achieve your professional dreams. With our innovative technology and personalized approach, we are here to support you every step of the way.
          </p>
          <h2 className="text-2xl font-semibold">Experience the Future of Job Applications</h2>
          <p>
            Discover the difference with Resumeguru.pro. Optimize your resume, craft compelling cover letters, and take your job applications to the next level. Experience the power of AI-driven job application tools and join our community of successful job seekers today.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
