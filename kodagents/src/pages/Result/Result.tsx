import React, { Suspense, lazy, useEffect } from "react";
import BackgroundDesign from "../../components/layout/BackgroundDesign";
import Navbar from "../../components/layout/Navbar";
import { trackEvent } from "../../utils/analytics";

import "../../styles/base.css";

const EditablePDFViewer = lazy(() => import("./EditablePDFViewer"));

const Result: React.FC = () => {
  useEffect(() => {
    trackEvent("Page View", "Result");
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <BackgroundDesign />
      <Navbar />
      <main className="flex-grow overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <EditablePDFViewer />
        </Suspense>
      </main>
    </div>
  );
};

export default Result;
