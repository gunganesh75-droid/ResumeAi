import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiFileText, FiEye, FiDownload, FiTrash2, FiTrendingUp, FiCpu, FiInbox } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
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

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({ resumesCreated: 0, downloads: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  const getAverageAtsScore = () => {
    if (resumes.length === 0) return 0;
    const total = resumes.reduce((acc, r) => acc + calculateAtsScore(r.resumeData), 0);
    return Math.round(total / resumes.length);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resumesRes, statsRes] = await Promise.all([
          API.get('/resumes'),
          API.get('/analytics')
        ]);
        setResumes(resumesRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Failed to sync dashboard from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await API.delete(`/resumes/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, resumesCreated: Math.max(0, prev.resumesCreated - 1) }));
      toast.success('Resume successfully deleted');
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  const handleCreateNew = () => {
    navigate('/templates');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hello, {user?.name || 'Professional'}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Here is what's happening with your resumes today.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-sm shadow-primary-600/30 hover:-translate-y-0.5"
        >
          <FiPlus className="w-5 h-5" />
          Create New Resume
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Total Resumes', value: resumes.length, icon: <FiFileText />, trend: 'Active in cloud', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { title: 'Downloads Count', value: stats.downloads, icon: <FiDownload />, trend: 'PDF resume prints', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { title: 'ATS Score Avg', value: resumes.length > 0 ? `${getAverageAtsScore()}%` : '--', icon: <FiTrendingUp />, trend: 'Tailored optimization', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Resumes & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Resumes</h2>
            {resumes.length > 0 && (
              <Link to="/templates" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors">
                View Templates
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 text-2xl">
                <FiInbox />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">No Resumes Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
                You haven't created any resumes yet. Start fresh or pick a professional, ATS-optimized layout!
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-sm shadow-primary-600/30"
              >
                <FiPlus /> Get Started Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => navigate(`/builder?id=${resume.id}`)}
                  className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[21/14] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
                    {/* Visual Mock of details */}
                    <div className="w-full h-full bg-white dark:bg-slate-800 shadow-sm rounded border border-slate-200 dark:border-slate-700 p-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="w-2/3 h-3 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
                      <div className="w-5/6 h-2 bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
                      <div className="w-1/2 h-2 bg-slate-200 dark:bg-slate-700 rounded mt-4"></div>
                    </div>

                    {/* Delete Action Icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDelete(resume.id, e)}
                        className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all hover:scale-105"
                        title="Delete Resume"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {resume.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Updated {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Static Call */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <button
              onClick={() => navigate('/ai-tools')}
              className="w-full flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-100 dark:hover:border-primary-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                  <FiCpu className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">AI Summary Generator</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Generate a professional summary</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="w-full flex items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-transparent hover:border-orange-100 dark:hover:border-orange-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Check ATS Score</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">View your ATS score and skill demand history</p>
                </div>
              </div>
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
            <h3 className="font-bold text-lg mb-2">Explore Templates</h3>
            <p className="text-indigo-100 text-sm mb-4 max-w-[200px]">Browse our free collection of professional resume templates.</p>
            <button
              onClick={() => navigate('/templates')}
              className="px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            >
              View Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

