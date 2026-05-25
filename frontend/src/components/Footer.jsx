import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">ResumeAI</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Build ATS-friendly, professional resumes in minutes with the power of AI.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/templates" className="hover:text-primary-500 transition-colors">Templates</Link></li>
              <li><Link to="/#features" className="hover:text-primary-500 transition-colors">Features</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/career-blog" className="hover:text-primary-500 transition-colors">Career Blog</Link></li>
              <li><Link to="/help" className="hover:text-primary-500 transition-colors">Help Center</Link></li>
              <li><Link to="/resume-examples" className="hover:text-primary-500 transition-colors">Resume Examples</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()}  AI Resume Builder. All rights reserved.
Built to help professionals create ATS-friendly resumes faster.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
