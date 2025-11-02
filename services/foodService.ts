
import { FoodLogEntry, MealType, WeightEntry, Recipe, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const getLocalStorageKey = (userEmail: string, key: string) => `calorie-tracker-${key}-${userEmail}`;

// Food Log Service
export const getFoodLogForDate = (userEmail: string, date: string): FoodLogEntry[] => {
  const key = getLocalStorageKey(userEmail, 'foodLogs');
  const allLogs: FoodLogEntry[] = JSON.parse(localStorage.getItem(key) || '[]');
  return allLogs.filter(entry => entry.timestamp.startsWith(date));
};

export const addFoodLogEntry = (userEmail: string, entry: Omit<FoodLogEntry, 'id' | 'timestamp'>): void => {
  const key = getLocalStorageKey(userEmail, 'foodLogs');
  const allLogs: FoodLogEntry[] = JSON.parse(localStorage.getItem(key) || '[]');
  const newEntry: FoodLogEntry = {
    ...entry,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  allLogs.push(newEntry);
  localStorage.setItem(key, JSON.stringify(allLogs));
};

export const deleteFoodLogEntry = (userEmail: string, entryId: string): void => {
    const key = getLocalStorageKey(userEmail, 'foodLogs');
    let allLogs: FoodLogEntry[] = JSON.parse(localStorage.getItem(key) || '[]');
    allLogs = allLogs.filter(entry => entry.id !== entryId);
    localStorage.setItem(key, JSON.stringify(allLogs));
};

export const getFoodLogsForPastNDays = (userEmail: string, days: number): { [date: string]: FoodLogEntry[] } => {
    const logsByDate: { [date: string]: FoodLogEntry[] } = {};
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        logsByDate[dateStr] = getFoodLogForDate(userEmail, dateStr);
    }
    return logsByDate;
}

// Weight History Service
export const getWeightHistory = (userEmail: string): WeightEntry[] => {
    const key = getLocalStorageKey(userEmail, 'weightHistory');
    return JSON.parse(localStorage.getItem(key) || '[]');
};

export const addWeightEntry = (userEmail: string, weight: number): void => {
    const key = getLocalStorageKey(userEmail, 'weightHistory');
    const history = getWeightHistory(userEmail);
    const today = new Date().toISOString().split('T')[0];
    const newEntry: WeightEntry = { date: today, weight };

    const existingIndex = history.findIndex(e => e.date === today);
    if (existingIndex > -1) {
        history[existingIndex] = newEntry;
    } else {
        history.push(newEntry);
    }
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    localStorage.setItem(key, JSON.stringify(history));
};

// Recipe Service
export const getRecipes = (userEmail: string): Recipe[] => {
    const key = getLocalStorageKey(userEmail, 'recipes');
    return JSON.parse(localStorage.getItem(key) || '[]');
};

export const saveRecipe = (userEmail: string, recipe: Omit<Recipe, 'id'>): void => {
    const key = getLocalStorageKey(userEmail, 'recipes');
    const recipes = getRecipes(userEmail);
    const newRecipe: Recipe = { ...recipe, id: uuidv4() };
    recipes.push(newRecipe);
    localStorage.setItem(key, JSON.stringify(recipes));
};

export const deleteRecipe = (userEmail: string, recipeId: string): void => {
    const key = getLocalStorageKey(userEmail, 'recipes');
    let recipes = getRecipes(userEmail);
    recipes = recipes.filter(r => r.id !== recipeId);
    localStorage.setItem(key, JSON.stringify(recipes));
}
