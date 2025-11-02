
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFoodLogsForPastNDays, getWeightHistory, addWeightEntry } from '../services/foodService';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        <div className="h-72">
            {children}
        </div>
    </div>
);

const Progress: React.FC = () => {
    const { user } = useAuth();
    const [calorieData, setCalorieData] = useState<any[]>([]);
    const [weightData, setWeightData] = useState<any[]>([]);
    const [macroData, setMacroData] = useState<any[]>([]);
    const [newWeight, setNewWeight] = useState<string>('');

    useEffect(() => {
        if (user) {
            // Calorie and Macro Data (last 7 days)
            const logsByDate = getFoodLogsForPastNDays(user.email, 7);
            const calorieChartData: any[] = [];
            const macroChartData: any[] = [];
            
            Object.keys(logsByDate).sort().forEach(date => {
                const logs = logsByDate[date];
                const dailySummary = logs.reduce((acc, log) => {
                    acc.calories += log.calories;
                    acc.protein += log.protein;
                    acc.carbs += log.carbs;
                    acc.fat += log.fat;
                    return acc;
                }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

                calorieChartData.push({ 
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                    Calories: Math.round(dailySummary.calories),
                    Goal: user.dailyCalorieGoal,
                });
                macroChartData.push({
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                    Protein: dailySummary.protein,
                    Carbs: dailySummary.carbs,
                    Fat: dailySummary.fat,
                })
            });
            setCalorieData(calorieChartData);
            setMacroData(macroChartData);

            // Weight Data
            const weightHistory = getWeightHistory(user.email);
            setWeightData(weightHistory.map(entry => ({
                date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Weight: entry.weight
            })));
        }
    }, [user]);

    const handleAddWeight = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && newWeight) {
            addWeightEntry(user.email, Number(newWeight));
            // Re-fetch and update state
            const updatedHistory = getWeightHistory(user.email);
            setWeightData(updatedHistory.map(entry => ({
                date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Weight: entry.weight
            })));
            setNewWeight('');
        }
    };
    
    const tickFormatter = (value: any) => typeof value === 'string' ? value : value.toString();

    return (
        <div className="space-y-6">
            <ChartCard title="Calorie Intake (Last 7 Days)">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={calorieData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="rgb(156 163 175)" />
                        <YAxis stroke="rgb(156 163 175)" />
                        <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Line type="monotone" dataKey="Calories" stroke="#34d399" strokeWidth={2} />
                        <Line type="monotone" dataKey="Goal" stroke="#60a5fa" strokeDasharray="5 5" strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ChartCard title="Weight History">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightData}>
                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="date" stroke="rgb(156 163 175)" tickFormatter={tickFormatter} />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="rgb(156 163 175)" />
                            <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Line type="monotone" dataKey="Weight" stroke="#f87171" strokeWidth={2} name="Weight (kg)" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Track Your Weight</h3>
                     <form onSubmit={handleAddWeight} className="space-y-4">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Log Today's Weight (kg)</label>
                        <input 
                            type="number"
                            step="0.1"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder={`Current: ${user?.weight} kg`}
                        />
                        <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity">Add Entry</button>
                    </form>
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Weekly Summary</h4>
                        <div className="text-sm space-y-2">
                           <p>Avg. Daily Calories: {Math.round(calorieData.reduce((sum, d) => sum + d.Calories, 0) / (calorieData.length || 1))} kcal</p>
                           <p>Highest Intake: {Math.max(...calorieData.map(d => d.Calories))} kcal</p>
                           <p>Lowest Intake: {Math.min(...calorieData.map(d => d.Calories))} kcal</p>
                        </div>
                    </div>
                </div>
            </div>

            <ChartCard title="Macro Distribution (Last 7 Days)">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={macroData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="rgb(156 163 175)" />
                        <YAxis stroke="rgb(156 163 175)" />
                        <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '0.5rem' }} formatter={(value: number) => `${value.toFixed(1)}g`} />
                        <Legend />
                        <Bar dataKey="Protein" stackId="a" fill="#34d399" />
                        <Bar dataKey="Carbs" stackId="a" fill="#60a5fa" />
                        <Bar dataKey="Fat" stackId="a" fill="#f87171" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

export default Progress;
