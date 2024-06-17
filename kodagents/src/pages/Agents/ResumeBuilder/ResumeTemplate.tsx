import { ResumeData, ExperienceEntry } from "../../../types/types";
import "../../../styles/ResumeTemplate.css";

interface ResumeTemplateProps {
  resumeData: ResumeData;
}

const ResumeTemplate = ({ resumeData }: ResumeTemplateProps) => {
  return (
    <div className="resume-container">
      <header className="resume-header">
        <h1>{resumeData.contact.name}</h1>
        <div className="contact-info">
          <span>{resumeData.contact.phone}</span> |
          <span>{resumeData.contact.email}</span> |
          <span>
            <a
              href={resumeData.contact.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resumeData.contact.linkedIn}
            </a>
          </span>
        </div>
      </header>
      <section className="resume-summary">
        <h2>SUMMARY</h2>
        <p>{resumeData.summary}</p>
      </section>
      <section className="resume-experience">
        <h2>EXPERIENCE</h2>
        {Object.entries(resumeData.experience).map(
          ([, exp]: [string, ExperienceEntry], index) => (
            <div key={index} className="experience-entry">
              <h3>{exp.jobRole}</h3>
              {exp.companyName && <p>{exp.companyName}</p>}
              <p>
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
              {Array.isArray(exp.jobDescription)
                ? exp.jobDescription.map((item, descIndex: number) => (
                    <p key={descIndex}>{item}</p>
                  ))
                : exp.jobDescription && <p>{exp.jobDescription}</p>}
              {exp.location && <p>{exp.location}</p>}
            </div>
          )
        )}
      </section>
      <section className="resume-education">
        <h2>EDUCATION</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="education-entry">
            <h3>{edu.degree}</h3>
            <p>{edu.institution}</p>
            <p>{edu.endDate}</p>
            <p>{edu.location}</p>
            {edu.details && <p>{edu.details}</p>}
          </div>
        ))}
      </section>
      <div className="two-column">
        <div className="column">
          <section className="resume-skills">
            <h2>SKILLS</h2>
            <ul className="skills-list">
              {resumeData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>
        </div>
        <div className="column">
          <section className="resume-certifications">
            <h2>CERTIFICATIONS</h2>
            <div className="certification-list">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="certification-entry">
                  <h3>{cert.title}</h3>
                  <p>{cert.issuingOrganization}</p>
                  <p>{cert.dateObtained}</p>
                  {cert.validityPeriod && (
                    <p>Valid for: {cert.validityPeriod}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="column">
          <section className="resume-references">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {resumeData.references.map((ref, index) => (
                <div key={index} className="reference-entry">
                  <p>{ref.refereeName}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
