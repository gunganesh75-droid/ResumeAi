import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Sends the 6-Digit OTP to the user's email via backend SMTP
  const sendOtp = async (email, name, isLogin) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/send-otp', { email, name, isLogin });
      
      // If server returned a mockOtp (developer fallback mode)
      if (response.data.mockOtp) {
        console.log(`🔑 [DEVELOPER TESTING OTP]: Code is ${response.data.mockOtp}`);
        toast.success(`OTP printed to server console! Code is: ${response.data.mockOtp}`, {
          duration: 8000,
          position: 'top-center',
          style: { border: '1px solid #6366f1', padding: '16px', color: '#4f46e5', fontWeight: 'bold' }
        });
      } else {
        toast.success('A 6-digit verification code has been sent to your email!');
      }
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send verification code. Please try again.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Verifies the entered 6-Digit OTP code with the backend
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/verify-otp', { email, otp });
      const { token, user: loggedUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      
      toast.success(`Welcome to ResumeAI, ${loggedUser.name}!`);
      navigate('/dashboard');
      return loggedUser;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid or expired OTP. Please try again.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const updateUser = (updatedUser, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, verifyOtp, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
