import React, { useEffect, lazy, Suspense } from 'react';
import BackgroundDesign from '../components/layout/BackgroundDesign';
import Navbar from '../components/layout/Navbar';
import { trackEvent } from '../utils/analytics';

import '../styles/base.css';

const EditablePDFViewer = lazy(() => import('../components/layout/EditablePDFViewer'));

const Result: React.FC = () => {
  useEffect(() => {
    trackEvent('Page View', 'Result');
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <main className="flex-1 flex">
        <div className="w-full h-full">
        <Suspense fallback={<div>Loading...</div>}>
            <EditablePDFViewer />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Result;