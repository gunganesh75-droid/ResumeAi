import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiDownload, FiPrinter, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';
import { ResumeTemplate } from '../components/ResumeTemplate';

const PreviewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [zoomScale, setZoomScale] = useState(100);
  const [templateId, setTemplateId] = useState(1);
  const [resumeName, setResumeName] = useState('My Resume');
  const [resumeData, setResumeData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    interests: []
  });

  useEffect(() => {
    if (!resumeId) {
      toast.error('No active resume selected for preview');
      setLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/resumes/${resumeId}`);
        setResumeName(res.data.name);
        
        if (res.data.resumeData && Object.keys(res.data.resumeData).length > 0) {
          setResumeData(res.data.resumeData);
        }
        if (res.data.templateId) {
          setTemplateId(Number(res.data.templateId));
        }

        try {
          await API.post('/analytics/view');
        } catch (e) {
          console.error('Analytics view record error:', e);
        }
      } catch (err) {
        console.error('Error fetching resume preview:', err);
        toast.error('Failed to load resume details from cloud');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      await API.post('/analytics/download');
    } catch (e) {
      console.error('Analytics record error:', e);
    }
    const element = document.getElementById('resume-preview-doc');
    if (element) {
      const opt = {
        margin:       0,
        filename:     `${resumeData.firstName || 'Resume'}_${resumeData.lastName || ''}.pdf`,
        image:        { type: 'jpeg', quality: 0.99 },
        html2canvas:  {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: document.documentElement.offsetWidth,
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const zoomIn = () => {
    setZoomScale(prev => Math.min(prev + 10, 150));
  };

  const zoomOut = () => {
    setZoomScale(prev => Math.max(prev - 10, 50));
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Loading dynamic resume preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-955 overflow-x-hidden">
      {/* Custom Styles for Print + PDF Overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          .print-full {
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            transform: none !important;
          }
          body, html {
            background: white !important;
            color: black !important;
          }
        }

        /* PDF-safe: prevent headings from being sliced at page breaks */
        #resume-preview-doc h1,
        #resume-preview-doc h2,
        #resume-preview-doc h3 {
          page-break-inside: avoid;
          break-inside: avoid;
          page-break-after: avoid;
          break-after: avoid;
        }

        /* PDF-safe: keep section blocks together */
        #resume-preview-doc > div > div {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        /* PDF-safe: prevent any overflow clipping inside the resume */
        #resume-preview-doc * {
          overflow: visible !important;
          text-overflow: clip !important;
          white-space: normal !important;
        }

        /* Exceptions: skill/language tags should still stay on one line */
        #resume-preview-doc span[class*="whitespace-nowrap"],
        #resume-preview-doc .whitespace-nowrap {
          white-space: nowrap !important;
        }
      `}} />

      {/* Top Header/Toolbar */}
      <div className="no-print h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (resumeId) {
                navigate(`/builder?id=${resumeId}`);
              } else {
                navigate('/dashboard');
              }
            }}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Back to Editor"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {resumeName}
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">Full Page Live Preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mr-2">
            <button 
              onClick={zoomOut}
              className="p-1.5 text-slate-500 hover:text-slate-950 dark:hover:text-white rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
              title="Zoom Out"
            >
              <FiZoomOut />
            </button>
            <span className="px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 w-12 text-center">
              {zoomScale}%
            </span>
            <button 
              onClick={zoomIn}
              className="p-1.5 text-slate-500 hover:text-slate-955 dark:hover:text-white rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
              title="Zoom In"
            >
              <FiZoomIn />
            </button>
          </div>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiPrinter className="w-4 h-4" /> <span className="hidden sm:block">Print</span>
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
          >
            <FiDownload className="w-4 h-4" /> <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
        <div 
          className="print-container transition-transform duration-200"
          style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: 'top center' }}
        >
          <div id="resume-preview-doc" className="shadow-2xl dark:shadow-slate-900/40 rounded-lg bg-white">
            <ResumeTemplate templateId={templateId} resumeData={resumeData} isPreview={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
