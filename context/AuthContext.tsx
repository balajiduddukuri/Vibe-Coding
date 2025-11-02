
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
  signup: (userData: Omit<User, 'dailyCalorieGoal'> & { password?: string }) => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserEmail = localStorage.getItem('calorie-tracker-currentUser');
      if (storedUserEmail) {
        const usersStr = localStorage.getItem('calorie-tracker-users');
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];
        const currentUser = users.find(u => u.email === storedUserEmail) || null;
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    const usersStr = localStorage.getItem('calorie-tracker-users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('calorie-tracker-currentUser', email);
    } else {
      throw new Error("User not found");
    }
  };

  const signup = (userData: Omit<User, 'dailyCalorieGoal'>) => {
    const usersStr = localStorage.getItem('calorie-tracker-users');
    let users: User[] = usersStr ? JSON.parse(usersStr) : [];
    if (users.some(u => u.email === userData.email)) {
      throw new Error("User already exists");
    }
    const newUser: User = { ...userData, dailyCalorieGoal: 2000 }; // Default goal, will be recalculated
    users.push(newUser);
    localStorage.setItem('calorie-tracker-users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('calorie-tracker-currentUser', newUser.email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('calorie-tracker-currentUser');
  };

  const updateUser = (updatedUser: User) => {
     const usersStr = localStorage.getItem('calorie-tracker-users');
    let users: User[] = usersStr ? JSON.parse(usersStr) : [];
    users = users.map(u => u.email === updatedUser.email ? updatedUser : u);
    localStorage.setItem('calorie-tracker-users', JSON.stringify(users));
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
