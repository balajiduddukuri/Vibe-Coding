
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { calculateDailyCalorieGoal } from '../services/nutritionService';
import { ACTIVITY_LEVELS } from '../constants';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<User | null>(user);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: (name === 'age' || name === 'weight' || name === 'height') ? Number(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    const newCalorieGoal = calculateDailyCalorieGoal(formData);
    const updatedUser = { ...formData, dailyCalorieGoal: newCalorieGoal };
    
    updateUser(updatedUser);
    setFormData(updatedUser); // Update local form state with new goal
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  if (!formData) {
    return <div>Loading profile...</div>;
  }

  const commonInputClasses = "w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500";
  const commonLabelClasses = "block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300";

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Profile</h2>
             {successMessage && <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-600 rounded-lg">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className={commonLabelClasses}>Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={commonInputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="email" className={commonLabelClasses}>Email</label>
                        <input type="email" id="email" name="email" value={formData.email} className={`${commonInputClasses} cursor-not-allowed bg-gray-200 dark:bg-gray-600`} readOnly />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                        <label htmlFor="age" className={commonLabelClasses}>Age</label>
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className={commonInputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="weight" className={commonLabelClasses}>Weight (kg)</label>
                        <input type="number" step="0.1" id="weight" name="weight" value={formData.weight} onChange={handleChange} className={commonInputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="height" className={commonLabelClasses}>Height (cm)</label>
                        <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} className={commonInputClasses} required />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="gender" className={commonLabelClasses}>Gender</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={commonInputClasses} required>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="activityLevel" className={commonLabelClasses}>Activity Level</label>
                        <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={commonInputClasses} required>
                            {ACTIVITY_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-gray-600 dark:text-gray-300">Your Calculated Daily Calorie Goal:</p>
                    <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{formData.dailyCalorieGoal} kcal</p>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-3 font-bold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Profile;
