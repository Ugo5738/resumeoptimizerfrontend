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