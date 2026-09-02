import { useState, type FormEvent } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import type { Recipe } from '@/types';

interface RecipeEditModalProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onClose: () => void;
}

export function RecipeEditModal({ recipe, onSave, onClose }: RecipeEditModalProps) {
  const [title, setTitle] = useState(recipe.title);
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [saving, setSaving] = useState(false);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setIngredients(ingredients.map((ing, i) => (i === index ? value : ing)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanedIngredients = ingredients.filter((i) => i.trim());
    if (!title.trim() || cleanedIngredients.length === 0 || !instructions.trim()) return;
    setSaving(true);
    onSave({
      ...recipe,
      title: title.trim(),
      ingredients: cleanedIngredients,
      instructions: instructions.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-stone-800">Edit Recipe</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove ingredient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add ingredient
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              rows={6}
              className="w-full resize-y rounded-lg border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm leading-relaxed text-stone-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
