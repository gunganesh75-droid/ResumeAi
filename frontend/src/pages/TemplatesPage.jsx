import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiStar } from 'react-icons/fi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

const TemplatesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('resumeId');

  const [activeCategory, setActiveCategory] = useState('All');

  const handleUseTemplate = async (templateId, templateName) => {
    try {
      if (resumeId) {
        // Update current resume templateId
        const res = await API.get(`/resumes/${resumeId}`);
        await API.put(`/resumes/${resumeId}`, {
          name: res.data.name,
          templateId: Number(templateId),
          resumeData: res.data.resumeData
        });
        toast.success(`Updated template to "${templateName}"!`);
        navigate(`/builder?id=${resumeId}`);
      } else {
        // Create new resume with templateId and default data
        const defaultData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1 234 567 890',
          jobTitle: 'Senior Software Engineer',
          location: 'New York, NY',
          summary: 'Results-oriented Senior Software Engineer with 5+ years of experience designing and building scalable web applications. Proficient in React, Node.js, and modern cloud architectures.',
          experience: [
            { id: 1, company: 'Tech Corp Inc.', role: 'Senior Software Engineer', date: 'Jan 2020 - Present', description: 'Led the frontend development of the core product using React, improving performance by 40%.\nMentored junior developers.' }
          ],
          education: [
            { id: 1, school: 'University of Technology', degree: 'B.S. Computer Science', date: '2015 - 2019' }
          ],
          skills: ['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
          projects: [
            { id: 1, name: 'AI Resume Builder', link: 'github.com/johndoe/resume-builder', description: 'A modern SaaS application featuring interactive builder forms and instant PDF generation.' }
          ],
          certifications: ['AWS Certified Solutions Architect', 'Google Professional Cloud Developer'],
          achievements: ['Won First Place at TechCorp Hackathon 2022'],
          languages: ['English (Native)', 'Spanish (Conversational)'],
          interests: ['Open Source Contributing', 'Hiking & Mountaineering']
        };

        const res = await API.post('/resumes', {
          name: `My ${templateName} Resume`,
          templateId: Number(templateId),
          resumeData: defaultData
        });
        toast.success(`Created new resume using "${templateName}"!`);
        navigate(`/builder?id=${res.data.id}`);
      }
    } catch (err) {
      console.error('Error applying template:', err);
      toast.error('Failed to apply template. Please try again.');
    }
  };

  const categories = ['All', 'ATS Friendly', 'Modern', 'Corporate', 'Minimal', 'Creative'];

  const templates = [
    { id: 1, name: 'The Executive', category: 'Corporate', isPopular: false },
    { id: 2, name: 'Creative Tech', category: 'Modern', isPopular: true },
    { id: 3, name: 'Clean ATS', category: 'ATS Friendly', isPopular: false },
    { id: 4, name: 'Minimalist', category: 'Minimal', isPopular: false },
    { id: 5, name: 'Designer Portfolio', category: 'Creative', isPopular: true },
    { id: 6, name: 'Startup', category: 'Modern', isPopular: false },
    { id: 7, name: 'Harvard Format', category: 'ATS Friendly', isPopular: false },
    { id: 8, name: 'Bold Colors', category: 'Creative', isPopular: true },
  ];

  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  // Realistic template preview generator based on ID
  const renderTemplateMockup = (id) => {
    switch (id) {
      case 1: // The Executive (Corporate)
        return (
          <div className="w-full h-full bg-white text-[6px] p-3 flex flex-col justify-between select-none">
            <div className="bg-slate-800 text-white p-2 rounded-t -mx-3 -mt-3 text-center">
              <div className="font-bold text-[8px] tracking-wide uppercase">JOHN DOE</div>
              <div className="text-[5px] text-slate-300">SENIOR SOFTWARE ENGINEER</div>
            </div>
            <div className="flex-1 mt-3 space-y-2">
              <div className="border-b border-slate-300 pb-1">
                <span className="font-bold text-slate-800 text-[6px] block uppercase">Professional Summary</span>
                <span className="text-slate-500 block leading-tight">Experienced developer specializing in frontend architectures and cloud integrations.</span>
              </div>
              <div className="border-b border-slate-300 pb-1">
                <span className="font-bold text-slate-800 text-[6px] block uppercase">Work History</span>
                <div className="flex justify-between font-bold text-slate-700 mt-1">
                  <span>Tech Corp Inc.</span>
                  <span>2020 - Present</span>
                </div>
                <span className="text-slate-500 block leading-tight">• Led React migration and improved load times by 40%.</span>
              </div>
            </div>
          </div>
        );

      case 2: // Creative Tech (Modern)
        return (
          <div className="w-full h-full bg-slate-50 text-[5px] p-3 flex select-none">
            {/* Left sidebar */}
            <div className="w-1/3 bg-indigo-900 text-indigo-100 p-2 -ml-3 -my-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-[8px] text-white leading-tight">JOHN</div>
                <div className="font-light text-[8px] text-white leading-tight -mt-1">DOE</div>
                <div className="text-[4px] text-indigo-300 mt-1">SOFTWARE DEV</div>
              </div>
              <div className="space-y-1.5 mt-4">
                <div>
                  <span className="font-bold text-[5px] text-white block">CONTACT</span>
                  <span className="text-[4px] text-indigo-200 block">john@example.com</span>
                </div>
                <div>
                  <span className="font-bold text-[5px] text-white block">SKILLS</span>
                  <span className="text-[4px] text-indigo-200 block">• React • Node.js</span>
                </div>
              </div>
            </div>
            {/* Right main */}
            <div className="flex-1 pl-3 space-y-3">
              <div>
                <span className="font-bold text-indigo-900 text-[6px] block uppercase tracking-wider">SUMMARY</span>
                <span className="text-slate-600 block leading-tight mt-0.5">Results-oriented engineer with 5+ years of scaling web apps and microservices.</span>
              </div>
              <div>
                <span className="font-bold text-indigo-900 text-[6px] block uppercase tracking-wider">EXPERIENCE</span>
                <div className="mt-1">
                  <span className="font-bold text-slate-800 block">Lead Architect @ Innovate</span>
                  <span className="text-slate-500 block">• Designed core multi-tenant dashboard.</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Clean ATS (ATS Friendly)
        return (
          <div className="w-full h-full bg-white text-[6px] p-4 flex flex-col gap-2.5 font-serif select-none">
            <div className="text-center">
              <h4 className="font-bold text-[9px] text-slate-900">John Doe</h4>
              <p className="text-slate-600 text-[4px]">New York, NY | john@example.com | +1 234 567 890</p>
            </div>
            <div className="space-y-2">
              <div>
                <h5 className="font-bold text-[6px] text-slate-800 border-b border-slate-400 pb-0.5 uppercase tracking-wide">Education</h5>
                <div className="flex justify-between text-slate-700 mt-1">
                  <span className="font-bold">B.S. in Computer Science</span>
                  <span>2015 - 2019</span>
                </div>
                <span className="text-slate-500 block italic">University of Technology</span>
              </div>
              <div>
                <h5 className="font-bold text-[6px] text-slate-800 border-b border-slate-400 pb-0.5 uppercase tracking-wide">Professional Experience</h5>
                <div className="flex justify-between text-slate-700 mt-1">
                  <span className="font-bold">Software Engineer - Tech Corp</span>
                  <span>2019 - Present</span>
                </div>
                <span className="text-slate-600 block mt-0.5">• Developed responsive React portals using Tailwind CSS.</span>
                <span className="text-slate-600 block">• Built APIs handling over 10,000 requests per minute.</span>
              </div>
            </div>
          </div>
        );

      case 4: // Minimalist (Minimal)
        return (
          <div className="w-full h-full bg-white text-[5px] p-4 flex flex-col justify-between font-sans border-t-[4px] border-slate-900 select-none">
            <div className="flex justify-between items-baseline mb-2">
              <div>
                <h4 className="font-bold text-[10px] text-slate-900 tracking-tight">John Doe</h4>
                <p className="text-slate-500 text-[5px]">Developer</p>
              </div>
              <p className="text-slate-400 text-[4px] text-right">john@example.com</p>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <span className="text-slate-400 text-[4.5px] uppercase tracking-widest block font-bold">Experience</span>
                <div className="mt-1">
                  <span className="text-slate-800 font-semibold block">Tech Corp</span>
                  <span className="text-slate-500 block">Developed high-quality interactive modern UI web modules.</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[4.5px] uppercase tracking-widest block font-bold">Skills</span>
                <p className="text-slate-600 mt-0.5">JavaScript, TypeScript, React.js, Tailwind CSS</p>
              </div>
            </div>
          </div>
        );

      case 5: // Designer Portfolio (Creative)
        return (
          <div className="w-full h-full bg-slate-900 text-slate-300 text-[5px] p-3 flex flex-col justify-between select-none">
            <div className="flex justify-between items-center bg-gradient-to-r from-rose-500 to-orange-500 p-2.5 rounded-lg -mx-1 -mt-1">
              <div>
                <h4 className="font-bold text-[9px] text-white tracking-wider">JOHN DOE</h4>
                <p className="text-[4px] text-white/80">UX ENGINEER & FRONTEND DEVELOPER</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white text-[6px] font-bold">JD</div>
            </div>
            <div className="flex-1 mt-3 space-y-2.5">
              <div>
                <span className="text-orange-400 font-bold block uppercase tracking-wider text-[5.5px]">Selected Work</span>
                <div className="mt-1 border-l-2 border-orange-500 pl-1.5">
                  <span className="text-white font-bold block">Design System Lead @ CreativeLab</span>
                  <span className="text-slate-400 block leading-tight">Built Figma-to-React automated tokens workflow.</span>
                </div>
              </div>
              <div>
                <span className="text-orange-400 font-bold block uppercase tracking-wider text-[5.5px]">Tech Stack</span>
                <span className="text-slate-200 block mt-0.5">React • Next.js • Framer Motion • Node • GraphQL</span>
              </div>
            </div>
          </div>
        );

      case 6: // Startup (Modern)
        return (
          <div className="w-full h-full bg-white text-[5px] p-3 flex flex-col justify-between font-sans select-none">
            <div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div>
                <h4 className="font-bold text-[9px] text-slate-800">John Doe</h4>
              </div>
              <p className="text-emerald-600 text-[5px] font-medium mt-0.5">Full Stack Dev @ Early Stage</p>
            </div>
            <div className="flex-1 mt-2.5 space-y-2">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[4.5px]">Key Accomplishments</span>
                <div className="mt-1">
                  <span className="text-slate-800 font-semibold block">Product Launch</span>
                  <span className="text-slate-600 block">Scaled pre-seed MVP from 0 to 10k monthly active users in 3 months.</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Harvard Format (ATS Friendly)
        return (
          <div className="w-full h-full bg-white text-[5px] p-4 flex flex-col gap-2 font-serif select-none border border-slate-300">
            <div className="text-center border-b border-slate-800 pb-1">
              <h4 className="font-bold text-[9px] text-slate-900 uppercase tracking-wider">JOHN DOE</h4>
              <p className="text-slate-600 text-[4px] uppercase tracking-widest mt-0.5">Cambridge, MA • (123) 456-7890 • jdoe@harvard.edu</p>
            </div>
            <div className="space-y-1.5">
              <div>
                <span className="font-bold text-slate-800 text-[5.5px] block uppercase border-b border-slate-300 mb-1">Education</span>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>HARVARD UNIVERSITY</span>
                  <span>Cambridge, MA</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Candidate for Bachelor of Arts in Computer Science</span>
                  <span>May 2021</span>
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-800 text-[5.5px] block uppercase border-b border-slate-300 mb-1">Professional Experience</span>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>TECH VENTURES</span>
                  <span>Software Dev Intern</span>
                </div>
                <span className="text-slate-600 block">• Programmed database migrations and secure REST services.</span>
              </div>
            </div>
          </div>
        );

      case 8: // Bold Colors (Creative)
        return (
          <div className="w-full h-full bg-slate-50 text-[5.5px] p-3 flex flex-col justify-between border-l-[6px] border-indigo-600 select-none">
            <div>
              <h4 className="font-black text-[11px] text-indigo-900 tracking-tighter uppercase leading-none">JOHN DOE</h4>
              <span className="inline-block bg-indigo-100 text-indigo-700 font-bold px-1 py-0.5 rounded text-[4.5px] mt-1">CREATIVE DEVELOPER</span>
            </div>
            <div className="flex-1 mt-3 space-y-2">
              <div>
                <span className="text-indigo-900 font-bold block uppercase text-[5px]">Core Strengths</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="bg-white px-1 py-0.5 rounded border border-slate-200">Creative Coding</span>
                  <span className="bg-white px-1 py-0.5 rounded border border-slate-200">GSAP</span>
                  <span className="bg-white px-1 py-0.5 rounded border border-slate-200">React Three Fiber</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Resume Template</h1>
        <p className="text-slate-600 dark:text-slate-400">All templates are ATS-friendly and designed by HR experts. Change your template anytime without losing your content.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex overflow-x-auto w-full md:w-auto hide-scrollbar gap-2 pb-2 md:pb-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTemplates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
          >
            {template.isPopular && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                <FiStar className="w-3 h-3 fill-current" /> POPULAR
              </div>
            )}
            
            <div className="aspect-[21/29.7] bg-slate-100 dark:bg-slate-900/60 p-3 relative overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
               {/* Realistic rendered template */}
               <div className="w-full h-full rounded shadow-sm overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-300">
                 {renderTemplateMockup(template.id)}
               </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-20">
                <button 
                  onClick={() => handleUseTemplate(template.id, template.name)}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs"
                >
                  Use Template
                </button>
                <button 
                  onClick={() => handleUseTemplate(template.id, template.name)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs"
                >
                  Preview
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{template.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{template.category}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
