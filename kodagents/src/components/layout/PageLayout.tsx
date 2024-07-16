import React from 'react';
import BackgroundDesign from "./BackgroundDesign";
import Navbar from "./Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <BackgroundDesign />
      <Navbar />
      <main className="flex-1 pt-24 px-4 md:px-8">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
