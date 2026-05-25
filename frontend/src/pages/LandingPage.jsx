import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiFileText, 
  FiCpu, 
  FiStar, 
  FiArrowRight, 
  FiTrendingUp, 
  FiUsers, 
  FiAward, 
  FiActivity,
  FiLayout,
  FiShield
} from 'react-icons/fi';

const LandingPage = () => {
  const location = useLocation();

  // Declarative smooth-scrolling effect on hash change
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  return (
    <div className="relative pt-20 pb-16 min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 bg-grid-pattern transition-colors duration-300">
      
      {/* ================= COSMIC BACKGROUND GLOW BLOBS ================= */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/10 rounded-full blur-[120px] animate-blob pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500/10 to-indigo-500/10 dark:from-primary-500/20 dark:to-indigo-500/20 border border-primary-500/20 dark:border-primary-400/30 text-primary-700 dark:text-primary-300 font-semibold text-sm mb-8 shadow-sm">
            <FiStar className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>The #1 Premium AI Resume Builder</span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
            Build ATS-Friendly <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-500 to-purple-600 dark:from-primary-400 dark:via-indigo-400 dark:to-purple-400">
              AI-Powered Resumes
            </span> <br className="hidden md:block"/>
            in Just Minutes
          </h1>

          {/* Sub-headline */}
          <p className="mt-4 max-w-2xl text-xl text-slate-600 dark:text-slate-300 mx-auto mb-12 leading-relaxed">
            Create professional, highly tailored resumes that bypass automated filters. Our AI analyzes job descriptions, highlights matching credentials, and optimizes keywords instantly.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link 
              to="/register" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-full text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-xl shadow-primary-600/30 dark:shadow-primary-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              Get Started for Free 
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
            <Link 
              to="/templates" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-full text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-primary-500 transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              View Design Templates
            </Link>
          </div>
        </motion.div>

        {/* ================= PREMIUM FLOATING STATS GRID ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 px-4"
        >
          {[
            { value: '50k+', label: 'Resumes Optimized', icon: <FiFileText className="w-4 h-4 text-primary-500" /> },
            { value: '99.4%', label: 'ATS Passing Rate', icon: <FiCheckCircle className="w-4 h-4 text-emerald-500" /> },
            { value: '100%', label: 'Lifetime Free Access', icon: <FiAward className="w-4 h-4 text-purple-500" /> },
            { value: '4.9/5', label: 'User Rating', icon: <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" /> }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:border-primary-500/40 transition-colors duration-300">
              <div className="flex items-center gap-1.5 mb-1.5">
                {stat.icon}
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ================= HIGH-FIDELITY APP DASHBOARD MOCKUP ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative mx-auto max-w-5xl group"
        >
          {/* Glowing Mockup Borders */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
          
          {/* Main Mockup Frame */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl overflow-hidden aspect-[16/10] flex flex-col">
            
            {/* Mock Header/Window controls */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-3.5 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/20"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm shadow-amber-500/20"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/20"></span>
              </div>
              <div className="rounded-lg bg-slate-900 border border-slate-800/80 px-10 py-1 text-xs text-slate-400 font-medium tracking-wide">
                app.resumeai.com/dashboard
              </div>
              <div className="w-12"></div>
            </div>

            {/* Dashboard Mock Body */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* Sidebar Replica */}
              <div className="w-48 bg-slate-950 border-r border-slate-800 p-4 hidden md:flex flex-col gap-6 text-left">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">R</div>
                  <span className="text-white font-black text-sm tracking-tight">ResumeAI</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="px-3 py-2 rounded-lg bg-slate-900 text-primary-400 text-xs font-bold flex items-center gap-2.5 border-l-2 border-primary-500">
                    <FiLayout className="w-3.5 h-3.5" /> Dashboard
                  </div>
                  {['My Resumes', 'AI Templates', 'Career Analyzer', 'Settings'].map((tab, idx) => (
                    <div key={idx} className="px-3 py-2 rounded-lg text-slate-500 text-xs font-semibold hover:text-slate-300 transition-colors flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 bg-slate-800/50 rounded-sm"></div> {tab}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Workspace Replica */}
              <div className="flex-1 bg-slate-900/60 p-6 flex flex-col gap-6 text-left overflow-y-auto">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-white">Welcome back, Test User! 👋</h3>
                    <p className="text-xs text-slate-400">Let's craft an ATS-conquering resume today.</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <FiShield className="w-3.5 h-3.5" /> Google Verified
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  
                  {/* Circular ATS Optimization Score Meter */}
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATS Score Index</span>
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {/* Ring Background */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="46" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        {/* Glowing Active Ring */}
                        <circle 
                          cx="56" 
                          cy="56" 
                          r="46" 
                          stroke="url(#atsGradient)" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray="289" 
                          strokeDashoffset="17" 
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute text-2xl font-black text-white">94%</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded-full">Highly Optimized</span>
                  </div>

                  {/* AI Coprocessor Generation Card */}
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 md:col-span-2 flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FiCpu className="text-primary-400 animate-spin-slow" /> Real-time AI Resume Writer
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">1.2s API Response</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl flex-1 flex flex-col justify-center">
                      <p className="text-xs font-bold text-primary-400 mb-1.5">Generated Professional Profile:</p>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "Results-driven Software Engineer with 5+ years of credentials in scaling cloud infrastructure. Coordinated with cross-functional partners to deploy high-fidelity layouts, boosting engagement by 34%..."
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-medium">#ReactJS</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-medium">#NodeJS</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-medium">#AWS</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Recent Files Replica */}
                <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Workspace Documents</span>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: 'Senior_Fullstack_Dev_Resume.pdf', template: 'Deluxe Minimalist', date: 'Updated 2m ago', active: true },
                      { name: 'Technical_Manager_Resume.pdf', template: 'Professional Modern', date: 'Updated 1d ago', active: false }
                    ].map((doc, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-900/80 hover:border-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <FiFileText className={`w-4 h-4 ${doc.active ? 'text-primary-500' : 'text-slate-600'}`} />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{doc.template}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 font-semibold">{doc.date}</span>
                          <span className={`w-2 h-2 rounded-full ${doc.active ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Glowing Backlight Blob */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        </motion.div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="relative py-24 bg-white/40 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-900/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Designed by experienced industry professionals to help you bypass automated filters and stand out to hiring managers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <FiCpu />, 
                title: 'AI Resume Generation', 
                desc: 'Generate highly customized summary headlines and robust performance-oriented achievements matching targeted roles in under two seconds.',
                glow: 'group-hover:border-primary-500/50 dark:group-hover:border-primary-500/40',
                link: '/register'
              },
              { 
                icon: <FiCheckCircle />, 
                title: 'ATS Core Optimization', 
                desc: 'Optimize your technical resume with specific matching vocabulary, dynamic industry keywords, and clean formats that easily beat robotic screening software.',
                glow: 'group-hover:border-emerald-500/50 dark:group-hover:border-emerald-500/40',
                link: '/register'
              },
              { 
                icon: <FiLayout />, 
                title: 'Elegant Layout Designs', 
                desc: 'Choose from multiple responsive layouts optimized by experienced recruiters for readability, structure, clean styling, and high-impact visual appeal.',
                glow: 'group-hover:border-purple-500/50 dark:group-hover:border-purple-500/40',
                link: '/register'
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group relative bg-white dark:bg-slate-900/80 p-8 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Micro glow overlay */}
                <div className={`absolute inset-0.5 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800/20 dark:to-slate-900/20 -z-10 border border-transparent transition-all duration-300 ${feature.glow}`}></div>
                
                <div>
                  <div className="w-14 h-14 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 dark:from-primary-500/20 dark:to-indigo-500/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                
                <Link
                  to={feature.link}
                  className="mt-8 flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 group-hover:translate-x-1 transition-all duration-200 w-fit"
                >
                  <span>Learn more</span> <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
