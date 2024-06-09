import { ResumeData } from "../../../types/types";

export const sampleResumeData: ResumeData = {
  contact: {
    name: "SARAH JOHNSON",
    address: "Seattle, Washington",
    phone: "+1-555-123-4567",
    email: "sjohnsonnurse@example.com",
    linkedIn: "https://www.linkedin.com/in/sarah-johnson-rn",
  },
  summary:
    "Highly experienced and strategic Registered Nurse with over 10 years of clinical experience, including 5+ years in leadership roles focused on inpatient care. Proven track record in enhancing patient care, streamlining department operations, and leading healthcare teams towards excellence. Eager to contribute to AMCE's mission by bringing a culture of clinical excellence and patient-centered care to a diverse patient population.",
  experience: {
    experience_1: {
      companyName: "Seattle General Hospital",
      jobRole: "Registered Nurse",
      startDate: "June 2019",
      endDate: "Present",
      location: "Seattle, Washington",
      jobDescription: [
        "Oversee patient care delivery in a high-traffic emergency department, developing and executing strategies to reduce wait times and enhance service quality.",
        "Spearhead a comprehensive review and overhaul of patient triage protocol, resulting in a 30% leap in departmental efficiency and patient throughput.",
        "Pioneer patient education initiatives to tackle chronic disease management, yielding a significant improvement in patient compliance and outcomes.",
      ],
    },
    experience_2: {
      jobRole: "Staff Nurse",
      startDate: "January 2017",
      endDate: "June 2019",
      jobDescription:
        "Managed and coordinated end-to-end patient care for various medical cases within a 30-bed inpatient unit, consistently scoring high on patient satisfaction metrics.",
    },
    experience_3: {
      jobRole: "Community Health Nurse",
      startDate: "July 2015",
      endDate: "December 2016",
      jobDescription:
        "Executed primary care services and health education for underserved communities, with an emphasis on preventative care and wellness.",
    },
  },
  education: [
    {
      institution: "University of Washington",
      degree: "Master of Science in Nursing (MSN)",
      endDate: "June 2015",
      location: "Seattle, Washington",
      details: "Focused on Healthcare Leadership and Management",
    },
  ],
  skills: [
    "Clinical Management",
    "Team Leadership",
    "Strategic Planning",
    "Patient Education",
    "Quality Assurance",
    "Healthcare Regulation Compliance",
    "Interdisciplinary Collaboration",
    "Health Informatics",
    "Patient Advocacy",
    "Mentorship Programs",
  ],
  certifications: [
    {
      title: "Certified Emergency Nurse (CEN)",
      issuingOrganization: "Institute of Michigan",
      dateObtained: "August 2016",
    },
    {
      title: "Trauma Nursing Core Course (TNCC)",
      issuingOrganization: "Institute of Michigan",
      dateObtained: "March 2018",
      validityPeriod: "4 years",
    },
    {
      title: "Pediatric Advanced Life Support (PALS)",
      issuingOrganization: "Institute of Michigan",
      dateObtained: "May 2017",
      validityPeriod: "2 years",
    },
    {
      title: "Registered Nurse (RN) License, State of Washington",
      issuingOrganization: "Institute of Michigan",
      dateObtained: "June 2015",
    },
  ],
  references: [
    {
      refereeName: "Available upon request.",
    },
  ],
};
