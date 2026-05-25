import React from 'react';

/**
 * Renders contact items with perfect baseline alignment and equal margin separators.
 * Supports email, phone, location, github, and linkedin.
 */
const renderContactHeader = (email, phone, location, github, linkedin) => {
  const parts = [
    email && { label: email, href: null },
    phone && { label: phone, href: null },
    location && { label: location, href: null },
    github && { label: github, href: `https://${github.replace(/^https?:\/\//, '')}` },
    linkedin && { label: linkedin, href: `https://${linkedin.replace(/^https?:\/\//, '')}` },
  ].filter(Boolean);
  return (
    <div className="flex justify-center items-center flex-wrap gap-y-1 mt-3 text-[11px] text-slate-500 font-sans">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part.href ? (
            <a href={part.href} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">{part.label}</a>
          ) : (
            <span className="font-medium">{part.label}</span>
          )}
          {index < parts.length - 1 && <span className="mx-3 text-slate-400 font-bold">•</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ResumeTemplate = ({ templateId, resumeData, isPreview = false }) => {
  const templateNum = Number(templateId) || 1;
  const skills = resumeData.skills || [];
  const experience = resumeData.experience || [];
  const education = resumeData.education || [];
  const projects = resumeData.projects || [];
  const certifications = resumeData.certifications || [];
  const achievements = resumeData.achievements || [];
  const languages = resumeData.languages || [];
  const interests = resumeData.interests || [];

  // Consistent margin padding styles for standard A4
  const containerClass = `w-full max-w-[21cm] min-h-[29.7cm] bg-white flex flex-col p-10 sm:p-12 transition-all mx-auto shrink-0 text-slate-800 font-sans ${
    isPreview ? 'shadow-xl border border-slate-200' : 'print-full border border-slate-200'
  }`;

  switch (templateNum) {
    case 1: // The Executive (Corporate)
      return (
        <div className={containerClass}>
          {/* Header Section */}
          <div className="bg-slate-800 text-white p-6 rounded-t -mx-10 sm:-mx-12 -mt-10 sm:-mt-12 text-center mb-6">
            <h1 className="text-2xl font-bold tracking-wide uppercase leading-tight">
              {resumeData.firstName} {resumeData.lastName}
            </h1>
            <p className="text-[11px] text-slate-300 mt-1.5 uppercase tracking-wider font-semibold">
              {resumeData.jobTitle}
            </p>
            <div className="flex justify-center items-center flex-wrap gap-y-1 mt-3 text-[11px] text-slate-400">
              {[
                resumeData.email, resumeData.phone, resumeData.location,
                resumeData.github, resumeData.linkedin
              ].filter(Boolean).map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span>{part}</span>
                  {idx < arr.length - 1 && <span className="mx-3 text-slate-500 font-bold">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-800 border-b-2 border-slate-800 pb-[6px] mb-[12px] uppercase tracking-wider">
                Professional Summary
              </h2>
              <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap text-justify">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {!resumeData.isFresher && experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-800 border-b-2 border-slate-800 pb-[6px] mb-[12px] uppercase tracking-wider">
                Work History
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-bold text-slate-800 text-[12px]">{exp.company}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">—</span>
                        <p className="italic text-[11px] text-slate-500">{exp.role}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{exp.date}</span>
                    </div>
                    {exp.description && (
                      <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1 leading-relaxed text-justify">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-800 border-b-2 border-slate-800 pb-[6px] mb-[12px] uppercase tracking-wider">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-bold text-slate-800 text-[12px]">{edu.school}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">—</span>
                        <p className="italic text-[11px] text-slate-500">{edu.degree}{edu.percentage && ` (${edu.percentage})`}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{edu.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-800 border-b-2 border-slate-800 pb-[6px] mb-[12px] uppercase tracking-wider">
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-center flex-wrap gap-x-2">
                        <h3 className="font-bold text-slate-800 text-[12px]">{proj.name}</h3>
                        {proj.link && (
                          <>
                            <span className="text-[11px] text-slate-400">•</span>
                            <a
                              href={`https://${proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary-600 hover:underline"
                            >
                              {proj.link}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[11px] text-slate-600 leading-relaxed text-justify">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-800 border-b-2 border-slate-800 pb-[6px] mb-[12px] uppercase tracking-wider">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => skill && (
                  <span
                    key={index}
                    className="text-[11px] text-slate-700 font-medium bg-slate-100 px-3 py-1 rounded border border-slate-200/60 inline-flex items-center justify-center leading-none h-[22px] whitespace-nowrap"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Grid Layout (Certifications, Achievements, Languages, Interests) */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-6 pt-4 border-t border-slate-200">
            <div className="space-y-6">
              {certifications.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-800 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Certifications
                  </h2>
                  <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1">
                    {certifications.map((cert, index) => cert && (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
              {achievements.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-800 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Achievements
                  </h2>
                  <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1">
                    {achievements.map((ach, index) => ach && (
                      <li key={index}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {languages.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-800 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang, index) => lang && (
                      <span
                        key={index}
                        className="text-[11px] bg-slate-50 border border-slate-200 px-3 py-1 rounded font-medium text-slate-700 h-[22px] inline-flex items-center justify-center leading-none"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {interests.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-800 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Interests & Hobbies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => interest && (
                      <span
                        key={index}
                        className="text-[11px] text-slate-600 bg-slate-100/50 px-3 py-1 rounded inline-flex items-center justify-center h-[22px] leading-none border border-slate-200/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 2: // Creative Tech (Modern sidebar)
      return (
        <div className={`w-full max-w-[21cm] min-h-[29.7cm] bg-white flex transition-all mx-auto shrink-0 border border-slate-200 text-slate-800 font-sans ${isPreview ? 'shadow-xl' : 'print-full'}`}>
          {/* Left Column (Sidebar) */}
          <div className="w-[6.8cm] bg-indigo-900 text-indigo-100 p-8 flex flex-col justify-between shrink-0">
            <div>
              <h1 className="text-xl font-extrabold text-white uppercase leading-none tracking-tight">
                {resumeData.firstName}<br />
                <span className="font-light text-indigo-200">{resumeData.lastName}</span>
              </h1>
              <p className="text-[11px] text-indigo-300 mt-2 uppercase tracking-widest font-bold leading-normal">
                {resumeData.jobTitle}
              </p>
              
              <div className="space-y-6 mt-8 border-t border-indigo-800 pt-6">
                <div>
                  <h2 className="text-[12px] font-bold text-white uppercase tracking-wider border-b border-indigo-800 pb-1.5 mb-2.5">
                    Contact
                  </h2>
                  <div className="space-y-1.5 text-[11px] text-indigo-200 leading-relaxed break-all">
                    {resumeData.email && <p className="hover:text-white transition-colors">{resumeData.email}</p>}
                    {resumeData.phone && <p>{resumeData.phone}</p>}
                    {resumeData.location && <p>{resumeData.location}</p>}
                    {resumeData.github && <a href={`https://${resumeData.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">{resumeData.github}</a>}
                    {resumeData.linkedin && <a href={`https://${resumeData.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">{resumeData.linkedin}</a>}
                  </div>
                </div>
                
                {skills.length > 0 && (
                  <div>
                    <h2 className="text-[12px] font-bold text-white uppercase tracking-wider border-b border-indigo-800 pb-1.5 mb-2.5">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, i) => skill && (
                        <span
                          key={i}
                          className="bg-indigo-950/40 text-indigo-200 px-2 py-0.5 rounded border border-indigo-850 text-[10px] font-medium whitespace-nowrap h-[20px] inline-flex items-center justify-center leading-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {languages.length > 0 && (
                  <div>
                    <h2 className="text-[12px] font-bold text-white uppercase tracking-wider border-b border-indigo-800 pb-1.5 mb-2.5">
                      Languages
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {languages.map((lang, i) => lang && (
                        <span
                          key={i}
                          className="text-[10px] bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-850 text-indigo-100 font-medium whitespace-nowrap h-[20px] inline-flex items-center justify-center leading-none"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-[9px] text-indigo-400 mt-6 pt-4 border-t border-indigo-800 leading-none">
              Created with ResumeAI
            </div>
          </div>

          {/* Right Column (Main Content) */}
          <div className="flex-1 p-8 sm:p-10 space-y-6">
            {resumeData.summary && (
              <div>
                <h2 className="text-[12px] font-bold text-indigo-900 border-b border-indigo-100 pb-[6px] mb-[12px] uppercase tracking-wider">
                  About Me
                </h2>
                <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap text-justify">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {!resumeData.isFresher && experience.length > 0 && (
              <div>
                <h2 className="text-[12px] font-bold text-indigo-900 border-b border-indigo-100 pb-[6px] mb-[12px] uppercase tracking-wider">
                  Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <h3 className="font-bold text-slate-800 text-[12px]">{exp.company}</h3>
                          <span className="text-[11px] text-slate-400 font-medium">—</span>
                          <p className="italic text-[11px] text-slate-500">{exp.role}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{exp.date}</span>
                      </div>
                      {exp.description && (
                        <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1 leading-relaxed text-justify">
                          {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2 className="text-[12px] font-bold text-indigo-900 border-b border-indigo-100 pb-[6px] mb-[12px] uppercase tracking-wider">
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <h3 className="font-bold text-slate-808 text-[12px]">{edu.school}</h3>
                          <span className="text-[11px] text-slate-400 font-medium">—</span>
                          <p className="italic text-[11px] text-slate-500">{edu.degree}{edu.percentage && ` (${edu.percentage})`}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{edu.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div>
                <h2 className="text-[12px] font-bold text-indigo-900 border-b border-indigo-100 pb-[6px] mb-[12px] uppercase tracking-wider">
                  Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <div className="flex items-center flex-wrap gap-x-2">
                          <h3 className="font-bold text-slate-800 text-[12px]">{proj.name}</h3>
                          {proj.link && (
                            <>
                              <span className="text-[11px] text-slate-400">•</span>
                              <a
                                href={`https://${proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-indigo-600 hover:underline"
                              >
                                {proj.link}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                      {proj.description && (
                        <p className="text-[11px] text-slate-600 leading-relaxed text-justify">{proj.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 3: // Clean ATS (ATS Friendly - Serif Format)
      return (
        <div className={`w-full max-w-[21cm] min-h-[29.7cm] bg-white flex flex-col p-10 sm:p-12 transition-all mx-auto shrink-0 text-slate-800 font-serif ${isPreview ? 'shadow-xl border border-slate-200' : 'print-full border border-slate-200'}`}>
          {/* Header Section */}
          <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase leading-none">
              {resumeData.firstName} {resumeData.lastName}
            </h1>
            <p className="text-sm text-primary-700 font-semibold mt-2 tracking-wide font-sans">
              {resumeData.jobTitle}
            </p>
            <div className="flex justify-center items-center flex-wrap gap-y-1 mt-3 text-[11px] text-slate-600 font-sans">
              {[
                resumeData.email, resumeData.phone, resumeData.location,
                resumeData.github, resumeData.linkedin
              ].filter(Boolean).map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span>{part}</span>
                  {idx < arr.length - 1 && <span className="mx-3 text-slate-400 font-bold">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-950 border-b border-slate-400 pb-[4px] mb-[10px] uppercase tracking-wider font-sans">
                Professional Summary
              </h2>
              <p className="text-[11.5px] text-slate-700 leading-relaxed whitespace-pre-wrap text-justify">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {!resumeData.isFresher && experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-950 border-b border-slate-400 pb-[4px] mb-[10px] uppercase tracking-wider font-sans">
                Experience
              </h2>
              <div className="space-y-4 font-sans text-slate-800">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1 font-serif">
                    <div className="flex justify-between items-baseline font-sans">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-bold text-slate-808 text-[12px]">{exp.company}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">—</span>
                        <p className="italic text-[11px] text-slate-500">{exp.role}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{exp.date}</span>
                    </div>
                    {exp.description && (
                      <ul className="list-disc pl-5 text-[11px] text-slate-650 space-y-1 leading-relaxed text-justify">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-955 border-b border-slate-400 pb-[4px] mb-[10px] uppercase tracking-wider font-sans">
                Education
              </h2>
              <div className="space-y-3 font-serif">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-sans">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-bold text-slate-808 text-[12px]">{edu.school}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">—</span>
                        <p className="italic text-[11px] text-slate-500">{edu.degree}{edu.percentage && ` (${edu.percentage})`}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{edu.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-955 border-b border-slate-400 pb-[4px] mb-[10px] uppercase tracking-wider font-sans">
                Projects
              </h2>
              <div className="space-y-3 font-serif">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline font-sans">
                      <div className="flex items-center flex-wrap gap-x-2">
                        <h3 className="font-bold text-slate-808 text-[12px]">{proj.name}</h3>
                        {proj.link && (
                          <>
                            <span className="text-[11px] text-slate-400">•</span>
                            <a
                              href={`https://${proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary-700 hover:underline"
                            >
                              {proj.link}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[12px] font-bold text-slate-955 border-b border-slate-400 pb-[4px] mb-[10px] uppercase tracking-wider font-sans">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 font-sans">
                {skills.map((skill, index) => skill && (
                  <span
                    key={index}
                    className="text-[11px] text-slate-700 font-medium bg-slate-100 px-3 py-1 rounded border border-slate-200/60 inline-flex items-center justify-center leading-none h-[22px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Grid Layout */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-6 pt-4 border-t border-slate-200 font-sans">
            <div className="space-y-6">
              {certifications.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-900 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Certifications
                  </h2>
                  <ul className="list-disc pl-5 text-[11px] text-slate-700 space-y-1 font-serif">
                    {certifications.map((cert, index) => cert && (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
              {achievements.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-900 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Achievements
                  </h2>
                  <ul className="list-disc pl-5 text-[11px] text-slate-700 space-y-1 font-serif">
                    {achievements.map((ach, index) => ach && (
                      <li key={index}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-6">
              {languages.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-900 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang, index) => lang && (
                      <span
                        key={index}
                        className="text-[11px] bg-slate-50 border border-slate-200 px-3 py-1 rounded font-medium text-slate-700 h-[22px] inline-flex items-center justify-center leading-none"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {interests.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-bold text-slate-900 border-b border-slate-300 pb-[6px] mb-[12px] uppercase tracking-wider">
                    Interests & Hobbies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => interest && (
                      <span
                        key={index}
                        className="text-[11px] text-slate-655 bg-slate-100/50 px-3 py-1 rounded border border-slate-200/30 h-[22px] inline-flex items-center justify-center leading-none"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 4: // Minimalist (Minimal)
      return (
        <div className={`w-full max-w-[21cm] min-h-[29.7cm] bg-white flex flex-col p-10 sm:p-12 transition-all mx-auto shrink-0 text-slate-800 font-sans border-t-[8px] border-slate-900 ${isPreview ? 'shadow-xl' : 'print-full'}`}>
          {/* Header Section */}
          <div className="flex justify-between items-baseline border-b border-slate-100 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                {resumeData.firstName} {resumeData.lastName}
              </h1>
              <p className="text-[11px] text-slate-500 font-bold mt-1.5 tracking-wider uppercase">
                {resumeData.jobTitle}
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-400 space-y-0.5 font-sans leading-normal">
              {resumeData.email && <p className="hover:text-slate-900 transition-colors">{resumeData.email}</p>}
              {resumeData.phone && <p>{resumeData.phone}</p>}
              {resumeData.location && <p>{resumeData.location}</p>}
              {resumeData.github && <p>{resumeData.github}</p>}
              {resumeData.linkedin && <p>{resumeData.linkedin}</p>}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-1.5">
                Overview
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap text-justify">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {!resumeData.isFresher && experience.length > 0 && (
            <div className="mb-5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-2.5">
                Work History
              </span>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-800 text-[12px]">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span>{exp.company}</span>
                        <span className="text-slate-400 font-normal">—</span>
                        <span className="font-normal italic text-slate-500 text-[11px]">{exp.role}</span>
                      </div>
                      <span className="font-normal text-[11px] text-slate-400 whitespace-nowrap">{exp.date}</span>
                    </div>
                    {exp.description && (
                      <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1 leading-relaxed text-justify">
                        {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-2.5">
                Education
              </span>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-[12px]">
                    <div className="flex flex-wrap items-baseline gap-x-2 font-bold text-slate-800">
                      <span>{edu.school}</span>
                      <span className="text-slate-400 font-normal">—</span>
                      <span className="font-normal italic text-slate-500 text-[11px]">{edu.degree}{edu.percentage && ` (${edu.percentage})`}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap font-sans">{edu.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-1.5">
                Skills
              </span>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {skills.filter(Boolean).join('  •  ')}
              </p>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-2.5">
                Featured Projects
              </span>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-center flex-wrap gap-x-2">
                        <span className="font-bold text-slate-800 text-[12px]">{proj.name}</span>
                        {proj.link && (
                          <>
                            <span className="text-[11px] text-slate-400">•</span>
                            <a
                              href={`https://${proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline"
                            >
                              {proj.link}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[11px] text-slate-600 leading-relaxed text-justify">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Grid Layout */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6 pt-4 border-t border-slate-100">
            {certifications.length > 0 && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-1.5">
                  Certifications
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {certifications.filter(Boolean).join(', ')}
                </p>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold mb-1.5">
                  Languages
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {languages.filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case 5: // Designer Portfolio (Creative)
      return (
        <div className={`w-full max-w-[21cm] min-h-[29.7cm] bg-slate-950 text-slate-350 flex flex-col p-10 sm:p-12 transition-all mx-auto shrink-0 text-xs font-sans border border-slate-900 ${isPreview ? 'shadow-2xl' : 'print-full'}`}>
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-2xl -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6">
            <div>
              <h1 className="font-black text-2xl text-white tracking-wider uppercase leading-none">
                {resumeData.firstName} {resumeData.lastName}
              </h1>
              <p className="text-[10px] text-white/95 uppercase font-bold mt-2 tracking-widest">
                {resumeData.jobTitle}
              </p>
              <div className="flex flex-wrap items-center gap-y-1 mt-3 text-[10px] text-white/80">
                {[
                  resumeData.email, resumeData.phone, resumeData.location,
                  resumeData.github, resumeData.linkedin
                ].filter(Boolean).map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span>{part}</span>
                    {idx < arr.length - 1 && <span className="mx-2 text-white/60 font-semibold">•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-md font-bold shrink-0">
              {resumeData.firstName ? resumeData.firstName[0] : ''}{resumeData.lastName ? resumeData.lastName[0] : ''}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-5">
              <h2 className="text-purple-400 font-bold uppercase tracking-wider mb-2 text-xs border-b border-slate-900 pb-[6px]">
                About Me
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-justify text-[11.5px]">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {!resumeData.isFresher && experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-purple-400 font-bold uppercase tracking-wider mb-3 text-xs border-b border-slate-900 pb-[6px]">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-purple-500/80 pl-4 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-bold text-white text-[12px]">{exp.company}</h3>
                        <span className="text-[11px] text-slate-600 font-medium">—</span>
                        <p className="italic text-[11px] text-slate-400">{exp.role}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">{exp.date}</span>
                    </div>
                    {exp.description && (
                      <p className="text-[11.5px] text-slate-300 leading-relaxed text-justify whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-purple-400 font-bold uppercase tracking-wider mb-2 text-xs border-b border-slate-900 pb-[6px]">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => skill && (
                  <span
                    key={index}
                    className="bg-purple-950/40 text-purple-300 border border-purple-900/40 px-3 py-1 rounded text-[10px] font-medium whitespace-nowrap h-[22px] inline-flex items-center leading-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-purple-400 font-bold uppercase tracking-wider mb-3 text-xs border-b border-slate-900 pb-[6px]">
                Projects
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-[12px] leading-tight mb-1">{proj.name}</h3>
                      {proj.link && (
                        <a
                          href={`https://${proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-purple-400 hover:underline block mb-2 truncate"
                        >
                          {proj.link}
                        </a>
                      )}
                      {proj.description && (
                        <p className="text-[11px] text-slate-400 leading-normal text-justify">{proj.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case 6: // Startup (Modern)
      return (
        <div className={`w-full max-w-[21cm] min-h-[29.7cm] bg-white flex flex-col p-10 sm:p-12 transition-all mx-auto shrink-0 text-slate-800 font-sans border border-slate-200 ${isPreview ? 'shadow-xl' : 'print-full'}`}>
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-emerald-500 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-sm shrink-0"></div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  {resumeData.firstName} {resumeData.lastName}
                </h1>
              </div>
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-2">
                {resumeData.jobTitle}
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 space-y-0.5 font-sans leading-normal">
              {resumeData.email && <p className="hover:text-slate-900 transition-colors">{resumeData.email}</p>}
              {resumeData.phone && <p>{resumeData.phone}</p>}
              {resumeData.location && <p>{resumeData.location}</p>}
              {resumeData.github && <p>{resumeData.github}</p>}
              {resumeData.linkedin && <p>{resumeData.linkedin}</p>}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <span className="text-[10px] text-emerald-600 block uppercase tracking-widest font-black mb-1.5">
                Summary
              </span>
              <p className="text-[11px] text-slate-655 leading-relaxed whitespace-pre-wrap text-justify">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {!resumeData.isFresher && experience.length > 0 && (
            <div className="mb-6">
              <span className="text-[10px] text-emerald-600 block uppercase tracking-widest font-black mb-2.5">
                Experience
              </span>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-bold text-slate-800 text-[12px]">{exp.company}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">—</span>
                        <p className="italic text-[11px] text-slate-500">{exp.role}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{exp.date}</span>
                    </div>
                    {exp.description && (
                      <ul className="list-disc pl-5 text-[11px] text-slate-655 space-y-1 leading-relaxed text-justify">
                        {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <span className="text-[10px] text-emerald-600 block uppercase tracking-widest font-black mb-2.5">
                Projects
              </span>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-center flex-wrap gap-x-2">
                        <h3 className="font-bold text-slate-800 text-[12px]">{proj.name}</h3>
                        {proj.link && (
                          <>
                            <span className="text-[11px] text-slate-400">•</span>
                            <a
                              href={`https://${proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline"
                            >
                              {proj.link}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[11px] text-slate-655 leading-relaxed text-justify">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <span className="text-[10px] text-emerald-600 block uppercase tracking-widest font-black mb-1.5">
                Technical Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => skill && (
                  <span
                    key={index}
                    className="text-[11px] text-slate-800 bg-emerald-50 px-3 py-1 rounded font-medium border border-emerald-100 h-[22px] inline-flex items-center leading-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case 7: // Harvard Format (ATS Friendly)
      return (
        <div className={`w-full max-w-[21cm] min-h-[29.7cm] bg-white flex flex-col p-10 sm:p-12 transition-all mx-auto shrink-0 text-slate-800 font-serif border border-slate-200 ${isPreview ? 'shadow-xl' : 'print-full'}`}>
          {/* Header */}
          <div className="text-center border-b border-slate-800 pb-3 mb-6">
            <h1 className="text-[22px] font-bold text-slate-900 tracking-wider uppercase leading-none">
              {resumeData.firstName} {resumeData.lastName}
            </h1>
            <div className="flex justify-center items-center flex-wrap gap-y-1 mt-3 text-[11px] text-slate-600 font-sans tracking-wide">
              {[
                resumeData.location, resumeData.email, resumeData.phone,
                resumeData.github, resumeData.linkedin
              ].filter(Boolean).map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span>{part}</span>
                  {idx < arr.length - 1 && <span className="mx-2.5 text-slate-400 font-bold">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-[4px] mb-[10px] font-sans">
                Objective
              </h2>
              <p className="text-[11.5px] text-slate-750 leading-relaxed text-justify">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-[4px] mb-[10px] font-sans">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-[12px] text-slate-850">
                      <span>{edu.school.toUpperCase()}</span>
                      <span className="font-normal font-sans text-[11px] text-slate-600">{edu.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 italic leading-tight">
                      <span>{edu.degree}{edu.percentage && ` (${edu.percentage})`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {!resumeData.isFresher && experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-[4px] mb-[10px] font-sans">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-[12px] text-slate-850">
                      <span>{exp.company.toUpperCase()}</span>
                      <span className="font-normal font-sans text-[11px] text-slate-600 whitespace-nowrap">{exp.date}</span>
                    </div>
                    <p className="italic text-[11px] text-slate-550 leading-tight">{exp.role}</p>
                    {exp.description && (
                      <ul className="list-disc pl-5 text-[11px] text-slate-650 space-y-1 leading-relaxed text-justify">
                        {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-[4px] mb-[10px] font-sans">
                Key Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-[12px] text-slate-850">
                      <div className="flex items-center flex-wrap gap-x-2">
                        <span>{proj.name.toUpperCase()}</span>
                        {proj.link && (
                          <>
                            <span className="text-[11px] text-slate-400 font-normal">•</span>
                            <a
                              href={`https://${proj.link.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary-700 hover:underline font-normal font-sans truncate"
                            >
                              {proj.link}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-[11.5px] text-slate-650 leading-relaxed text-justify">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Hobbies */}
          {skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-[4px] mb-[10px] font-sans">
                Skills & Interests
              </h2>
              <div className="space-y-1.5 text-[11.5px] text-slate-650 leading-normal">
                <p>
                  <span className="font-bold text-slate-800">Skills:</span> {skills.filter(Boolean).join(', ')}
                </p>
                {interests.length > 0 && (
                  <p>
                    <span className="font-bold text-slate-800">Interests:</span> {interests.filter(Boolean).join(', ')}
                  </p>
                )}
                {languages.length > 0 && (
                  <p>
                    <span className="font-bold text-slate-800">Languages:</span> {languages.filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      );

    case 8: // Bold Colors (Creative)
      return (
        <div className={`w-full max-w-[21cm] min-h-[29.7cm] bg-white flex flex-col p-10 sm:p-12 transition-all mx-auto shrink-0 border-l-[12px] border-indigo-600 border-t border-r border-b border-slate-200 text-slate-800 font-sans ${isPreview ? 'shadow-xl' : 'print-full'}`}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-indigo-950 tracking-tighter uppercase leading-none">
              {resumeData.firstName} {resumeData.lastName}
            </h1>
            <span className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-md text-[10px] mt-2.5 tracking-wider uppercase">
              {resumeData.jobTitle}
            </span>
            <div className="flex flex-wrap items-center gap-y-1 mt-3 border-b border-slate-100 pb-3 text-[11px] text-slate-500 font-medium">
              {[
                resumeData.email, resumeData.phone, resumeData.location,
                resumeData.github, resumeData.linkedin
              ].filter(Boolean).map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span>{part}</span>
                  {idx < arr.length - 1 && <span className="mx-2.5 text-slate-350 font-bold">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest mb-[12px] border-b border-indigo-100 pb-[6px]">
                Summary
              </h2>
              <p className="text-[11px] text-slate-655 leading-relaxed whitespace-pre-wrap text-justify">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {!resumeData.isFresher && experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest mb-[12px] border-b border-indigo-100 pb-[6px]">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="font-bold text-indigo-950 text-[12px]">{exp.company}</h3>
                        <span className="text-[11px] text-slate-400 font-medium">—</span>
                        <p className="italic text-[11px] text-indigo-650">{exp.role}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{exp.date}</span>
                    </div>
                    {exp.description && (
                      <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1 leading-relaxed text-justify">
                        {exp.description.split('\n').filter(l => l.trim()).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest mb-[12px] border-b border-indigo-100 pb-[6px]">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => skill && (
                  <span
                    key={index}
                    className="bg-white border border-slate-200 px-3 py-1 rounded text-[11px] text-slate-700 font-semibold shadow-sm hover:border-indigo-200 transition-colors h-[22px] inline-flex items-center leading-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="p-8 text-center bg-white border rounded-xl text-slate-500 font-sans">
          No design selected. Please choose a template.
        </div>
      );
  }
};
