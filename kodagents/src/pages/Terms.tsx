import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";

const Terms = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4">Terms Of Use</h1>
        <div className="text-lg text-gray-600 space-y-6 max-w-3xl">
          <p>
            Welcome to Resumeguru.pro! These terms and conditions outline the rules and regulations for the use of our website and services.
          </p>
          <h3 className="text-2xl font-semibold">1. Introduction</h3>
          <p>
            By accessing or using Resumeguru.pro, you agree to comply with and be bound by these terms and conditions. If you disagree with any part of these terms, please do not use our website or services.
          </p>
          <h3 className="text-2xl font-semibold">2. Services</h3>
          <p>
            Resumeguru.pro provides an AI-powered resume optimization and cover letter crafting tool. We strive to enhance your job application process by offering personalized recommendations and professional templates.
          </p>
          <h3 className="text-xl font-semibold">3. User Accounts</h3>
          <p>
            3.1. To access certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process.
          </p>
          <p>
            3.2. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
          <p>
            3.3. We reserve the right to suspend or terminate your account if any information provided during the registration process or thereafter proves to be inaccurate, false, or misleading.
          </p>
          <h3 className="text-xl font-semibold">4. Use of Services</h3>
          <p>
            4.1. You agree to use our services only for lawful purposes and in accordance with these terms and conditions.
          </p>
          <p>
            4.2. You shall not use our services in any manner that could damage, disable, overburden, or impair our website or interfere with any other party's use of our services.
          </p>
          <p>
            4.3. You shall not attempt to gain unauthorized access to any portion or feature of our website or any other systems or networks connected to our website.
          </p>
          <h3 className="text-xl font-semibold">5. Payment and Subscription</h3>
          <p>
            5.1. Some features of Resumeguru.pro may require payment. By selecting a paid service, you agree to pay Resumeguru.pro the specified fees.
          </p>
          <p>
            5.2. Payments are billed on a subscription basis. You will be billed in advance on a recurring, periodic basis (e.g., monthly or annually) unless you cancel your subscription.
          </p>
          <p>
            5.3. You can cancel your subscription at any time through your account settings. Upon cancellation, you will continue to have access to the service until the end of your current billing period.
          </p>
          <h3 className="text-xl font-semibold">6. Intellectual Property</h3>
          <p>
            6.1. The content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are the exclusive property of Resumeguru.pro and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            6.2. You are granted a limited, non-exclusive, non-transferable, and revocable license to access and use our services for personal, non-commercial purposes.
          </p>
          <h3 className="text-xl font-semibold">7. Limitation of Liability</h3>
          <p>
            7.1. Resumeguru.pro will not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of our services.
          </p>
          <p>
            7.2. In no event shall Resumeguru.pro's liability exceed the amount paid by you for the services.
          </p>
          <h3 className="text-xl font-semibold">8. Disclaimer of Warranties</h3>
          <p>
            8.1. Our services are provided on an "as is" and "as available" basis. Resumeguru.pro makes no warranties, whether express or implied, regarding the operation or availability of our services.
          </p>
          <p>
            8.2. Resumeguru.pro does not guarantee that our services will be uninterrupted, secure, or free from errors or viruses.
          </p>
          <h3 className="text-xl font-semibold">9. Changes to Terms</h3>
          <p>
            9.1. We reserve the right to modify these terms and conditions at any time. Any changes will be effective immediately upon posting on our website.
          </p>
          <p>
            9.2. Your continued use of our services after any such changes constitutes your acceptance of the new terms and conditions.
          </p>
          <h3 className="text-xl font-semibold">10. Governing Law</h3>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Malaysia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
          <h3 className="text-xl font-semibold">11. Contact Us</h3>
          <p>
            If you have any questions about these terms and conditions, please contact us at:
            Resumeguru.pro
          </p>
        </div>
      </main>
    </div>
  );
};

export default Terms;
