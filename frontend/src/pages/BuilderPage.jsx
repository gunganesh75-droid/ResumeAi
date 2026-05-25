import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSave, FiCpu, FiEye, FiDownload, FiChevronDown, FiPlus, FiGrid, FiTrash2, FiEdit2 } from 'react-icons/fi';
import API from '../utils/api';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { ResumeTemplate } from '../components/ResumeTemplate';

const BuilderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState('personal');
  const [resumeName, setResumeName] = useState('Software Engineer Resume');
  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved', 'Saving...', 'Unsaved Changes'
  const [templateId, setTemplateId] = useState(1);


  const [resumeData, setResumeData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    jobTitle: 'Senior Software Engineer',
    location: 'New York, NY',
    github: 'github.com/johndoe',
    linkedin: 'linkedin.com/in/johndoe',
    summary: 'Results-oriented Senior Software Engineer with 5+ years of experience designing and building scalable web applications. Proficient in React, Node.js, and modern cloud architectures.',
    experience: [
      { id: 1, company: 'Tech Corp Inc.', role: 'Senior Software Engineer', date: 'Jan 2020 - Present', description: 'Led the frontend development of the core product using React, improving performance by 40%.\nMentored junior developers.' }
    ],
    education: [
      { id: 1, school: 'University of Technology', degree: 'B.S. Computer Science', date: '2015 - 2019', percentage: '85%' }
    ],
    skills: ['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    projects: [
      { id: 1, name: 'AI Resume Builder', link: 'github.com/johndoe/resume-builder', description: 'A modern SaaS application featuring interactive builder forms and instant PDF generation.' }
    ],
    certifications: ['AWS Certified Solutions Architect', 'Google Professional Cloud Developer'],
    achievements: ['Won First Place at TechCorp Hackathon 2022', 'Published tech article with 50k+ views'],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    interests: ['Open Source Contributing', 'Hiking & Mountaineering', 'Photography']
  });

  const isNewForce = searchParams.get('new') === 'true';

  useEffect(() => {
    if (resumeId) {
      const fetchResume = async () => {
        try {
          const res = await API.get(`/resumes/${resumeId}`);
          setResumeName(res.data.name);
          if (res.data.resumeData && Object.keys(res.data.resumeData).length > 0) {
            setResumeData(res.data.resumeData);
          }
          if (res.data.templateId) {
            setTemplateId(Number(res.data.templateId));
          }
          setSaveStatus('Saved');
        } catch (err) {
          toast.error('Failed to load resume from cloud');
        }
      };
      fetchResume();
    } else if (!isNewForce) {
      const fetchLatestResume = async () => {
        try {
          const res = await API.get('/resumes');
          if (res.data && res.data.length > 0) {
            const sorted = [...res.data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            const latest = sorted[0];
            setSearchParams({ id: latest.id });
          }
        } catch (err) {
          console.error('Failed to check for existing resumes:', err);
        }
      };
      fetchLatestResume();
    }
  }, [resumeId, isNewForce, setSearchParams]);

  const handleSave = async () => {
    setSaveStatus('Saving...');
    try {
      if (resumeId) {
        await API.put(`/resumes/${resumeId}`, {
          name: resumeName,
          templateId,
          resumeData
        });
        setSaveStatus('Saved');
        toast.success('Resume saved successfully!');
      } else {
        const res = await API.post('/resumes', {
          name: resumeName,
          templateId,
          resumeData
        });
        setSearchParams({ id: res.data.id });
        setSaveStatus('Saved');
        toast.success('Resume created and saved to cloud!');
      }
    } catch (err) {
      setSaveStatus('Unsaved Changes');
      toast.error('Cloud saving failed. Please retry.');
    }
  };



  // Debounced auto-save effect to keep database in sync in real-time
  useEffect(() => {
    if (saveStatus !== 'Unsaved Changes' || !resumeId) return;

    const timer = setTimeout(async () => {
      setSaveStatus('Saving...');
      try {
        await API.put(`/resumes/${resumeId}`, {
          name: resumeName,
          templateId,
          resumeData
        });
        setSaveStatus('Saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('Unsaved Changes');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [resumeData, resumeName, templateId, resumeId, saveStatus]);

  const handleGenerateSummary = async () => {
    if (!resumeData.jobTitle || resumeData.jobTitle.trim() === '') {
      toast.error('Please enter a Job Title in the Personal Info tab first!');
      setActiveTab('personal');
      return;
    }

    const loadingToast = toast.loading('AI is crafting a premium, professional summary...');
    try {
      const res = await API.post('/ai/generate', {
        tool: 'summary',
        inputs: {
          jobTitle: resumeData.jobTitle,
          industry: 'Professional Services',
          experienceLevel: resumeData.isFresher
            ? 'Fresher'
            : (resumeData.experience && resumeData.experience.length > 0
              ? String(resumeData.experience.length * 2)
              : '3'),
          maxLength: 400
        }
      });

      if (res.data && res.data.result) {
        const generatedSummary = res.data.result.trim();
        const trimmedSummary = generatedSummary.length > 400 ? generatedSummary.slice(0, 400).trim() : generatedSummary;

        setResumeData(prev => ({
          ...prev,
          summary: trimmedSummary
        }));
        setSaveStatus('Unsaved Changes');
        toast.success('AI summary generated successfully!', { id: loadingToast });
      } else {
        throw new Error('Missing result in API response');
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      toast.error('AI Service is currently busy. Please try again shortly.', { id: loadingToast });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
    setSaveStatus('Unsaved Changes');
  };

  const handleArrayChange = (category, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [category]: prev[category].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
    setSaveStatus('Unsaved Changes');
  };

  const addArrayItem = (category, defaultItem) => {
    setResumeData(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now(), ...defaultItem }]
    }));
    setSaveStatus('Unsaved Changes');
  };

  const removeArrayItem = (category, id) => {
    setResumeData(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
    setSaveStatus('Unsaved Changes');
  };

  const updateSkill = (index, value) => {
    const newSkills = [...resumeData.skills];
    newSkills[index] = value;
    setResumeData(prev => ({ ...prev, skills: newSkills }));
    setSaveStatus('Unsaved Changes');
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    setSaveStatus('Unsaved Changes');
  };

  const addSkill = () => {
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, 'New Skill'] }));
    setSaveStatus('Unsaved Changes');
  };

  // Helper methods for single-value arrays (Certifications, Achievements, Languages, Interests)
  const updateSingleValArray = (category, index, value) => {
    const newArr = [...resumeData[category]];
    newArr[index] = value;
    setResumeData(prev => ({ ...prev, [category]: newArr }));
    setSaveStatus('Unsaved Changes');
  };

  const addSingleValItem = (category, defaultValue = '') => {
    setResumeData(prev => ({ ...prev, [category]: [...prev[category], defaultValue] }));
    setSaveStatus('Unsaved Changes');
  };

  const removeSingleValItem = (category, index) => {
    setResumeData(prev => ({ ...prev, [category]: prev[category].filter((_, i) => i !== index) }));
    setSaveStatus('Unsaved Changes');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements (Optional)' },
    { id: 'languages', label: 'Languages' },
    { id: 'interests', label: 'Interests & Hobbies' },
  ];

  const renderResumeTemplate = (id) => {
    return <ResumeTemplate templateId={id} resumeData={resumeData} isPreview={true} />;
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] flex flex-col -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 bg-slate-100 dark:bg-slate-900 overflow-hidden" style={{height: 'calc(100dvh - 8rem)'}}>
      {/* Top Toolbar */}
      <div className="h-14 sm:h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-3 sm:px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="group flex items-center gap-1.5 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-primary-500 transition-colors">
            <input 
              type="text" 
              value={resumeName}
              onChange={(e) => {
                setResumeName(e.target.value);
                setSaveStatus('Unsaved Changes');
              }}
              className="text-lg font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none truncate max-w-[150px] sm:max-w-none"
              title="Click to rename your resume"
            />
            <FiEdit2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 opacity-60 group-hover:opacity-100 group-focus-within:text-primary-500 group-focus-within:opacity-100 transition-all" />
          </div>
          <button 
            onClick={handleSave}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              saveStatus === 'Saved' 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : saveStatus === 'Saving...'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 animate-pulse'
                : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 cursor-pointer hover:scale-105'
            }`}
            title="Click to save now"
          >
            <FiSave /> {saveStatus}
          </button>
        </div>
        <div className="flex items-center gap-3">
  
          <button 
            onClick={() => {
              if (resumeId) {
                navigate(`/templates?resumeId=${resumeId}`);
              } else {
                navigate('/templates');
              }
            }}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiGrid /> <span className="hidden sm:block">Template</span>
          </button>
          <button 
            onClick={() => {
              if (resumeId) {
                navigate(`/preview?id=${resumeId}`);
              } else {
                navigate('/preview');
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            <FiEye /> <span className="hidden sm:block">Preview</span>
          </button>
          <button 
            onClick={async () => {
              try {
                await handleSave();
                await API.post('/analytics/download');
                const element = document.getElementById('resume-pdf-target');
                if (element) {
                  const opt = {
                    margin:       0,
                    filename:     `${resumeData.firstName || 'Resume'}_${resumeData.lastName || ''}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                  };
                  html2pdf().set(opt).from(element).save();
                } else {
                  console.error('Could not generate PDF. Please try again.');
                }
              } catch (e) {
                console.error('Download failed', e);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
          >
            <FiDownload /> <span className="hidden sm:block">Download PDF</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Editor */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 relative z-0 shrink-0">
          
          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 custom-scrollbar shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto pb-20"
            >
              {activeTab === 'personal' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                      <input name="firstName" value={resumeData.firstName} onChange={handleChange} type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                      <input name="lastName" value={resumeData.lastName} onChange={handleChange} type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                      <input name="email" value={resumeData.email} onChange={handleChange} type="email" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                      <input name="phone" value={resumeData.phone} onChange={handleChange} type="tel" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                      <input name="jobTitle" value={resumeData.jobTitle} onChange={handleChange} type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                      <input name="location" value={resumeData.location} onChange={handleChange} type="text" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Profile URL</label>
                      <input name="github" value={resumeData.github || ''} onChange={handleChange} type="text" placeholder="github.com/username" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile URL</label>
                      <input name="linkedin" value={resumeData.linkedin || ''} onChange={handleChange} type="text" placeholder="linkedin.com/in/username" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Professional Summary</h2>
                    <button 
                      onClick={handleGenerateSummary}
                      type="button"
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
                    >
                      <FiCpu /> AI Generate
                    </button>
                  </div>
                  <div>
                    <textarea 
                      name="summary"
                      value={resumeData.summary}
                      onChange={handleChange}
                      rows="8" 
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white resize-none"
                    ></textarea>
                    <div className="text-right mt-2 text-xs text-slate-500">
                      {resumeData.summary.length} / 400 characters
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Experience</h2>
                      <p className="text-xs text-slate-505 dark:text-slate-400 mt-1">List your professional employment history or toggle fresher mode.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 select-none">
                      <span className="text-xs font-semibold text-slate-750 dark:text-slate-300">I am a fresher</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={resumeData.isFresher || false} 
                          onChange={(e) => {
                            setResumeData(prev => ({ ...prev, isFresher: e.target.checked }));
                            setSaveStatus('Unsaved Changes');
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  {resumeData.isFresher ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-br from-primary-50 to-primary-100/40 dark:from-primary-950/20 dark:to-primary-900/10 border border-primary-200 dark:border-primary-800/40 rounded-2xl text-center space-y-4 shadow-sm"
                    >
                      <div className="text-4xl">🎓</div>
                      <h4 className="text-base font-bold text-primary-800 dark:text-primary-400">Fresher Mode Enabled</h4>
                      <p className="text-xs text-primary-750 dark:text-primary-300 max-w-md mx-auto leading-relaxed">
                        Since you do not have work experience yet, we will automatically omit the work history section from your resume layouts.
                      </p>
                      <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
                        Your ATS score will be optimized based on your <strong>Academic/Personal Projects</strong>, <strong>Education</strong>, and <strong>Skills</strong>. Make sure these sections are fully completed to get a high rating!
                      </p>
                      <div className="pt-2">
                        <span className="inline-block text-[10px] uppercase tracking-wider font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-350 px-3 py-1 rounded-full">
                          Projects & Skills Weighted
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 relative">
                          <button onClick={() => removeArrayItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                            <FiTrash2 />
                          </button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                              <input type="text" value={exp.company} onChange={(e) => handleArrayChange('experience', exp.id, 'company', e.target.value)} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                              <input type="text" value={exp.role} onChange={(e) => handleArrayChange('experience', exp.id, 'role', e.target.value)} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Period</label>
                              <input type="text" value={exp.date} onChange={(e) => handleArrayChange('experience', exp.id, 'date', e.target.value)} placeholder="e.g. Jan 2020 - Present" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                              <textarea rows="4" value={exp.description} onChange={(e) => handleArrayChange('experience', exp.id, 'description', e.target.value)} className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white resize-none"></textarea>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addArrayItem('experience', { company: '', role: '', date: '', description: '' })} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <FiPlus /> Add Experience
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Education</h2>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 relative">
                      <button onClick={() => removeArrayItem('education', edu.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                        <FiTrash2 />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">School / University</label>
                          <input type="text" value={edu.school} onChange={(e) => handleArrayChange('education', edu.id, 'school', e.target.value)} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Degree</label>
                          <input type="text" value={edu.degree} onChange={(e) => handleArrayChange('education', edu.id, 'degree', e.target.value)} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Period</label>
                          <input type="text" value={edu.date} onChange={(e) => handleArrayChange('education', edu.id, 'date', e.target.value)} placeholder="e.g. 2015 - 2019" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Percentage / GPA</label>
                          <input type="text" value={edu.percentage || ''} onChange={(e) => handleArrayChange('education', edu.id, 'percentage', e.target.value)} placeholder="e.g. 85% or 3.8 GPA" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('education', { school: '', degree: '', date: '', percentage: '' })} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <FiPlus /> Add Education
                  </button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Skills</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="text" value={skill} onChange={(e) => updateSkill(index, e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        <button onClick={() => removeSkill(index)} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addSkill} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <FiPlus /> Add Skill
                  </button>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Projects</h2>
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 relative">
                      <button onClick={() => removeArrayItem('projects', proj.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                        <FiTrash2 />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                          <input type="text" value={proj.name} onChange={(e) => handleArrayChange('projects', proj.id, 'name', e.target.value)} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Link (Optional)</label>
                          <input type="text" value={proj.link} onChange={(e) => handleArrayChange('projects', proj.id, 'link', e.target.value)} placeholder="e.g. github.com/username/project" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                          <textarea rows="3" value={proj.description} onChange={(e) => handleArrayChange('projects', proj.id, 'description', e.target.value)} className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addArrayItem('projects', { name: '', link: '', description: '' })} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <FiPlus /> Add Project
                  </button>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Certifications</h2>
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="text" value={cert} onChange={(e) => updateSingleValArray('certifications', index, e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        <button onClick={() => removeSingleValItem('certifications', index)} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addSingleValItem('certifications', '')} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <FiPlus /> Add Certification
                  </button>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Achievements (Optional)</h2>
                  <div className="space-y-3">
                    {resumeData.achievements.map((ach, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="text" value={ach} onChange={(e) => updateSingleValArray('achievements', index, e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        <button onClick={() => removeSingleValItem('achievements', index)} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addSingleValItem('achievements', '')} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <FiPlus /> Add Achievement
                  </button>
                </div>
              )}

              {activeTab === 'languages' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Languages</h2>
                  <div className="space-y-3">
                    {resumeData.languages.map((lang, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="text" value={lang} onChange={(e) => updateSingleValArray('languages', index, e.target.value)} placeholder="e.g. English (Native)" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        <button onClick={() => removeSingleValItem('languages', index)} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addSingleValItem('languages', '')} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <FiPlus /> Add Language
                  </button>
                </div>
              )}

              {activeTab === 'interests' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Interests & Hobbies</h2>
                  <div className="space-y-3">
                    {resumeData.interests.map((interest, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="text" value={interest} onChange={(e) => updateSingleValArray('interests', index, e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white" />
                        <button onClick={() => removeSingleValItem('interests', index)} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addSingleValItem('interests', '')} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                    <FiPlus /> Add Interest / Hobby
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="hidden lg:flex flex-1 bg-slate-100 dark:bg-slate-900 p-8 justify-center items-start overflow-y-auto relative pb-20">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
             <button className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors border border-slate-200 dark:border-slate-700">
               <FiChevronDown className="w-5 h-5 transform rotate-180" />
             </button>
             <button className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors border border-slate-200 dark:border-slate-700">
               <FiChevronDown className="w-5 h-5" />
             </button>
          </div>

          <div id="resume-preview" className="bg-white">
            {renderResumeTemplate(templateId)}
          </div>
        </div>
      </div>

      {/* Hidden Offscreen Container for PDF Generation */}
      <div className="absolute -left-[9999px] top-0 pointer-events-none" style={{ width: '210mm' }}>
        <div id="resume-pdf-target" className="bg-white" style={{ width: '210mm' }}>
          {renderResumeTemplate(templateId)}
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
