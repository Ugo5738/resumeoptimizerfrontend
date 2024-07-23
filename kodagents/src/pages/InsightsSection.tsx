import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";
import { CustomizationInfo, InitialOptimization } from '../types/types';


interface InsightsSectionProps {
  initialOptimization: InitialOptimization | null;
  customizationHistory: CustomizationInfo[];
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ initialOptimization, customizationHistory }) => {
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(true);

  const toggleInsights = () => {
    setIsInsightsOpen(!isInsightsOpen);
  };

  const formatJobMatchScore = (score: number): number => {
    // If the score is already between 0-100, return it as is
    if (score >= 1 && score <= 100) {
      return score;
    }
    // If the score is a decimal between 0-1, multiply by 100
    if (score >= 0 && score <= 1) {
      return score * 100;
    }
    // For any other cases, return 0
    return 0;
  };

  return (
    <div className={`insights-section ${isInsightsOpen ? 'open' : 'closed'}`}>
      <div className="insights-header" onClick={toggleInsights}>
        <h3>Here is how we optimized your resume:</h3>
        <FaChevronDown className="chevron-icon" />
      </div>
      <div className="insights-content">
        {customizationHistory.map((customization: CustomizationInfo, index: number) => (
          <div key={index} className="insight-card">
            <h4>Customization {customizationHistory.length - index}:</h4>
            <ul className="list-disc pl-5">
              {customization.notes.map((note: string, i: number) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        ))}
        {initialOptimization && (
          <div className="insight-card">
            <h4>Initial Optimization:</h4>
            <h5>Job Match:</h5>
            <p>{formatJobMatchScore(initialOptimization.scores.job_match)}%</p>
            <h5>Key Changes:</h5>
            <ul>
              {initialOptimization.improvement_summary.key_changes.map((change: string, i: number) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
            <div>
              <h5>ATS Optimization:</h5>
              <p>{initialOptimization.improvement_summary.ats_optimization}</p>
            </div>
            <div>
              <h5>Tailoring to Job:</h5>
              <p>{initialOptimization.improvement_summary.tailoring_to_job}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsSection;
