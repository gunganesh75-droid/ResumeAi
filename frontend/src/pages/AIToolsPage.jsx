import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiTrendingUp, FiFileText, FiBriefcase, FiAward, FiTarget, FiArrowRight, FiX, FiClipboard, FiCheck } from 'react-icons/fi';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AIToolsPage = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      id: 'summary',
      title: 'AI Summary Generator',
      description: 'Generate a professional and engaging summary tailored to your target job title.',
      icon: <FiFileText />,
      color: 'bg-blue-500 text-white',
      shadow: 'shadow-blue-500/30',
      fields: [
        { name: 'jobTitle', label: 'Job Title', placeholder: 'e.g. Senior Frontend Engineer', type: 'text' },
        { name: 'industry', label: 'Industry', placeholder: 'e.g. FinTech, SaaS, Healthcare', type: 'text' },
        { name: 'experienceLevel', label: 'Years of Experience', placeholder: 'e.g. 5', type: 'number' }
      ]
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Generator',
      description: 'Instantly create a customized cover letter matching your resume and the job.',
      icon: <FiBriefcase />,
      color: 'bg-purple-500 text-white',
      shadow: 'shadow-purple-500/30',
      fields: [
        { name: 'jobTitle', label: 'Job Title', placeholder: 'e.g. Marketing Manager', type: 'text' },
        { name: 'company', label: 'Target Company', placeholder: 'e.g. Google Inc.', type: 'text' },
        { name: 'keywords', label: 'Key Skills (comma separated)', placeholder: 'e.g. SEO, Growth Hacking, Analytics', type: 'text' }
      ]
    },
    {
      id: 'optimizer',
      title: 'Resume Optimizer',
      description: 'Get actionable suggestions to improve your bullet points and impact statements.',
      icon: <FiCpu />,
      color: 'bg-indigo-500 text-white',
      shadow: 'shadow-indigo-500/30',
      fields: [
        { name: 'resumeText', label: 'Paste Your Resume Content', placeholder: 'Paste your text here...', type: 'textarea' },
        { name: 'jobDescription', label: 'Paste Target Job Description', placeholder: 'Paste JD here...', type: 'textarea' }
      ]
    },
    {
      id: 'bullet-points',
      title: 'ATS Bullet Point Writer',
      description: 'Orchestrate professional experience bullet points matching keyword structures.',
      icon: <FiTrendingUp />,
      color: 'bg-green-500 text-white',
      shadow: 'shadow-green-500/30',
      fields: [
        { name: 'role', label: 'Target Role', placeholder: 'e.g. Fullstack Developer', type: 'text' },
        { name: 'keySkills', label: 'Primary Tech/Skill to highlight', placeholder: 'e.g. React.js, GraphQL, Node', type: 'text' }
      ]
    }
  ];

  const handleLaunch = (tool) => {
    setActiveTool(tool);
    setInputs({});
    setResult('');
    setCopied(false);
  };

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await API.post('/ai/generate', {
        tool: activeTool.id,
        inputs
      });
      setResult(response.data.result);
      toast.success('AI generation completed!');
    } catch (err) {
      toast.error('AI Service is currently busy. Try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Career Tools</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Supercharge your job search with our advanced AI-powered tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${tool.color} blur-2xl`}></div>
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg ${tool.color} ${tool.shadow}`}>
              {tool.icon}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{tool.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              {tool.description}
            </p>
            
            <button 
              onClick={() => handleLaunch(tool)}
              className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors"
            >
              Launch Tool <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {activeTool && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-20 px-4 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 p-6 md:p-8"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveTool(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${activeTool.color}`}>
                  {activeTool.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeTool.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Powered by ResumeAI Cloud</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTool.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          required
                          value={inputs[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all resize-none"
                        />
                      ) : (
                        <input
                          type={field.type}
                          required
                          value={inputs[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                        />
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 mt-6"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Generate with AI'
                    )}
                  </button>
                </form>

                {/* Results Screen */}
                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 min-h-[250px] relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Generation Output</span>
                    {result && (
                      <button 
                        onClick={handleCopy}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-xs"
                      >
                        {copied ? <FiCheck className="text-green-500" /> : <FiClipboard />} Copy
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 text-sm text-slate-700 dark:text-slate-300 overflow-y-auto whitespace-pre-line leading-relaxed">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-xs">Analyzing and generating...</span>
                      </div>
                    ) : result ? (
                      result
                    ) : (
                      <span className="text-slate-400 text-xs italic">Submit the form to generate optimized AI content.</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIToolsPage;

