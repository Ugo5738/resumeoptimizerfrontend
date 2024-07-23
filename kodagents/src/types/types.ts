// types.ts
export interface Contact {
  name: string;
  address: string;
  phone: string;
  email: string;
  linkedIn?: string;
}

export interface ExperienceEntry {
  companyName?: string;
  jobRole: string;
  startDate: string;
  endDate?: string;
  location?: string;
  jobDescription: string[] | string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  endDate: string;
  location: string;
  details?: string;
}

export interface Certification {
  title: string;
  issuingOrganization: string;
  dateObtained: string;
  validityPeriod?: string;
}

export interface Reference {
  refereeName: string;
}

export interface ResumeData {
  contact: Contact;
  summary: string;
  experience: {
    [key: string]: ExperienceEntry;
  };
  education: EducationEntry[];
  skills: string[];
  certifications: Certification[];
  references: Reference[];
}

// insights section
export interface ImprovementSummary {
  key_changes: string[];
  ats_optimization: string;
  tailoring_to_job: string;
}

export interface Scores {
  job_match: number;
  interview_potential: number;
}

export interface InitialOptimization {
  improvement_summary: ImprovementSummary;
  scores: Scores;
}

export interface CustomizationInfo {
  notes: string[];
  effectiveness_impact: number;
}
