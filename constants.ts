
import { Food } from './types';

export const FOOD_DATABASE: Food[] = [
  { id: '1', name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: 182 },
  { id: '2', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: 118 },
  { id: '3', name: 'Chicken Breast (cooked)', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: 100 },
  { id: '4', name: 'Brown Rice (cooked)', calories: 123, protein: 2.7, carbs: 25.6, fat: 1, servingSize: 195 },
  { id: '5', name: 'Salmon (cooked)', calories: 206, protein: 22, carbs: 0, fat: 12, servingSize: 100 },
  { id: '6', name: 'Broccoli (steamed)', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, servingSize: 100 },
  { id: '7', name: 'Egg (large)', calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: 50 },
  { id: '8', name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 49, servingSize: 28 },
  { id: '9', name: 'Oats (uncooked)', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, servingSize: 80 },
  { id: '10', name: 'Greek Yogurt (plain)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: 170 },
  { id: '11', name: 'Quinoa (cooked)', calories: 120, protein: 4.1, carbs: 21.3, fat: 1.9, servingSize: 185 },
  { id: '12', name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: 200 },
  { id: '13', name: 'Sweet Potato (baked)', calories: 90, protein: 2, carbs: 21, fat: 0.1, servingSize: 180 },
  { id: '14', name: 'Tofu (firm)', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, servingSize: 100 },
  { id: '15', name: 'Milk (whole)', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, servingSize: 244 },
  { id: '16', name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, servingSize: 32 },
  { id: '17', name: 'White Bread', calories: 265, protein: 9, carbs: 49, fat: 3.2, servingSize: 25 },
  { id: '18', name: 'Pasta (cooked)', calories: 131, protein: 5, carbs: 25, fat: 1.1, servingSize: 140 },
  { id: '19', name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fat: 100, servingSize: 15 },
  { id: '20', name: 'Spinach (raw)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: 30 },
  { id: '21', name: 'Beef (ground, 85% lean)', calories: 217, protein: 19, carbs: 0, fat: 15, servingSize: 100 },
  { id: '22', name: 'Lentils (cooked)', calories: 116, protein: 9, carbs: 20, fat: 0.4, servingSize: 198 },
  { id: '23', name: 'Cheddar Cheese', calories: 404, protein: 25, carbs: 1.3, fat: 33, servingSize: 28 },
  { id: '24', name: 'Blueberries', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: 148 },
  { id: '25', name: 'Carrots (raw)', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, servingSize: 61 },
  { id: '26', name: 'Cucumber', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, servingSize: 104 },
  { id: '27', name: 'Tomatoes', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: 123 },
  { id: '28', name: 'Onion', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, servingSize: 110 },
  { id: '29', name: 'Bell Pepper (red)', calories: 31, protein: 1, carbs: 6, fat: 0.3, servingSize: 164 },
  { id: '30', name: 'Hummus', calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, servingSize: 30 },
  // ... a full app would have 50+
];

export const MOCK_BARCODE_DB: { [key: string]: Food } = {
  '123456789012': { id: '31', name: 'Protein Bar', calories: 400, protein: 20, carbs: 45, fat: 18, servingSize: 60 },
  '987654321098': { id: '10', name: 'Greek Yogurt (plain)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: 170 },
  '555555555555': { id: '9', name: 'Oats (uncooked)', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, servingSize: 80 },
};

export const ACTIVITY_LEVELS = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Lightly active (light exercise/sports 1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (moderate exercise/sports 3-5 days/week)' },
    { value: 'active', label: 'Very active (hard exercise/sports 6-7 days a week)' },
    { value: 'very', label: 'Extra active (very hard exercise/sports & physical job)' },
];
