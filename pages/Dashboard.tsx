
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFoodLogForDate, deleteFoodLogEntry } from '../services/foodService';
import { FoodLogEntry, MealType } from '../types';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PlusIcon, FireIcon, TrashIcon } from '@heroicons/react/24/outline';

const MealCard: React.FC<{ title: string; items: FoodLogEntry[]; onDelete: (id: string) => void }> = ({ title, items, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-semibold mb-4 capitalize">{title}</h3>
    {items.length > 0 ? (
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center text-sm">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{item.grams}g &bull; {Math.round(item.calories)} kcal</p>
            </div>
             <button onClick={() => onDelete(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <TrashIcon className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 dark:text-gray-400">No items logged yet.</p>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [todaysLog, setTodaysLog] = useState<FoodLogEntry[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      setTodaysLog(getFoodLogForDate(user.email, today));
    }
  }, [user, refresh]);

  const handleDelete = (id: string) => {
    if (user) {
        deleteFoodLogEntry(user.email, id);
        setRefresh(prev => !prev);
    }
  }

  const summary = useMemo(() => {
    const initial = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return todaysLog.reduce((acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    }, initial);
  }, [todaysLog]);

  const remainingCalories = user ? user.dailyCalorieGoal - summary.calories : 0;
  const progressPercent = user ? Math.min((summary.calories / user.dailyCalorieGoal) * 100, 100) : 0;

  const macroData = [
    { name: 'Protein', value: summary.protein, color: '#34d399' },
    { name: 'Carbs', value: summary.carbs, color: '#60a5fa' },
    { name: 'Fat', value: summary.fat, color: '#f87171' },
  ];
  
  const totalMacros = summary.protein + summary.carbs + summary.fat;

  const meals = {
    breakfast: todaysLog.filter(i => i.mealType === 'breakfast'),
    lunch: todaysLog.filter(i => i.mealType === 'lunch'),
    dinner: todaysLog.filter(i => i.mealType === 'dinner'),
    snacks: todaysLog.filter(i => i.mealType === 'snacks'),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calorie Goal */}
        <div className="lg:col-span-2 bg-gradient-to-br from-green-500 to-sky-500 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold">Today's Summary</h2>
                <p className="opacity-80">Your daily calorie report</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8">
                <div className="text-center sm:text-left mb-6 sm:mb-0">
                    <div className="text-5xl font-extrabold">{Math.round(summary.calories)}</div>
                    <div className="text-lg opacity-80">Consumed</div>
                </div>
                 <div className="relative w-36 h-36">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-white/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                        <path className="text-white"
                        strokeDasharray={`${progressPercent}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold">{Math.round(remainingCalories)}</div>
                        <div className="text-sm opacity-80">Remaining</div>
                    </div>
                </div>
                 <div className="text-center sm:text-right mt-6 sm:mt-0">
                    <div className="text-5xl font-extrabold">{user?.dailyCalorieGoal || 0}</div>
                    <div className="text-lg opacity-80">Goal</div>
                </div>
            </div>
        </div>
        
        {/* Macros */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Macronutrients</h3>
            <div className="h-48">
             {totalMacros > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                        {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}g`} />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
             ) : (<div className="flex items-center justify-center h-full text-gray-500">Log food to see macros</div>)}
            </div>
             <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                    <p className="font-bold" style={{color: macroData[0].color}}>{summary.protein.toFixed(1)}g</p>
                    <p className="text-gray-500 dark:text-gray-400">Protein</p>
                </div>
                <div>
                    <p className="font-bold" style={{color: macroData[1].color}}>{summary.carbs.toFixed(1)}g</p>
                    <p className="text-gray-500 dark:text-gray-400">Carbs</p>
                </div>
                <div>
                    <p className="font-bold" style={{color: macroData[2].color}}>{summary.fat.toFixed(1)}g</p>
                    <p className="text-gray-500 dark:text-gray-400">Fat</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MealCard title="Breakfast" items={meals.breakfast} onDelete={handleDelete} />
        <MealCard title="Lunch" items={meals.lunch} onDelete={handleDelete} />
        <MealCard title="Dinner" items={meals.dinner} onDelete={handleDelete} />
        <MealCard title="Snacks" items={meals.snacks} onDelete={handleDelete} />
      </div>
      
       <Link to="/log-food" className="fixed bottom-6 right-6 flex items-center justify-center w-16 h-16 bg-gradient-primary text-white rounded-full shadow-lg transform hover:scale-110 transition-transform">
        <PlusIcon className="w-8 h-8" />
      </Link>
    </div>
  );
};

export default Dashboard;
