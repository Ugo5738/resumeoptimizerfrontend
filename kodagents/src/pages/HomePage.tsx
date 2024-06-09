import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import PromotionalBanner from "../components/layout/PromotionalBanner";
import MainContent from "../components/layout/MainContent";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <BackgroundDesign />
      <div className="flex-grow flex justify-center items-center p-6 lg:px-8">
        <div className="relative w-full max-w-2xl">
          <PromotionalBanner />
          <MainContent />
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  );
}
