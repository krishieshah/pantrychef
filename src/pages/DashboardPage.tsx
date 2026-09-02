import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Recipe } from '@/types';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeEditModal } from '@/components/RecipeEditModal';
import { Plus, Loader2, UtensilsCrossed } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }
    setRecipes(data ?? []);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
      console.error('Error deleting recipe:', error);
      return;
    }
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveEdit = async (updated: Recipe) => {
    const { error } = await supabase
      .from('recipes')
      .update({
        title: updated.title,
        ingredients: updated.ingredients,
        instructions: updated.instructions,
      })
      .eq('id', updated.id);
    if (error) {
      console.error('Error updating recipe:', error);
      return;
    }
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditingRecipe(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 sm:text-3xl">My Recipes</h1>
          <p className="mt-1 text-sm text-stone-500">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          New Recipe
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white/50 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <UtensilsCrossed className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-stone-700">No recipes yet</h2>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Head to the Create page, list the ingredients you have on hand, and let AI cook up a recipe for you.
          </p>
          <Link
            to="/create"
            className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create your first recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={() => setEditingRecipe(recipe)}
              onDelete={() => handleDelete(recipe.id)}
            />
          ))}
        </div>
      )}

      {editingRecipe && (
        <RecipeEditModal
          recipe={editingRecipe}
          onSave={handleSaveEdit}
          onClose={() => setEditingRecipe(null)}
        />
      )}
    </div>
  );
}
