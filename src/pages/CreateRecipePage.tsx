import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Trash2, Loader2, AlertCircle, Save, ChefHat, Check } from 'lucide-react';
import { generateRecipe } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import type { GeneratedRecipe } from '@/types';

export function CreateRecipePage() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generated, setGenerated] = useState<GeneratedRecipe | null>(null);

  const handleIngredientChange = (index: number, value: string) => {
    setIngredients(ingredients.map((ing, i) => (i === index ? value : ing)));
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    const cleaned = ingredients.filter((i) => i.trim());
    if (cleaned.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setError(null);
    setGenerated(null);
    setGenerating(true);
    try {
      const result = await generateRecipe(cleaned);
      setGenerated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recipe');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated) return;
    setSaving(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('recipes').insert({
        title: generated.title,
        ingredients: generated.ingredients,
        instructions: generated.instructions,
      });
      if (insertError) throw new Error(insertError.message);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800 sm:text-3xl">Create a Recipe</h1>
        <p className="mt-1 text-sm text-stone-500">
          List the ingredients you have on hand and let AI suggest a recipe.
        </p>
      </div>

      {/* Ingredient Input Section */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
          <ChefHat className="h-4 w-4 text-emerald-500" />
          Your Ingredients
        </h2>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="space-y-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1} (e.g. chicken breast, rice, tomatoes)`}
                  className="flex-1 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove ingredient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddIngredient}
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add another ingredient
          </button>

          {error && !generated && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={generating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating your recipe...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Recipe
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Recipe Section */}
      {generating && !generated && (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <ChefHat className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="absolute -inset-1 animate-ping rounded-full border-2 border-emerald-200 opacity-50" />
            </div>
            <p className="mt-4 text-sm font-medium text-stone-600">Cooking up something delicious...</p>
          </div>
        </div>
      )}

      {generated && (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-stone-800">Your AI-Generated Recipe</h2>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Recipe saved! Redirecting to your dashboard...</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Recipe Title
              </label>
              <input
                type="text"
                value={generated.title}
                onChange={(e) => setGenerated({ ...generated, title: e.target.value })}
                className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-base font-semibold text-stone-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Ingredients
              </label>
              <div className="space-y-2">
                {generated.ingredients.map((ing, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ing}
                      onChange={(e) => {
                        const newIngredients = [...generated.ingredients];
                        newIngredients[index] = e.target.value;
                        setGenerated({ ...generated, ingredients: newIngredients });
                      }}
                      className="flex-1 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newIngredients = generated.ingredients.filter((_, i) => i !== index);
                        setGenerated({ ...generated, ingredients: newIngredients });
                      }}
                      className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setGenerated({ ...generated, ingredients: [...generated.ingredients, ''] })}
                  className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                  Add ingredient
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Instructions
              </label>
              <textarea
                value={generated.instructions}
                onChange={(e) => setGenerated({ ...generated, instructions: e.target.value })}
                rows={8}
                className="w-full resize-y rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm leading-relaxed text-stone-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || success}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : success ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save to My Recipes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
