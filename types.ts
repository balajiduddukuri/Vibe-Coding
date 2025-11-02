export interface User {
  name: string;
  email: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
  dailyCalorieGoal: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number; // per 100g
  carbs: number; // per 100g
  fat: number; // per 100g
  servingSize: number; // in g
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface FoodLogEntry {
  id: string;
  foodId: string;
  name: string;
  mealType: MealType;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number; // in kg
}

export interface RecipeIngredient extends Food {
  grams: number;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  ingredients: RecipeIngredient[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface WaterLogEntry {
  id: string;
  amount: number; // in ml
  timestamp: string;
}
