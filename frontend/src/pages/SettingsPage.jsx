import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_AVATARS = ['JD', 'AI', 'UX', 'SE', 'PM', 'DE', 'DS', 'CE', 'FS', 'QA'];

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('JD');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize fields on load/user changes
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setSelectedAvatar(user.avatar || 'JD');
    }
  }, [user]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error('First Name is required');
      return;
    }

    try {
      setIsSaving(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const response = await API.put('/user', {
        name: fullName,
        avatar: selectedAvatar
      });

      // Update state in AuthContext
      updateUser(response.data.user, response.data.token);
      toast.success('Your profile has been saved in the cloud!');
    } catch (err) {
      console.error('Failed to update profile settings:', err);
      toast.error(err.response?.data?.error || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await API.delete('/user');
      toast.success('Your account has been deleted successfully.');
      logout(); // Clean local context and redirect to login
    } catch (err) {
      console.error('Failed to delete account:', err);
      toast.error(err.response?.data?.error || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Profile Settings Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profile Settings</h2>
          <div className="space-y-4 max-w-2xl">
            
            {/* Avatar Select Row */}
            <div className="flex flex-col gap-4 mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Avatar Symbol</label>
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl border-2 border-primary-200 dark:border-primary-800 shadow-md cursor-pointer"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                >
                  {selectedAvatar}
                </motion.div>
                <div>
                  <button 
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-sm transition-all border border-slate-200 dark:border-slate-600 shadow-sm"
                  >
                    {showAvatarPicker ? 'Hide Choices' : 'Choose Symbol'}
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Click your avatar or button to toggle selection panel.</p>
                </div>
              </div>

              {/* Avatar Selector Grid */}
              <AnimatePresence>
                {showAvatarPicker && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-750 grid grid-cols-5 sm:grid-cols-10 gap-3 mt-2 overflow-hidden"
                  >
                    {PRESET_AVATARS.map((av) => (
                      <motion.button
                        key={av}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedAvatar(av);
                          setShowAvatarPicker(false);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all border-2 ${
                          selectedAvatar === av
                            ? 'bg-primary-600 border-primary-400 text-white scale-110 ring-2 ring-primary-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600'
                        }`}
                      >
                        {av}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Form Fields */}
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={handleSaveChanges}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="appearance-none block w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-colors shadow-sm" 
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="appearance-none block w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-colors shadow-sm" 
                  placeholder="e.g. Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address (Verified)</label>
                <input 
                  type="email" 
                  disabled
                  value={user?.email || ''} 
                  className="appearance-none block w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-500 cursor-not-allowed sm:text-sm shadow-sm" 
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Account is verified via passwordless secure SMTP. Email cannot be edited.</span>
              </div>
              
              <div className="sm:col-span-2 mt-2">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500 text-white font-medium rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Settings...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Subscription Plan Section */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Subscription Plan</h2>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{user?.plan || 'Lifetime Free Plan'}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">You have full, unlimited access to all AI features, premium templates, and tools at zero cost.</p>
            </div>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold rounded-xl text-sm border border-green-200 dark:border-green-800 shrink-0">
              Active & Free
            </span>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="p-6 bg-rose-50/10 dark:bg-rose-950/5">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <p className="text-sm text-slate-550 dark:text-slate-400 mb-4">Once you delete your account, all your resumes, analytics, and settings will be permanently erased. There is no rollback.</p>
          
          {!showDeleteConfirm ? (
            <button 
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2.5 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-450 hover:bg-rose-50 dark:hover:bg-red-900/20 font-semibold rounded-xl text-sm transition-all"
            >
              Delete Account
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl space-y-3 max-w-xl"
            >
              <p className="text-xs font-bold text-red-800 dark:text-red-400">⚠️ Are you absolutely sure? This will instantly cascade delete all your resumes.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-350 font-bold rounded-lg text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
