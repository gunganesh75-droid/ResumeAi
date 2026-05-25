import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../utils/api';
import toast from 'react-hot-toast';

// Dictionary of popular tech skills and their demand percentages
const SKILL_DEMAND_MAP = {
  'react': 95,
  'react.js': 95,
  'reactjs': 95,
  'node': 88,
  'node.js': 88,
  'nodejs': 88,
  'typescript': 92,
  'ts': 92,
  'graphql': 70,
  'aws': 85,
  'aws cloud': 85,
  'javascript': 90,
  'js': 90,
  'python': 89,
  'sql': 83,
  'mysql': 80,
  'postgresql': 82,
  'mongodb': 78,
  'docker': 86,
  'kubernetes': 84,
  'vue': 75,
  'vue.js': 75,
  'vuejs': 75,
  'angular': 72,
  'next.js': 89,
  'nextjs': 89,
  'tailwind': 80,
  'tailwind css': 80,
  'tailwindcss': 80,
  'html': 60,
  'css': 60,
  'git': 85,
  'java': 82,
  'spring boot': 78,
  'c++': 70,
  'c#': 74,
  'devops': 87,
  'go': 81,
  'golang': 81,
  'rust': 79
};

const getSkillDemand = (skillName) => {
  if (!skillName) return 75;
  const key = skillName.trim().toLowerCase();
  if (SKILL_DEMAND_MAP[key] !== undefined) {
    return SKILL_DEMAND_MAP[key];
  }
  // Deterministic fallback based on string characters
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const min = 65;
  const max = 94;
  return min + (Math.abs(hash) % (max - min + 1));
};

const calculateAtsScore = (resumeData) => {
  if (!resumeData) return 0;
  
  let score = 0;

  // 1. Personal contact info (Max 20)
  if (resumeData.firstName && resumeData.lastName) score += 5;
  if (resumeData.email) score += 5;
  if (resumeData.phone) score += 5;
  if (resumeData.location) score += 5;

  // 2. Summary (Max 15)
  if (resumeData.summary) {
    score += 5;
    const len = resumeData.summary.trim().length;
    if (len > 50) score += 5;
    if (len > 150) score += 5;
  }

  // 3. Work history / Fresher Projects (Max 20)
  if (resumeData.isFresher) {
    const projects = resumeData.projects || [];
    if (projects.length > 0) {
      score += 5;
      if (projects.length >= 2) score += 5;
      
      const allHaveDesc = projects.every(proj => proj.description && proj.description.trim().length > 0);
      if (allHaveDesc) score += 5;

      const avgDescLen = projects.reduce((acc, proj) => acc + (proj.description ? proj.description.length : 0), 0) / projects.length;
      if (avgDescLen > 50) score += 5;
    }
  } else {
    const experience = resumeData.experience || [];
    if (experience.length > 0) {
      score += 5;
      if (experience.length >= 2) score += 5;
      
      const allHaveDesc = experience.every(exp => exp.description && exp.description.trim().length > 0);
      if (allHaveDesc) score += 5;

      const avgDescLen = experience.reduce((acc, exp) => acc + (exp.description ? exp.description.length : 0), 0) / experience.length;
      if (avgDescLen > 100) score += 5;
    }
  }

  // 4. Education (Max 15)
  const education = resumeData.education || [];
  if (education.length > 0) {
    score += 10;
    const hasDetails = education.some(edu => edu.school && edu.degree);
    if (hasDetails) score += 5;
  }

  // 5. Skills (Max 15)
  const skills = resumeData.skills || [];
  const validSkills = skills.filter(s => s && s.trim().length > 0);
  if (validSkills.length > 0) {
    score += 5;
    if (validSkills.length >= 3) score += 5;
    if (validSkills.length >= 6) score += 5;
  }

  // 6. Projects and Certifications (Max 15)
  const projects = resumeData.projects || [];
  const certs = resumeData.certifications || [];
  if (projects.length > 0) {
    score += 5;
    if (projects.length >= 2) score += 5;
  }
  if (certs.length > 0 && certs.some(c => c && c.trim().length > 0)) {
    score += 5;
  }

  return Math.min(100, score);
};

const getImprovementSuggestions = (resumeData) => {
  if (!resumeData) return [];

  const suggestions = [];

  // 1. Contact Details
  if (!resumeData.email || resumeData.email.trim() === '') {
    suggestions.push({
      category: 'Contact Info',
      text: 'Add your professional email address',
      impact: 'High',
      tip: 'Recruiters and automated parsers need a reliable email to send invitations.'
    });
  }
  if (!resumeData.phone || resumeData.phone.trim() === '') {
    suggestions.push({
      category: 'Contact Info',
      text: 'Include a contact phone number',
      impact: 'High',
      tip: 'Ensure recruiters can reach you easily for phone screens.'
    });
  }
  if (!resumeData.location || resumeData.location.trim() === '') {
    suggestions.push({
      category: 'Contact Info',
      text: 'Provide your location (City, State/Country)',
      impact: 'Medium',
      tip: 'Many ATS systems filter resumes by regional parameters.'
    });
  }

  // 2. Professional Summary
  if (!resumeData.summary || resumeData.summary.trim().length === 0) {
    suggestions.push({
      category: 'Summary',
      text: 'Write a professional summary statement',
      impact: 'Medium',
      tip: 'A strong 3-4 sentence paragraph highlighting your core value sets the stage.'
    });
  } else {
    const len = resumeData.summary.trim().length;
    if (len < 100) {
      suggestions.push({
        category: 'Summary',
        text: 'Expand your professional summary',
        impact: 'Low',
        tip: 'Aim for at least 150-250 characters to capture key experience milestones and industry vocabulary.'
      });
    }
  }

  // 3. Work Experience / Fresher Projects
  if (resumeData.isFresher) {
    const projects = resumeData.projects || [];
    if (projects.length === 0) {
      suggestions.push({
        category: 'Projects',
        text: 'Add academic or personal projects',
        impact: 'Critical',
        tip: 'As a fresher, academic or personal projects are vital to demonstrate your technical capabilities. Add at least 2 high-quality projects.'
      });
    } else {
      if (projects.length < 2) {
        suggestions.push({
          category: 'Projects',
          text: 'List at least 2 projects',
          impact: 'High',
          tip: 'Having multiple projects shows a wider range of skills and stronger practical experience.'
        });
      }
      
      const missingDesc = projects.some(proj => !proj.description || proj.description.trim().length === 0);
      if (missingDesc) {
        suggestions.push({
          category: 'Projects',
          text: 'Add detailed descriptions for all projects',
          impact: 'Critical',
          tip: 'Explain the goals, technologies used, and your individual achievements for each project.'
        });
      }
    }
  } else {
    const experience = resumeData.experience || [];
    if (experience.length === 0) {
      suggestions.push({
        category: 'Experience',
        text: 'Add your professional work history',
        impact: 'Critical',
        tip: 'A blank work history is a red flag. Outline past roles, dates, and companies.'
      });
    } else {
      if (experience.length < 2) {
        suggestions.push({
          category: 'Experience',
          text: 'List more than one employment history role',
          impact: 'Medium',
          tip: 'Multiple items show a consistent career progression pattern.'
        });
      }
      
      const missingDesc = experience.some(exp => !exp.description || exp.description.trim().length === 0);
      if (missingDesc) {
        suggestions.push({
          category: 'Experience',
          text: 'Add impact descriptions for all work roles',
          impact: 'Critical',
          tip: 'Explain your achievements and actions, using metrics where possible, rather than just stating responsibilities.'
        });
      }
    }
  }

  // 4. Education
  const education = resumeData.education || [];
  if (education.length === 0) {
    suggestions.push({
      category: 'Education',
      text: 'Add your educational qualifications',
      impact: 'High',
      tip: 'Many academic/industry roles require specific degree levels or programs.'
    });
  }

  // 5. Skills
  const skills = resumeData.skills || [];
  const validSkills = skills.filter(s => s && s.trim().length > 0);
  if (validSkills.length === 0) {
    suggestions.push({
      category: 'Skills',
      text: 'Add key technical/professional skills',
      impact: 'Critical',
      tip: 'ATS parsers match skills directly against the job requirements. Add at least 6 key skills.'
    });
  } else if (validSkills.length < 6) {
    suggestions.push({
      category: 'Skills',
      text: 'List at least 6 technical skills',
      impact: 'Medium',
      tip: 'Expand your keywords listing so parsers have a wider variety of query matches.'
    });
  }

  // 6. Projects and Certifications
  const projects = resumeData.projects || [];
  const certs = resumeData.certifications || [];
  if (!resumeData.isFresher && projects.length === 0) {
    suggestions.push({
      category: 'Projects',
      text: 'Include professional or personal projects',
      impact: 'Low',
      tip: 'Projects show hand-on knowledge application, especially if you have employment gaps.'
    });
  }
  if (certs.length === 0 || !certs.some(c => c && c.trim().length > 0)) {
    suggestions.push({
      category: 'Certifications',
      text: 'Highlight industry certifications or courses',
      impact: 'Low',
      tip: 'Adding credentials increases candidate authority and indicates ongoing training.'
    });
  }

  return suggestions;
};

const fallbackSkills = [
  { skill: 'React.js', demand: 95 },
  { skill: 'TypeScript', demand: 92 },
  { skill: 'Node.js', demand: 88 },
  { skill: 'AWS Cloud', demand: 85 },
  { skill: 'GraphQL', demand: 70 }
];

const scanStyles = `
@keyframes scanLine {
  0% { transform: translateY(0); opacity: 0.3; }
  50% { opacity: 1; }
  100% { transform: translateY(220px); opacity: 0.3; }
}
.animate-scan {
  animation: scanLine 2s infinite ease-in-out;
}
`;

const AnalyticsPage = () => {
  const [stats, setStats] = useState({ resumesCreated: 0, downloads: 0, views: 0 });
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(() => localStorage.getItem('analyticsActiveResumeId') || '');
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Gemini AI Analysis states
  const [aiScore, setAiScore] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiSkillsDemand, setAiSkillsDemand] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('Awaiting resume selection');

  // Synchronize selection to localStorage
  useEffect(() => {
    if (activeResumeId) {
      localStorage.setItem('analyticsActiveResumeId', activeResumeId);
    }
  }, [activeResumeId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch analytics
        const statsResponse = await API.get('/analytics');
        setStats(statsResponse.data);

        // Fetch user resumes
        const resumesResponse = await API.get('/resumes');
        const loadedResumes = resumesResponse.data || [];
        
        // Sort resumes by updatedAt descending so the latest created/updated is first by default
        loadedResumes.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        setResumes(loadedResumes);
        
        if (loadedResumes.length > 0) {
          const persistedId = localStorage.getItem('analyticsActiveResumeId');
          const exists = loadedResumes.some(r => String(r.id) === String(persistedId));
          if (exists && persistedId) {
            setActiveResumeId(String(persistedId));
          } else {
            setActiveResumeId(String(loadedResumes[0].id));
          }
        }
      } catch (err) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  // Fetch Gemini AI ATS & Skill analysis when activeResumeId changes
  useEffect(() => {
    if (!activeResumeId) return;
    const activeResume = resumes.find(r => String(r.id) === String(activeResumeId));
    if (!activeResume) return;

    let active = true;

    // Clear previous state and show loader immediately to avoid stale data display
    setAiScore(0);
    setAiSuggestions([]);
    setAiSkillsDemand([]);
    setIsAnalyzing(true);
    setAnalysisStatus('Analyzing resume with Success AI...');

    const runAnalysis = async () => {
      try {
        const response = await API.post('/ai/generate', {
          tool: 'ats-analysis',
          inputs: { resumeData: activeResume.resumeData }
        });
        
        if (!active) return;

        const data = JSON.parse(response.data.result);
        const score = typeof data.score === 'number' ? data.score : calculateAtsScore(activeResume.resumeData);
        const suggestions = Array.isArray(data.suggestions) ? data.suggestions : getImprovementSuggestions(activeResume.resumeData);
        const skillsDemand = Array.isArray(data.skillsDemand) ? data.skillsDemand : (
          (activeResume?.resumeData?.skills || []).filter(s => s && s.trim().length > 0).map(s => ({ skill: s, demand: getSkillDemand(s) })).sort((a, b) => b.demand - a.demand).slice(0, 6)
        );

        setAiScore(score);
        setAiSuggestions(suggestions);
        setAiSkillsDemand(skillsDemand);
        setAnalysisStatus('Success AI analysis complete');
      } catch (err) {
        if (!active) return;
        console.warn('Gemini analysis failed, falling back to local heuristic calculations:', err);
        setAnalysisStatus('AI unavailable, using local ATS fallback');

        const fallbackScore = calculateAtsScore(activeResume.resumeData);
        const fallbackSuggestions = getImprovementSuggestions(activeResume.resumeData);
        const activeResumeSkills = activeResume?.resumeData?.skills || [];
        const validSkills = activeResumeSkills.filter(s => s && s.trim().length > 0);
        const fallbackSkillsToRender = validSkills.length > 0
          ? validSkills.map(s => ({ skill: s, demand: getSkillDemand(s) })).sort((a, b) => b.demand - a.demand).slice(0, 6)
          : fallbackSkills;

        setAiScore(fallbackScore);
        setAiSuggestions(fallbackSuggestions);
        setAiSkillsDemand(fallbackSkillsToRender);
      } finally {
        if (active) {
          setIsAnalyzing(false);
        }
      }
    };

    runAnalysis();

    return () => {
      active = false;
    };
  }, [activeResumeId, resumes, refreshTrigger]);

  const activeResume = resumes.find(r => String(r.id) === String(activeResumeId)) || (resumes.length > 0 ? resumes[0] : null);

  const activeResumeSkills = activeResume?.resumeData?.skills || [];
  const validSkills = activeResumeSkills.filter(s => s && s.trim().length > 0);
  const hasCustomSkills = validSkills.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <style>{scanStyles}</style>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resume Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track your performance and see how you compare to industry standards.</p>
        </div>
        {resumes.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Selected Resume:</span>
              <select
                id="resume-selector"
                value={String(activeResumeId)}
                onChange={(e) => setActiveResumeId(String(e.target.value))}
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium shadow-sm hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {resumes.map(r => (
                  <option key={r.id} value={String(r.id)}>
                    {r.name || 'Untitled Resume'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                disabled={!activeResumeId || isAnalyzing}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Refreshing...' : 'Refresh Analysis'}
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">{analysisStatus}</span>
            </div>
          </div>
        )}
      </div>

      {resumes.length === 0 && !loading && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/50 p-4 rounded-2xl flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-400 text-sm">No Saved Resumes Found</h4>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
              You haven't created any resumes yet. Go to the <a href="/templates" className="font-bold underline hover:text-amber-800 dark:hover:text-amber-300">Templates</a> or <a href="/builder" className="font-bold underline hover:text-amber-800 dark:hover:text-amber-300">Resume Builder</a> to create one and start tracking your real ATS score!
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Main stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Total Cloud Resumes</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {resumes.length}
                  <span className="text-xl text-slate-450 font-medium ml-1">created</span>
                </span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, resumes.length * 20)}%` }}></div>
              </div>
              <p className="text-xs text-green-500 mt-2 font-medium">ATS-matched active layouts</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">Resume Views</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.views}
                  <span className="text-xl text-slate-450 font-medium ml-1">views</span>
                </span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, stats.views * 10)}%` }}></div>
              </div>
              <p className="text-xs text-emerald-500 mt-2 font-medium">Online preview hits tracked live</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">PDF Downloads</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.downloads}
                  <span className="text-xl text-slate-450 font-medium ml-1">times</span>
                </span>
              </div>
              <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: `${Math.min(100, stats.downloads * 15)}%` }}></div>
              </div>
              <p className="text-xs text-slate-550 mt-2">Active downloads tracked live</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ATS Score & Suggestions Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white">ATS Score Analysis</h3>
                  {activeResume && !isAnalyzing && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      aiScore >= 80 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' 
                        : aiScore >= 60 
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40' 
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/40'
                    }`}>
                      {aiScore >= 80 ? 'Excellent Match' : aiScore >= 60 ? 'Good Potential' : 'Needs Optimization'}
                    </span>
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-blue-500/5 to-purple-500/10 animate-pulse rounded-2xl blur-xl"></div>
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent absolute top-0 left-0 right-0 animate-scan"></div>
                    <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                      <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-primary-500 dark:text-primary-400 tracking-wider">AI SCAN</span>
                    </div>
                    <div className="text-center space-y-2 relative z-10">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-base tracking-tight animate-pulse">AI Scanning Resume Profile...</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm px-6 leading-normal">Gemini is conducting deep keyword indexing, syntactic matching, and score modeling.</p>
                    </div>
                  </div>
                ) : activeResume ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    {/* Radial Score Gauge */}
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 sm:col-span-1">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            className="stroke-slate-200 dark:stroke-slate-800"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            className={`transition-all duration-1000 ${
                              aiScore >= 80 ? 'stroke-emerald-500' : aiScore >= 60 ? 'stroke-amber-500' : 'stroke-rose-500'
                            }`}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={301.6}
                            strokeDashoffset={301.6 - (301.6 * aiScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{aiScore}%</span>
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-400 mt-0.5">ATS SCORE</span>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions scroll panel */}
                    <div className="sm:col-span-2 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Optimization Suggestions ({aiSuggestions.length})
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {analysisStatus}
                      </span>
                    </div>
                      {aiSuggestions.length === 0 ? (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 text-center">
                          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">✨ 100% Optimized!</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Your resume is fully parsed and configured to pass general ATS benchmarks.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[170px] overflow-y-auto pr-2 custom-scrollbar">
                          {aiSuggestions.map((item, index) => (
                            <div 
                              key={index}
                              className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/30 flex items-start gap-2.5 hover:border-slate-350 dark:hover:border-slate-600 transition-colors"
                            >
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                item.impact === 'Critical' 
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' 
                                  : item.impact === 'High' 
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
                                  : item.impact === 'Medium' 
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400' 
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                              }`}>
                                {item.impact}
                              </span>
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.text}</p>
                                <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5 leading-relaxed">{item.tip}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-10 text-slate-500 dark:text-slate-500 text-xs italic">
                    Select a resume to see ATS optimizations
                  </div>
                )}
              </div>
            </div>

            {/* Skill Demand Analysis */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Skill Demand Analysis</h3>
                
                {isAnalyzing ? (
                  <div className="flex flex-col justify-center py-6 space-y-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-primary-500/5 animate-pulse rounded-2xl blur-lg"></div>
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute top-0 left-0 right-0 animate-scan"></div>
                    
                    <div className="space-y-4 px-2">
                      <h4 className="text-xs font-semibold text-slate-650 dark:text-slate-300 animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                        Evaluating live market indices...
                      </h4>
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
                            <div className="w-8 h-3 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-400/30 h-full rounded-full animate-pulse" style={{ width: `${100 - (idx * 15)}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {!hasCustomSkills && activeResume && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl mb-4 text-blue-700 dark:text-blue-400 text-xs flex items-start gap-2.5">
                        <span className="text-lg">💡</span>
                        <div>
                          <span className="font-semibold block mb-0.5">Custom Analytics Notice</span>
                          Add skills to your active resume in the builder to see custom market demand statistics here! Showing trending standard industry skills in the meantime.
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {aiSkillsDemand.map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-705 dark:text-slate-300">{s.skill}</span>
                            <span className="text-slate-500 font-medium">{s.demand}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${s.demand}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;


