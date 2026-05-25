import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiCheck, FiArrowRight, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  
  const { sendOtp, verifyOtp, loading } = useAuth();

  // Trigger SMTP Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtp(email, '', true); // isLogin = true
      setShowOtpModal(true);
      // Auto focus first OTP input box after render
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }, 300);
    } catch (err) {
      // Error handles inside context
    }
  };

  // Trigger verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      return;
    }

    setOtpLoading(true);
    try {
      await verifyOtp(email, otpCode);
    } catch (err) {
      // Error handled by AuthContext toast
    } finally {
      setOtpLoading(false);
    }
  };

  // Handles sequential digit typing focus movement
  const handleOtpChange = (element, index) => {
    const val = element.value;
    if (isNaN(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val.substring(val.length - 1);
    setOtpDigits(newDigits);

    // Auto-focus next input box
    if (val !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handles backspacing focus movement
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        // Clear previous input
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 pt-24 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter your email to receive a 6-digit security code
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <FiMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none block w-full pl-11 pr-3 py-3.5 border border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-colors shadow-inner"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-md shadow-primary-600/25 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? 'Sending OTP...' : 'Send Verification OTP'}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          First time here?{' '}
          <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Sign up
          </Link>
        </p>
      </div>

      {/* ================= 6-DIGIT OTP VERIFICATION OVERLAY ================= */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !otpLoading && setShowOtpModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* OTP Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-10 p-8 text-left"
            >
              <button
                disabled={otpLoading}
                onClick={() => setShowOtpModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <FiMail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Verify Your Email</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5">
                  Enter the 6-digit security code sent to <br/><span className="font-bold text-slate-700 dark:text-slate-300">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP Boxes Grid */}
                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      maxLength={1}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="w-11 h-13 text-center text-xl font-bold border border-slate-350 dark:border-slate-650 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-inner"
                      required
                    />
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={otpLoading}
                    onClick={() => setShowOtpModal(false)}
                    className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={otpLoading || otpDigits.join('').length !== 6}
                    className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-2xl text-sm font-bold shadow-md shadow-primary-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{otpLoading ? 'Verifying...' : 'Verify OTP'}</span> <FiArrowRight />
                  </button>
                </div>
              </form>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-xs font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Resend Code
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
