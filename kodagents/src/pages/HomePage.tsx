import React from 'react';
import BackgroundDesign from "../components/layout/BackgroundDesign";
import MainContent from "../components/layout/MainContent";
import Navbar from "../components/layout/Navbar";
import PromotionalBanner from "../components/layout/PromotionalBanner";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundDesign />
      <Navbar />
      <main className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="max-w-2xl w-full">
          <PromotionalBanner />
          <MainContent />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
