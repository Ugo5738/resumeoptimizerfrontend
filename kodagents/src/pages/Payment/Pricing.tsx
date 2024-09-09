import PageLayout from "../../components/layout/PageLayout";

const Pricing = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Pricing</h2>
        <div className="text-lg text-gray-600 space-y-6 max-w-3xl">
          <p>
            At Resumeguru.pro, we offer competitive and flexible pricing plans
            to suit your needs. Whether you're a job seeker looking for basic
            optimization or a professional in need of comprehensive application
            support, we have a plan for you.
          </p>
          <h2 className="text-2xl font-semibold">Our Pricing Plans</h2>
          <ul className="list-disc list-inside space-y-4">
            <li>
              <strong>Free Trial</strong>
              <p>Includes one optimised resume and one crafted cover.</p>
            </li>
            <li>
              <strong>Standard Plan - $9.99/month</strong>
              <p>
                Includes resume formatting, keyword optimization, and cover
                letter generation for up to 20 job applications per month.
              </p>
            </li>
          </ul>
          <h2 className="text-2xl font-semibold">Why Choose Resumeguru.pro?</h2>
          <p>
            Our AI-powered platform not only optimizes your resume and cover
            letter but also helps you stand out in a crowded job market. With
            our user-friendly interface and tailored features, you can apply for
            jobs with confidence, knowing that your application materials are
            polished and professional.
          </p>
          <p>
            Upgrade your plan at any time and unlock additional features
            designed to enhance your job search experience. Join Resumeguru.pro
            today and take the next step towards your career goals.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
