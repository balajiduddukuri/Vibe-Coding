
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, CalculatorIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="inline-block p-4 mb-4 text-white bg-gradient-primary rounded-xl">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{children}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <header className="py-6 px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        CalorieApp
                    </div>
                    <Link to="/auth" className="px-6 py-2 font-semibold text-white bg-gradient-primary rounded-lg shadow-md hover:opacity-90 transition-opacity">
                        Get Started
                    </Link>
                </nav>
            </header>

            <main>
                {/* Hero Section */}
                <section className="text-center py-20 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white">
                        Achieve Your Health Goals
                    </h1>
                    <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                        One Meal at a Time
                    </h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                        The modern, AI-powered way to track your calories, understand your nutrition, and build healthier habits effortlessly.
                    </p>
                    <div className="mt-8">
                        <Link to="/auth?mode=signup" className="inline-block px-8 py-4 font-bold text-lg text-white bg-gradient-primary rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                            Sign Up for Free
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-100 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Why You'll Love CalorieApp</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                                Everything you need to take control of your diet.
                            </p>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard icon={DocumentMagnifyingGlassIcon} title="Effortless Logging">
                                Quickly log meals with our extensive food database, manual entry, or simulated barcode scanner.
                            </FeatureCard>
                            <FeatureCard icon={ChartBarIcon} title="Visualize Progress">
                                See your journey unfold with beautiful charts for weight, calories, and macronutrients.
                            </FeatureCard>
                            <FeatureCard icon={CalculatorIcon} title="Recipe Analyzer">
                                Instantly calculate the nutritional information of your favorite home-cooked recipes.
                            </FeatureCard>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} CalorieApp. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
