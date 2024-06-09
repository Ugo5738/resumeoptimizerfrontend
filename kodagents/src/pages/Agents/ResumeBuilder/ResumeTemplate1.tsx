// import React from "react";
// import styled from "styled-components";
// import { useLocation } from "react-router-dom";
// import { ResumeData, ExperienceEntry } from "../../../types/types";
// import "../../../styles/ResumeTemplate1.css";

// interface ResumeTemplateProps {
//   resumeData: ResumeData;
// }

// const P2 = styled.p`
//   font-size: 15px;
//   font-weight: bold;
// `;

// const P3 = styled.p`
//   font-size: 15px;
//   color: #2748ff;
// `;

// const P4 = styled.p`
//   font-size: 15px;
//   color: #0c0c0c;
// `;

// const P5 = styled.p`
//   font-size: 15px;
//   color: #e6e7ee;
// `;

// const P6 = styled.p`
//   font-size: 15px;
//   font-weight: bold;
//   color: #e6e7ee;
// `;

// const defaultResumeData: ResumeData = {
//   contact: {
//     name: '',
//     address: '',
//     phone: '',
//     email: '',
//     linkedIn: '',
//   },
//   summary: '',
//   experience: {},
//   education: [],
//   skills: [],
//   certifications: [],
//   references: [],
// };

// const ResumeTemplate1 = () => {
//   const location = useLocation();
//   const { resumeData = defaultResumeData } = location.state || {};

//   return (
//     <div className="resume-container">
//       <header className="resume-header">
//         <h1>{resumeData.contact.name}</h1>
//         <div className="contact-info">
//           <span>{resumeData.contact.address}</span> |
//           <span>{resumeData.contact.phone}</span> |
//           <span>{resumeData.contact.email}</span> |
//           <a
//             href={resumeData.contact.linkedIn}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             {resumeData.contact.linkedIn}
//           </a>
//         </div>
//       </header>
//       <section className="resume-summary">
//         <h2>SUMMARY</h2>
//         <P2>{resumeData.summary}</P2>
//       </section>
//       <section className="resume-experience">
//         <h2>EXPERIENCE</h2>
//         {Object.entries(resumeData.experience).map(
//           ([key, exp]: [string, ExperienceEntry], index) => (
//             <div key={index} className="experience-entry">
//               <P2>
//                 {exp.jobRole}{" "}
//                 <span>
//                   {exp.startDate} - {exp.endDate || "Present"}
//                 </span>
//               </P2>
//               <P3>{exp.companyName}</P3>
//               {exp.location && <P4>{exp.location}</P4>}
//               {Array.isArray(exp.jobDescription)
//                 ? exp.jobDescription.map((item, descIndex: number) => (
//                     <li key={descIndex}>{item}</li>
//                   ))
//                 : exp.jobDescription && <p>{exp.jobDescription}</p>}
//             </div>
//           )
//         )}
//       </section>
//       <section className="resume-education">
//         <h2>EDUCATION</h2>
//         {resumeData.education.map((edu, index) => (
//           <div key={index} className="education-entry">
//             <P2>
//               {edu.degree} <span>{edu.endDate}</span>
//             </P2>
//             <P3>{edu.institution}</P3>
//             <P4>{edu.location}</P4>
//             {edu.details && <P4>{edu.details}</P4>}
//           </div>
//         ))}
//       </section>
//       <div className="two-column">
//         <div className="column">
//           <section className="resume-skills">
//             <h2>SKILLS</h2>
//             <ul className="skills-list">
//               {resumeData.skills.map((skill, index) => (
//                 <li key={index}>
//                   <P5>{skill}</P5>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </div>
//         <div className="column">
//           <section className="resume-certifications">
//             <h2>CERTIFICATIONS</h2>
//             <div className="certification-list">
//               {resumeData.certifications.map((cert, index) => (
//                 <div key={index} className="certification-entry">
//                   <P6>{cert.title}</P6>
//                   <P5>{cert.issuingOrganization}</P5>
//                   <P5>{cert.dateObtained}</P5>
//                   {cert.validityPeriod && (
//                     <P5>Valid for: {cert.validityPeriod}</P5>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeTemplate1;
