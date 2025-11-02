import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addFoodLogEntry } from '../services/foodService';
import { FOOD_DATABASE, MOCK_BARCODE_DB } from '../constants';
import { Food, FoodLogEntry, MealType } from '../types';
import { MagnifyingGlassIcon, QrCodeIcon, PencilSquareIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { GoogleGenAI, Type } from '@google/genai';


const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject('Failed to convert blob to base64');
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

type LogMode = 'search' | 'manual' | 'scan' | 'ai';

const LogFood: React.FC = () => {
  const [mode, setMode] = useState<LogMode>('search');
  
  const renderContent = () => {
    switch(mode) {
      case 'search': return <SearchLogger />;
      case 'manual': return <ManualLogger />;
      case 'scan': return <BarcodeLogger />;
      case 'ai': return <AiLogger />;
      default: return <SearchLogger />;
    }
  }
  
  const TabButton: React.FC<{ currentMode: LogMode, targetMode: LogMode, setMode: (m: LogMode) => void, icon: React.ElementType, children: React.ReactNode }> = ({ currentMode, targetMode, setMode, icon: Icon, children }) => (
    <button onClick={() => setMode(targetMode)} className={`flex-1 flex items-center justify-center p-4 text-sm font-medium border-b-2 transition-colors ${currentMode === targetMode ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
        <Icon className="w-5 h-5 mr-2" />
        {children}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <TabButton currentMode={mode} targetMode='search' setMode={setMode} icon={MagnifyingGlassIcon}>Search</TabButton>
          <TabButton currentMode={mode} targetMode='ai' setMode={setMode} icon={SparklesIcon}>AI Scan</TabButton>
          <TabButton currentMode={mode} targetMode='manual' setMode={setMode} icon={PencilSquareIcon}>Manual</TabButton>
          <TabButton currentMode={mode} targetMode='scan' setMode={setMode} icon={QrCodeIcon}>Barcode</TabButton>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const commonInputClasses = "w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500";
const commonButtonClasses = "w-full px-4 py-3 font-bold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed";

const AddFoodForm: React.FC<{ food: Food, onAdd: () => void }> = ({ food, onAdd }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [grams, setGrams] = useState(food.servingSize);
    const [mealType, setMealType] = useState<MealType>('lunch');

    const calculated = useMemo(() => {
        const ratio = grams / 100;
        return {
            calories: food.calories * ratio,
            protein: food.protein * ratio,
            carbs: food.carbs * ratio,
            fat: food.fat * ratio,
        };
    }, [grams, food]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || grams <= 0) return;

        const newEntry: Omit<FoodLogEntry, 'id' | 'timestamp'> = {
            foodId: food.id,
            name: food.name,
            mealType,
            grams,
            ...calculated,
        };
        addFoodLogEntry(user.email, newEntry);
        onAdd();
        navigate('/dashboard');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{food.name}</h3>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Serving (g)</label>
                    <input type="number" value={grams} onChange={e => setGrams(Number(e.target.value))} className={commonInputClasses} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Meal</label>
                    <select value={mealType} onChange={e => setMealType(e.target.value as MealType)} className={commonInputClasses}>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snacks">Snacks</option>
                    </select>
                 </div>
            </div>
            <div className="text-center text-sm grid grid-cols-4 gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div><p className="font-bold">{Math.round(calculated.calories)}</p><p>kcal</p></div>
                <div><p className="font-bold">{calculated.protein.toFixed(1)}g</p><p>Protein</p></div>
                <div><p className="font-bold">{calculated.carbs.toFixed(1)}g</p><p>Carbs</p></div>
                <div><p className="font-bold">{calculated.fat.toFixed(1)}g</p><p>Fat</p></div>
            </div>
            <button type="submit" className={commonButtonClasses}>Add to Log</button>
        </form>
    );
};

const SearchLogger: React.FC = () => {
    const [query, setQuery] = useState('');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);

    const filteredFoods = useMemo(() => {
        if (!query) return [];
        return FOOD_DATABASE.filter(food => 
            food.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }, [query]);
    
    return (
        <div>
            <div className="relative">
                 <input type="text" placeholder="Search for a food..." value={query} onChange={e => {setQuery(e.target.value); setSelectedFood(null);}} className={commonInputClasses}/>
                {filteredFoods.length > 0 && !selectedFood && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                        {filteredFoods.map(food => (
                            <li key={food.id} onClick={() => { setSelectedFood(food); setQuery(food.name); }} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                {food.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedFood && <AddFoodForm food={selectedFood} onAdd={() => setSelectedFood(null)} />}
        </div>
    );
};

const AiLogger: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<Food[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) return;

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const base64Data = await blobToBase64(imageFile);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: `Analyze the meal in this image. Identify each food item, estimate its weight in grams, and provide its nutritional information (calories, protein, carbs, fat) per 100g.
                        Your response MUST be a JSON array of objects. Each object should represent a food item and have the following properties:
                        - "id": a unique string for this item.
                        - "name": The name of the food item.
                        - "calories": Calories per 100g.
                        - "protein": Protein in grams per 100g.
                        - "carbs": Carbohydrates in grams per 100g.
                        - "fat": Fat in grams per 100g.
                        - "servingSize": The estimated weight of the item in the image, in grams.
                        If you cannot identify any food, return an empty array.` },
                        { inlineData: { mimeType: imageFile.type, data: base64Data } }
                    ]
                },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fat: { type: Type.NUMBER },
                            servingSize: { type: Type.NUMBER },
                          },
                          required: ["id", "name", "calories", "protein", "carbs", "fat", "servingSize"],
                        },
                    }
                }
            });
            
            const jsonStr = response.text.trim();
            const result = JSON.parse(jsonStr);

            if (result && result.length > 0) {
                setAnalysisResult(result);
            } else {
                setError("Could not identify any food items in the image. Please try another one.");
            }

        } catch (err) {
            console.error("AI analysis failed:", err);
            setError("Sorry, something went wrong during the analysis. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload a photo of your meal, and our AI will identify the food items and estimate their nutritional values.
            </p>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-700/20 file:text-primary-600 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-700/30"
            />

            {imagePreview && (
                <div className="flex flex-col items-center gap-4">
                    <img src={imagePreview} alt="Meal preview" className="max-h-64 rounded-lg shadow-md" />
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isLoading} 
                        className={`${commonButtonClasses} max-w-xs`}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Meal'}
                    </button>
                </div>
            )}
            
            {isLoading && 
              <div className="flex justify-center items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 border-2 border-t-transparent border-primary-500 rounded-full animate-spin"></div>
                <span>Analyzing image...</span>
              </div>
            }
            
            {error && <p className="text-red-500 text-center">{error}</p>}

            {analysisResult && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI Analysis Results:</h3>
                    {analysisResult.map((food, index) => (
                        <AddFoodForm key={food.id || index} food={food} onAdd={() => {
                            setAnalysisResult(prev => prev ? prev.filter((_, i) => i !== index) : null);
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ManualLogger: React.FC = () => {
    const [foodData, setFoodData] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFoodData({ ...foodData, [e.target.name]: e.target.name === 'name' ? e.target.value : Number(e.target.value) });
    };

    const handlePrepare = (e: React.FormEvent) => {
        e.preventDefault();
        setShowForm(true);
    };

    const manualFood: Food = {
        id: `manual-${Date.now()}`,
        name: foodData.name,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        servingSize: 100
    };

    return (
        <div>
            <form onSubmit={handlePrepare} className="space-y-4">
                <input type="text" name="name" placeholder="Food Name" value={foodData.name} onChange={handleChange} className={commonInputClasses} required />
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">Nutrition per 100g</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input type="number" name="calories" placeholder="Calories" value={foodData.calories || ''} onChange={handleChange} className={commonInputClasses} required />
                    <input type="number" name="protein" placeholder="Protein (g)" value={foodData.protein || ''} onChange={handleChange} className={commonInputClasses} required />
                    <input type="number" name="carbs" placeholder="Carbs (g)" value={foodData.carbs || ''} onChange={handleChange} className={commonInputClasses} required />
                    <input type="number" name="fat" placeholder="Fat (g)" value={foodData.fat || ''} onChange={handleChange} className={commonInputClasses} required />
                </div>
                <button type="submit" className={commonButtonClasses} disabled={!foodData.name || foodData.calories <= 0}>Next</button>
            </form>
            {showForm && <AddFoodForm food={manualFood} onAdd={() => setShowForm(false)} />}
        </div>
    );
};

const BarcodeLogger: React.FC = () => {
    const [barcode, setBarcode] = useState('');
    const [foundFood, setFoundFood] = useState<Food | null>(null);
    const [error, setError] = useState('');

    const handleScan = () => {
        setError('');
        setFoundFood(null);
        const food = MOCK_BARCODE_DB[barcode];
        if (food) {
            setFoundFood(food);
        } else {
            setError('Barcode not found in our database.');
        }
    };

    return (
        <div>
            <div className="flex gap-2">
                <input type="text" placeholder="Enter barcode number" value={barcode} onChange={e => setBarcode(e.target.value)} className={commonInputClasses} />
                <button onClick={handleScan} className="px-6 py-2 font-semibold text-white bg-gradient-primary rounded-lg shadow-md hover:opacity-90 transition-opacity">Scan</button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {foundFood && <AddFoodForm food={foundFood} onAdd={() => setFoundFood(null)} />}
        </div>
    );
};

export default LogFood;