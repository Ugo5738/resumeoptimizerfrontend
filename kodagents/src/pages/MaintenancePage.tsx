import { AlertTriangle } from "lucide-react";
import React from "react";
import BackgroundDesign from "../components/layout/BackgroundDesign";

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-100">
      <BackgroundDesign />
      <main className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertTriangle className="mx-auto mb-4 text-yellow-500" size={48} />
          <h1 className="text-3xl font-bold mb-4">
            Site Undergoing Maintenance
          </h1>
          <p className="text-lg mb-6">
            We apologize for the inconvenience. Our website is currently down
            due to a surge in traffic and server maintenance.
          </p>
          <p className="text-lg mb-6">
            We're working hard to bring it back up as soon as possible. Thank
            you for your patience.
          </p>
          <p className="text-lg">
            For urgent matters, please contact us at:
            <a
              href="mailto:resumegurupro@gmail.com"
              className="text-blue-600 hover:underline ml-1"
            >
              resumegurupro@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default MaintenancePage;
