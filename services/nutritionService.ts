
import { User } from '../types';

export const calculateBMR = (user: Pick<User, 'weight' | 'height' | 'age' | 'gender'>): number => {
  if (user.gender === 'male') {
    return 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
  } else {
    return 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
  }
};

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

export const calculateDailyCalorieGoal = (user: User): number => {
  const bmr = calculateBMR(user);
  const factor = activityFactors[user.activityLevel];
  return Math.round(bmr * factor);
};
