
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateDailyCalorieGoal } from '../services/nutritionService';
import { ACTIVITY_LEVELS } from '../constants';
import { User } from '../types';
import { useLocation, Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const initialMode = new URLSearchParams(location.search).get('mode') || 'login';
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', age: 25, weight: 70, height: 175, gender: 'male' as 'male' | 'female', activityLevel: 'light' as User['activityLevel']
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value });
  };
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // NOTE: Password is not actually checked as it's not stored
      login(loginData.email);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { password, ...userData } = signupData;
      const goal = calculateDailyCalorieGoal(userData);
      const userToCreate = { ...userData, dailyCalorieGoal: goal };
      // NOTE: Password is not stored or used for auth in this demo
      signup(userToCreate);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const commonInputClasses = "w-full px-4 py-2 text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500";
  const commonLabelClasses = "block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <Link to="/" className="text-center block text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CalorieApp
        </Link>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => setIsLogin(true)} className={`w-1/2 py-4 text-center text-lg font-medium transition-colors ${isLogin ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>Login</button>
          <button onClick={() => setIsLogin(false)} className={`w-1/2 py-4 text-center text-lg font-medium transition-colors ${!isLogin ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>Sign Up</button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={commonLabelClasses}>Email</label>
              <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} className={commonInputClasses} required />
            </div>
            <div>
              <label htmlFor="password" className={commonLabelClasses}>Password</label>
              <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} className={commonInputClasses} required />
            </div>
            <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity">Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={commonLabelClasses}>Name</label>
                <input type="text" name="name" value={signupData.name} onChange={handleSignupChange} className={commonInputClasses} required />
              </div>
               <div>
                <label className={commonLabelClasses}>Age</label>
                <input type="number" name="age" value={signupData.age} onChange={handleSignupChange} className={commonInputClasses} required />
              </div>
            </div>
             <div>
                <label className={commonLabelClasses}>Email</label>
                <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} className={commonInputClasses} required />
              </div>
            <div>
              <label className={commonLabelClasses}>Password</label>
              <input type="password" name="password" value={signupData.password} onChange={handleSignupChange} className={commonInputClasses} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={commonLabelClasses}>Weight (kg)</label>
                <input type="number" name="weight" value={signupData.weight} onChange={handleSignupChange} className={commonInputClasses} required />
              </div>
              <div>
                <label className={commonLabelClasses}>Height (cm)</label>
                <input type="number" name="height" value={signupData.height} onChange={handleSignupChange} className={commonInputClasses} required />
              </div>
            </div>
            <div>
              <label className={commonLabelClasses}>Gender</label>
              <select name="gender" value={signupData.gender} onChange={handleSignupChange} className={commonInputClasses}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className={commonLabelClasses}>Activity Level</label>
              <select name="activityLevel" value={signupData.activityLevel} onChange={handleSignupChange} className={commonInputClasses}>
                {ACTIVITY_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
