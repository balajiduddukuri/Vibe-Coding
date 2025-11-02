import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveRecipe, getRecipes, deleteRecipe } from '../services/foodService';
import { FOOD_DATABASE } from '../constants';
import { Food, Recipe, RecipeIngredient } from '../types';
import { TrashIcon, PlusIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

const RecipeAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [view, setView] = useState<'list' | 'create'>('list');

  useEffect(() => {
    if (user) {
      setRecipes(getRecipes(user.email));
    }
  }, [user, view]);

  const handleDeleteRecipe = (recipeId: string) => {
    if(user) {
        deleteRecipe(user.email, recipeId);
        setRecipes(getRecipes(user.email));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Recipes</h2>
        <button onClick={() => setView(view === 'list' ? 'create' : 'list')} className="flex items-center px-4 py-2 font-semibold text-white bg-gradient-primary rounded-lg shadow-md hover:opacity-90 transition-opacity">
          {view === 'list' ? <><PlusIcon className="w-5 h-5 mr-2" /> Create New</> : 'Back to List'}
        </button>
      </div>

      {view === 'create' ? (
        <CreateRecipeForm onRecipeCreated={() => setView('list')} />
      ) : (
        <RecipeList recipes={recipes} onDelete={handleDeleteRecipe} />
      )}
    </div>
  );
};


const CreateRecipeForm: React.FC<{onRecipeCreated: () => void}> = ({ onRecipeCreated }) => {
    const { user } = useAuth();
    const [recipeName, setRecipeName] = useState('');
    const [servings, setServings] = useState(1);
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFoods = useMemo(() => {
        if (!searchQuery) return [];
        return FOOD_DATABASE.filter(food =>
            food.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [searchQuery]);

    const handleAddIngredient = (food: Food, grams: number) => {
        const newIngredient: RecipeIngredient = { ...food, grams };
        setIngredients([...ingredients, newIngredient]);
        setSearchQuery('');
    };
    
    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const totals = useMemo(() => {
        return ingredients.reduce((acc, ing) => {
            const ratio = ing.grams / 100;
            acc.calories += ing.calories * ratio;
            acc.protein += ing.protein * ratio;
            acc.carbs += ing.carbs * ratio;
            acc.fat += ing.fat * ratio;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [ingredients]);
    
    const perServing = {
        calories: totals.calories / servings,
        protein: totals.protein / servings,
        carbs: totals.carbs / servings,
        fat: totals.fat / servings,
    };

    const handleSaveRecipe = () => {
        if (!user || !recipeName || ingredients.length === 0 || servings < 1) return;
        const newRecipe: Omit<Recipe, 'id'> = {
            name: recipeName,
            servings,
            ingredients,
            totalCalories: totals.calories,
            totalProtein: totals.protein,
            totalCarbs: totals.carbs,
            totalFat: totals.fat,
        };
        saveRecipe(user.email, newRecipe);
        // FIX: Destructure onRecipeCreated from props to make it available in the component scope.
        onRecipeCreated();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side: Form & Ingredients */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
                 <input type="text" placeholder="Recipe Name" value={recipeName} onChange={e => setRecipeName(e.target.value)} className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                 <div className="relative">
                    <input type="text" placeholder="Add ingredient..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    {filteredFoods.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                            {filteredFoods.map(food => (
                                <IngredientSearchItem key={food.id} food={food} onAdd={handleAddIngredient} />
                            ))}
                        </ul>
                    )}
                 </div>
                 
                <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                    {ingredients.map((ing, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <span>{ing.name} ({ing.grams}g)</span>
                            <button onClick={() => handleRemoveIngredient(index)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                        </div>
                    ))}
                </div>
            </div>
             {/* Right side: Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
                 <div className="flex items-center gap-4">
                    <label>Servings:</label>
                    <input type="number" min="1" value={servings} onChange={e => setServings(Number(e.target.value) || 1)} className="w-24 px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                 </div>
                 <div className="space-y-2">
                     <h4 className="font-semibold">Total Nutrition</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div><p className="font-bold">{Math.round(totals.calories)}</p><p>kcal</p></div>
                        <div><p className="font-bold">{totals.protein.toFixed(1)}g</p><p>Protein</p></div>
                        <div><p className="font-bold">{totals.carbs.toFixed(1)}g</p><p>Carbs</p></div>
                        <div><p className="font-bold">{totals.fat.toFixed(1)}g</p><p>Fat</p></div>
                     </div>
                 </div>
                 <div className="space-y-2">
                     <h4 className="font-semibold">Per Serving</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div><p className="font-bold">{Math.round(perServing.calories)}</p><p>kcal</p></div>
                        <div><p className="font-bold">{perServing.protein.toFixed(1)}g</p><p>Protein</p></div>
                        <div><p className="font-bold">{perServing.carbs.toFixed(1)}g</p><p>Carbs</p></div>
                        <div><p className="font-bold">{perServing.fat.toFixed(1)}g</p><p>Fat</p></div>
                     </div>
                 </div>
                 <button onClick={handleSaveRecipe} disabled={!recipeName || ingredients.length === 0 || servings < 1} className="w-full px-4 py-3 font-bold text-white bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">Save Recipe</button>
            </div>
        </div>
    );
}

const IngredientSearchItem: React.FC<{ food: Food; onAdd: (food: Food, grams: number) => void }> = ({ food, onAdd }) => {
    const [grams, setGrams] = useState(100);
    return (
        <li className="px-4 py-2 flex items-center justify-between">
            <span>{food.name}</span>
            <div className="flex items-center gap-2">
                <input type="number" value={grams} onChange={e => setGrams(Number(e.target.value))} className="w-20 text-sm p-1 rounded border bg-gray-100 dark:bg-gray-600"/>
                <button onClick={() => onAdd(food, grams)} className="p-1 bg-primary-500 text-white rounded"><PlusIcon className="w-4 h-4"/></button>
            </div>
        </li>
    );
};

const RecipeList: React.FC<{ recipes: Recipe[], onDelete: (id: string) => void }> = ({ recipes, onDelete }) => {
    if (recipes.length === 0) {
        return <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <DocumentPlusIcon className="w-12 h-12 mx-auto text-gray-400"/>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No recipes saved</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new recipe to get started.</p>
        </div>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative">
                    <button onClick={() => onDelete(recipe.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                    <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</p>
                    <div className="text-sm space-y-1">
                        <p className="font-semibold">Nutrition per serving:</p>
                        <p>Calories: <span className="font-medium">{Math.round(recipe.totalCalories / recipe.servings)} kcal</span></p>
                        <p>Protein: <span className="font-medium">{(recipe.totalProtein / recipe.servings).toFixed(1)}g</span></p>
                        <p>Carbs: <span className="font-medium">{(recipe.totalCarbs / recipe.servings).toFixed(1)}g</span></p>
                        <p>Fat: <span className="font-medium">{(recipe.totalFat / recipe.servings).toFixed(1)}g</span></p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RecipeAnalyzer;