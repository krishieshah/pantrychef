import { useState } from 'react';
import { Clock, ChefHat, Trash2, Pencil, X } from 'lucide-react';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const stepCount = recipe.instructions
    .split('\n')
    .filter((s) => s.trim())
    .length;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChefHat className="h-12 w-12 text-white/30" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">{recipe.title}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center gap-4 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <ChefHat className="h-3.5 w-3.5" />
            {recipe.ingredients.length} ingredients
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {stepCount} steps
          </span>
        </div>

        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Ingredients</p>
          <ul className="flex flex-wrap gap-1.5">
            {recipe.ingredients.slice(0, expanded ? 100 : 4).map((ing, i) => (
              <li
                key={i}
                className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
              >
                {ing}
              </li>
            ))}
            {recipe.ingredients.length > 4 && !expanded && (
              <li className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                +{recipe.ingredients.length - 4} more
              </li>
            )}
          </ul>
        </div>

        {expanded && (
          <div className="mb-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Instructions</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600">
              {recipe.instructions}
            </p>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 rounded-lg border border-stone-200 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center rounded-lg border border-stone-200 p-1.5 text-stone-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
            aria-label="Edit recipe"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  onDelete();
                  setConfirmDelete(false);
                }}
                className="rounded-lg bg-red-500 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex items-center justify-center rounded-lg border border-stone-200 p-1.5 text-stone-500 transition-colors hover:bg-stone-50"
                aria-label="Cancel delete"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center rounded-lg border border-stone-200 p-1.5 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Delete recipe"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
